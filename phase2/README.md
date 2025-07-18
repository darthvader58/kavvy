# Kaavy Phase2

## Overview
Phase 2 aims to match users/authors with the most ideal publishing houses.

## Project Structure

`coords_cache.json`: File for caching coordinates in memory for quick retrieval

`publishers.csv`: Csv file containing all data on publishers

`publisher_matcher.py`: A matching system that matches using a weighted scoring algorithm. The script analyzes publisher data from a CSV file and ranks publishers based on how well they match an author's specific requirements and preferences.

`requirements.txt`: Contains project dependencies

### How It Works

The script uses a multi-criteria scoring system that evaluates publishers across nine parameters:

**Core Matching Criteria:**
- **Geographic Distance** - Calculates physical distance between author and publisher locations
- **Subject Matter Overlap** - Matches author's book subjects with publisher specializations
- **Manuscript Requirements** - Whether full manuscript is needed vs. proposals
- **Chapter Requirements** - Whether partial chapters are acceptable
- **Agent Requirements** - Whether the publisher requires literary agent representation
- **Peer Review Process** - Whether the publisher uses peer review
- **Proposal Acceptance** - Whether proposals are accepted instead of full manuscripts
- **Academic Focus** - Whether the publisher specializes in academic works
- **Religious Focus** - Whether the publisher specializes in religious content

### Scoring Algorithm

Each parameter is assigned a configurable weight that determines its importance in the final match percentage:

```python
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
```
or another example

```python
WEIGHTS = {
    "distance": 10,             # Highest priority
    "subjects": 9,          
    "manuscript_needed": 8,
    "chapters_needed": 7,
    "requires_agent": 6,
    "peer_reviewed": 5,
    "proposal_required": 4,
    "academic_focus": 3,
    "religious_focus": 2,       # Lowest priority
}
```

## Usage

**1. Step 1**:

Start python virtual environment & activate
```bash
python -m venv .venv
source .venv/bin/activate
```
or, on Windows:
```powershell
python -m venv .venv
.venv/Scripts/activate
```

**2. Step 2**:

Install dependencies
```bash
pip install -r requirements.txt
```

**3. Step 3**:

Run the script
```bash
python publisher_matcher.py
```

## Examples:

Sample Input:
```bash
Your location (city / state / country): Phoenix, Arizona
Subjects (comma‑separated, blank = no preference): Fiction
Full manuscript ready? (Y/N): Y
Partial chapters ready? (Y/N): Y
OK with publishers that *require* an agent? (Y/N): N
Require peer‑reviewed press? (Y/N): N
Willing to send proposal (vs. full MS)? (Y/N): Y
Want an academic press? (Y/N): N
Want a religious press? (Y/N): N
```

Sample Output:
```bash
Top matches:
1. Grace Notes Books — 86.7%
   Location: Ventura, United States
   Website : https://www.gracenotesbooks.com/
   Subjects: Poetry, Photography, Literature, Fiction, Essays, Crafts, Art

2. Building Voices — 86.7%
   Location: Torrance, United States
   Website : https://buildingvoices.com/
   Subjects: Young Adult, Teaching, Picture Books, Juvenile, Inspirational, Fiction, Education, Children's

3. Tachyon Publications — 80.0%
   Location: San Francisco, US
   Website : www.tachyonpublications.com
   Subjects: Science Fiction, Fantasy, Horror, Mystery & Crime, Biographies & Memoirs, Young Adult, Literary Fiction, Fiction, Short Story, Children's, and Novella

4. High Plains Press — 80.0%
   Location: Cheyenne, US
   Website : www.highplainspress.com
   Subjects: Westerns, Fiction, and Poetry

5. Simon & Schuster — 80.0%
   Location: La Jolla, United States
   Website : https://www.simonandschuster.com/
   Subjects: Biographies, Memoirs, Literary Fiction, Mystery & Crime, Thriller & Suspense, History, Politics, Romance, Young Adult, Sports & Outdoors, Nonfiction, Fiction, Poetry, Short Story, Novella, and Children's
```