import re
import spacy
import subprocess
import sys
from transformers import pipeline

def download_spacy_model(model_name="en_core_web_sm"):
    """Download spaCy model if not available"""
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", model_name])
        print(f"Successfully downloaded {model_name}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to download {model_name}: {e}")
        return False

def load_spacy_model(model_name="en_core_web_sm"):
    """Load spaCy model, download if necessary"""
    try:
        nlp = spacy.load(model_name)
        print(f"Loaded spaCy model: {model_name}")
        return nlp
    except OSError:
        print(f"Model '{model_name}' not found. Attempting to download...")
        if download_spacy_model(model_name):
            try:
                nlp = spacy.load(model_name)
                print(f"Successfully loaded {model_name} after download")
                return nlp
            except OSError:
                print(f"Failed to load {model_name} even after download")
                return None
        else:
            print(f"Could not download {model_name}")
            return None

# Load spaCy model for NER (with auto-download)
print("Loading spaCy model...")
nlp = load_spacy_model("en_core_web_sm")

if nlp is None:
    print("Cannot proceed without spaCy model. Exiting...")
    sys.exit(1)

# Load Hugging Face zero-shot classifier
print("Loading Hugging Face classifier...")
try:
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    print("Loaded Hugging Face classifier")
except Exception as e:
    print(f"Failed to load Hugging Face classifier: {e}")
    sys.exit(1)

# Extract Author Location
def extract_location_spacy(text):
    doc = nlp(text)
    return [ent.text for ent in doc.ents if ent.label_ == "GPE"]

def extract_location_regex(text):
    pattern = re.compile(r"(Location|Lives in|From|Based in):?\s+([A-Z][a-zA-Z\s,]+)")
    return [match[1] for match in pattern.findall(text)]

def get_author_location(text):
    locs_spacy = extract_location_spacy(text) or []
    locs_regex = extract_location_regex(text) or []
    all_locations = list(set(locs_spacy + locs_regex))
    return all_locations if all_locations else None

# Predict Genre
def predict_genre(text):
    candidate_labels = ["Romance", "Science Fiction", "Fantasy", "Mystery", "Thriller", "Non-Fiction", "Drama", "Comedy", "Historical", "Adventure"]
    result = classifier(text, candidate_labels, multi_label=True)
    return list(zip(result["labels"], result["scores"]))

# Predict Academic Focus
def predict_academic_focus(text):
    result = classifier(text, candidate_labels=["Academic", "Not academic"])
    return result["labels"][0]  

# Predict Religious Focus
def predict_religious_focus(text):
    result = classifier(text, candidate_labels=["Religious", "Not religious"])
    return result["labels"][0]  # Best match

# Main Entry Function
def analyze_manuscript(text):
    print("\n🔍 Analyzing Manuscript...\n")
    
    location = get_author_location(text)
    print("📍 Author Location(s):", location or "Not found")

    genre = predict_genre(text[:1000])  
    print("\n📚 Top Genres:")
    for label, score in genre[:3]:
        print(f"  - {label} ({score:.2%})")

    academic = predict_academic_focus(text[:1000])
    print("\n🎓 Academic Focus:", academic)

    religious = predict_religious_focus(text[:1000])
    print("✝️ Religious Focus:", religious)

# For Testing
if __name__ == "__main__":
    filepath = input("Enter path to manuscript text file: ").strip()
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            manuscript_text = f.read()
        analyze_manuscript(manuscript_text)
    except FileNotFoundError:
        print(f"File not found: {filepath}")
    except Exception as e:
        print(f"Error reading file: {e}")