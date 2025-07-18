import sys, json, time, difflib
from pathlib import Path
from typing import Tuple, Optional

import pandas as pd
from geopy.geocoders import Nominatim
from geopy.distance import geodesic

# CONFIGURABLE WEIGHTS
WEIGHTS = {
    "distance": 4,     
    "subjects": 4,          
    "manuscript_needed": 1,
    "chapters_needed": 1,
    "requires_agent": 1,
    "peer_reviewed": 1,
    "proposal_required": 1,
    "academic_focus": 1,
    "religious_focus": 1,
}
TOTAL_POSSIBLE = sum(WEIGHTS.values())

DIST_BUCKETS = [
    (100, 1.00),
    (500, 0.75),
    (1000, 0.50),
    (2000, 0.25),
    (float("inf"), 0.00),
]

CACHE_FILE = Path("coords_cache.json")
geolocator = Nominatim(user_agent="publisher_matcher", timeout=10)

# 1.  GEOCODING HELPERS
def load_cache() -> dict:
    if CACHE_FILE.exists():
        with open(CACHE_FILE, "r", encoding="utf‑8") as f:
            return json.load(f)
    return {}


def save_cache(cache: dict) -> None:
    with open(CACHE_FILE, "w", encoding="utf‑8") as f:
        json.dump(cache, f)


def geocode_location(location: str, cache: dict) -> Optional[Tuple[float, float]]:
    """
    Return (lat, lon) using cached value or querying Nominatim once.
    Returns None on failure.
    """
    if location in cache:
        return cache[location]

    try:
        loc = geolocator.geocode(location)
        if loc:
            coords = (loc.latitude, loc.longitude)
            cache[location] = coords
            time.sleep(1.0)
            return coords
    except Exception as e:
        print(f"   ⚠️  Geocoding failed for '{location}': {e}")
    cache[location] = None
    return None


# 2.  LOAD & NORMALISE PUBLISHER DATA
def load_publishers(csv_path: Path) -> pd.DataFrame:
    df = pd.read_csv(csv_path).fillna("")

    # prep subjects list
    df["Subjects_list"] = (
        df["Subjects"]
        .astype(str)
        .str.split(",")
        .apply(lambda lst: [s.strip().lower() for s in lst if s.strip()])
    )

    # normalise flags
    flag_cols = [
        "Manuscript Needed (Y/N)",
        "Chapters Needed (Y/N)",
        "requires_agent",
        "peer_reviewed",
        "proposal_required",
        "academic_focus",
        "religious_focus",
        "in_house",
    ]
    df[flag_cols] = (
        df[flag_cols]
        .replace("", "N")
        .astype(str)
        .apply(lambda col: col.str.upper().str.strip())
    )

    return df

# 3.  USER PROMPTS
def ask(prompt: str, yes_no: bool = False) -> str:
    while True:
        val = input(prompt).strip()
        if yes_no:
            val = val.upper()
            if val in {"Y", "N", ""}:
                return val or "N"
        else:
            return val


def get_preferences() -> dict:
    prefs = {
        "user_location": ask("Your location (city / state / country): "),
        "subjects": [
            s.strip().lower()
            for s in ask("Subjects (comma‑separated, blank = no preference): ").split(",")
            if s.strip()
        ],
        "manuscript_needed": ask("Full manuscript ready? (Y/N): ", yes_no=True),
        "chapters_needed": ask("Partial chapters ready? (Y/N): ", yes_no=True),
        "requires_agent": ask("OK with publishers that *require* an agent? (Y/N): ", yes_no=True),
        "peer_reviewed": ask("Require peer‑reviewed press? (Y/N): ", yes_no=True),
        "proposal_required": ask("Willing to send proposal (vs. full MS)? (Y/N): ", yes_no=True),
        "academic_focus": ask("Want an academic press? (Y/N): ", yes_no=True),
        "religious_focus": ask("Want a religious press? (Y/N): ", yes_no=True),
    }
    return prefs


# 4.  SCORING
def distance_score(miles: float) -> float:
    for cutoff, score in DIST_BUCKETS:
        if miles <= cutoff:
            return score
    return 0.0


def score_publisher(pub_row: pd.Series, prefs: dict, cache: dict, user_coords: Tuple[float, float]) -> float:
    score = 0.0

    # distance
    pub_loc_str = str(pub_row["Regional Preference/Origin Location"])
    pub_coords = geocode_location(pub_loc_str, cache)
    if pub_coords and user_coords:
        miles = geodesic(user_coords, pub_coords).miles
        score += distance_score(miles) * WEIGHTS["distance"]

    # subjects
    if prefs["subjects"]:
        overlap = len(set(pub_row["Subjects_list"]) & set(prefs["subjects"])) / len(
            prefs["subjects"]
        )
        score += overlap * WEIGHTS["subjects"]

    # flag matches
    flag_map = {
        "manuscript_needed": "Manuscript Needed (Y/N)",
        "chapters_needed": "Chapters Needed (Y/N)",
        "requires_agent": "requires_agent",
        "peer_reviewed": "peer_reviewed",
        "proposal_required": "proposal_required",
        "academic_focus": "academic_focus",
        "religious_focus": "religious_focus",
    }
    for pref_key, col in flag_map.items():
        want = prefs[pref_key]
        if want == "" or want == pub_row[col]:
            score += WEIGHTS[pref_key]

    return (score / TOTAL_POSSIBLE) * 100.0


# 5.  MAIN
def main():
    # get CSV
    if len(sys.argv) > 2:
        print("Usage: python publisher_matcher.py [publishers.csv]")
        sys.exit(1)
    csv_path = Path(sys.argv[1]) if len(sys.argv) == 2 else Path("publishers.csv")
    if not csv_path.exists():
        print(f"CSV not found: {csv_path.resolve()}")
        sys.exit(1)

    df = load_publishers(csv_path)
    df = df[df["in_house"] != "Y"].copy()  # exclude in‑house only

    prefs = get_preferences()

    # geocode user location once
    cache = load_cache()
    user_coords = geocode_location(prefs["user_location"], cache)
    if not user_coords:
        print("\n⚠️  Could not geocode your location; distance weight will be zero.")
    save_cache(cache)  # save any new coords immediately

    # score
    df["match_percent"] = df.apply(
        lambda row: score_publisher(row, prefs, cache, user_coords), axis=1
    ).round(1)
    save_cache(cache)  # save publisher coords
    top = df[df["match_percent"] > 0].sort_values("match_percent", ascending=False).head(5)

    # output
    if top.empty:
        print("\nNo suitable publishers found with current criteria.")
        return

    print("\nTop matches:")
    for i, (_, row) in enumerate(top.iterrows(), 1):
        print(
            f"{i}. {row['Publisher']} — {row['match_percent']}%\n"
            f"   Location: {row['Regional Preference/Origin Location']}\n"
            f"   Website : {row['Website']}\n"
            f"   Subjects: {row['Subjects']}\n"
        )


if __name__ == "__main__":
    main()