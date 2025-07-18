# Kaavy Phase3

## Overview

Created script that is able to analyze manuscripts and derive details.

 work includes a recommender model to help users/authors improve their manuscripts.

## Project Structure

* `manuscripts/`: Folder containing sample manuscript text and pdfs

* `manuscript_model.py`: Script to analyze manuscript inputs. Returns the following parameters:
    * Author location: Will return the location of author if available in the manuscript
    * Most likely genres: Returns top 3 predictions of which genre the manuscript is
    * Academic Focus: Will return if manuscript is or is not an academic focus
    * Religious Focus: Will return if manuscript is or is not a religious focus

* `requirements.txt`: File including all dependencies for the project


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
python manuscript_model.py
```

**4. Step 4**:

When prompted, enter path to the manuscript text file.
Relative paths are allowed, here are the included ones in `manuscripts/` to use for example:
* `manuscripts/Sample_manuscript1.txt`
* `manuscripts/Sample_manuscript2.txt`

During runtime it will look like this:
```bash
Enter path to manuscript text file: manuscripts/Sample_manuscript1.txt
```

## Examples:

Sample Input:
```bash
(.venv) .venvjalqur@Johns-MacBook-Air phase3_scripts % python manuscript_model.py
Loading spaCy model...
Loaded spaCy model: en_core_web_sm
Loading Hugging Face classifier...
Device set to use mps:0
Loaded Hugging Face classifier
Enter path to manuscript text file: manuscripts/Sample_manuscript1.txt
```

Sample Output:
```bash
🔍 Analyzing Manuscript...

📍 Author Location(s): ['Bridgeport', 'Nevada', 'Cambridge', 'mulch', 'Sun Forge', 'Boston', 'n’t', 'Yerington', 'McFarland', 'Eileen', 'ark']

📚 Top Genres:
  - Historical (45.22%)  - Science Fiction (28.64%)
  - Fantasy (12.66%)

🎓 Academic Focus: Not academic
✝️ Religious Focus: Religious
```
