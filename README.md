# Kaavy

## Folder Structure

### `all_data/`

This folder contains all data files as CSV.

#### Contents:

- **`publisher_author_data.csv`**  
  Combined dataset which has data on all the authors and their works for each publisher.

- **`publisher_names_only.csv`**  
  CSV file containing a list of only publisher names.

- **`publisher_full_data.csv`**  
  Comprehensive dataset containing full data on all publishers.

---

### `authorsScrapers/`

This folder contains all scripts and data files related to scraping and analyzing author information.

#### Contents:

- **`author_scraper_fast.py`**  
  Main script to scrape author data efficiently using the list of publishers provided in `publishers.csv`.

- **`author_scraper.py`**  
  A significantly slower version of the scraper. *Deprecated — do not use.*

- **`data_examiner.ipynb`**  
  Jupyter Notebook used for inspecting and analyzing the scraped author data.

- **`all_authors.csv`**  
  Main output CSV containing all newly collected author information.

- **`publisher_authors_data.csv`**  
  A backup or alternative copy of `all_authors.csv`, containing the same author data.

- **`publishers.csv`**  
  Input file listing the names of all publishers to be used for scraping.

- **`requirements.txt`**  
  Lists all Python dependencies required to run the scraping scripts.
