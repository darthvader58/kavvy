""" 
This script was used because author_scraper.py was too slow. This one uses 10 workers at once
Used on 6/09/2025 when revisitng phase 2 because of not enough author data
This script collected up to 40 authors from each publishing house
"""

import pandas as pd
import requests
import time
import csv
from bs4 import BeautifulSoup
import json
import re
from urllib.parse import quote_plus, urljoin
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import logging
import concurrent.futures
import threading
from threading import Lock

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# CONFIGURATION
START_FROM_PUBLISHER = 321  # Resume from where you left off
MAX_WORKERS = 10  # Number of parallel threads
FAST_GOODREADS = True  # Reduced delays for Goodreads

class PublisherAuthorScraper:
    def __init__(self, input_csv_path, output_csv_path):
        self.input_csv_path = input_csv_path
        self.output_csv_path = output_csv_path
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Thread-safe WebDriver pool
        self.driver_pool = []
        self.driver_lock = Lock()
        self.setup_driver_pool()
        
        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 0.5 if FAST_GOODREADS else 1  # Reduced interval
        self.request_lock = Lock()
        
        # Results storage
        self.results = []
        self.results_lock = Lock()
        
    def setup_driver_pool(self):
        """Setup multiple Chrome WebDriver instances for parallel processing"""
        for i in range(MAX_WORKERS):
            try:
                chrome_options = Options()
                chrome_options.binary_location = '/usr/bin/chromium-browser'
                chrome_options.add_argument('--headless')
                chrome_options.add_argument('--no-sandbox')
                chrome_options.add_argument('--disable-dev-shm-usage')
                chrome_options.add_argument('--disable-gpu')
                chrome_options.add_argument('--disable-extensions')
                chrome_options.add_argument('--disable-plugins')
                chrome_options.add_argument('--disable-images')
                chrome_options.add_argument('--window-size=1920,1080')
                chrome_options.add_argument(f'--remote-debugging-port={9222 + i}')
                chrome_options.add_argument('--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
                
                driver = webdriver.Chrome(options=chrome_options)
                self.driver_pool.append(driver)
                logger.info(f"Chrome WebDriver {i+1} initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize WebDriver {i+1}: {e}")
                self.driver_pool.append(None)
    
    def get_driver(self):
        """Get an available driver from the pool"""
        with self.driver_lock:
            for driver in self.driver_pool:
                if driver:
                    return driver
        return None
    
    def rate_limit(self):
        """Implement thread-safe rate limiting"""
        with self.request_lock:
            current_time = time.time()
            time_since_last = current_time - self.last_request_time
            if time_since_last < self.min_request_interval:
                sleep_time = self.min_request_interval - time_since_last
                time.sleep(sleep_time)
            self.last_request_time = time.time()
    
    def get_google_books_authors(self, publisher_name, max_authors=40):
        """Get authors from Google Books API for a given publisher"""
        authors = []
        try:
            query = f'inpublisher:"{publisher_name}"'
            url = f'https://www.googleapis.com/books/v1/volumes'
            
            start_index = 0
            max_results = 40
            
            while len(authors) < max_authors and start_index < 400:
                params = {
                    'q': query,
                    'startIndex': start_index,
                    'maxResults': max_results,
                    'fields': 'items(volumeInfo(title,authors,pageCount,categories,publishedDate,publisher))'
                }
                
                self.rate_limit()
                response = self.session.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    items = data.get('items', [])
                    
                    if not items:
                        break
                    
                    for item in items:
                        volume_info = item.get('volumeInfo', {})
                        book_authors = volume_info.get('authors', [])
                        book_title = volume_info.get('title', '')
                        page_count = volume_info.get('pageCount', 0)
                        categories = volume_info.get('categories', [])
                        genre = categories[0] if categories else 'Unknown'
                        
                        if book_authors and len(authors) < max_authors:
                            author = book_authors[0]
                            if author not in [a['name'] for a in authors]:
                                authors.append({
                                    'name': author,
                                    'publisher': publisher_name,
                                    'sample_book': book_title,
                                    'sample_book_pages': page_count,
                                    'sample_book_genre': genre
                                })
                    
                    start_index += max_results
                else:
                    break
                    
        except Exception as e:
            logger.error(f"Error getting authors from Google Books for {publisher_name}: {e}")
        
        return authors[:max_authors]
    
    def get_openlibrary_authors(self, publisher_name, max_authors=20):
        """Get additional authors from OpenLibrary API"""
        authors = []
        try:
            url = 'https://openlibrary.org/search.json'
            params = {
                'publisher': publisher_name,
                'limit': 100,
                'fields': 'title,author_name,number_of_pages_median,subject'
            }
            
            self.rate_limit()
            response = self.session.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                docs = data.get('docs', [])
                author_books = {}
                
                for doc in docs:
                    book_authors = doc.get('author_name', [])
                    title = doc.get('title', '')
                    pages = doc.get('number_of_pages_median', 0)
                    subjects = doc.get('subject', [])
                    genre = subjects[0] if subjects else 'Unknown'
                    
                    if book_authors:
                        author = book_authors[0]
                        if author not in author_books:
                            author_books[author] = {
                                'name': author,
                                'publisher': publisher_name,
                                'sample_book': title,
                                'sample_book_pages': pages or 0,
                                'sample_book_genre': genre,
                                'book_count': 1
                            }
                        else:
                            author_books[author]['book_count'] += 1
                
                authors = list(author_books.values())[:max_authors]
                
        except Exception as e:
            logger.error(f"Error getting authors from OpenLibrary for {publisher_name}: {e}")
        
        return authors
    
    def get_author_work_count_openlibrary(self, author_name):
        """Get author's work count from OpenLibrary API"""
        try:
            url = 'https://openlibrary.org/search.json'
            params = {
                'author': author_name,
                'limit': 1,
                'fields': 'numFound'
            }
            
            self.rate_limit()
            response = self.session.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('numFound', 0)
        except Exception as e:
            logger.error(f"Error getting work count from OpenLibrary for {author_name}: {e}")
        
        return 0
    
    def scrape_goodreads_rating(self, author_name, driver=None):
        """Scrape author rating from Goodreads - OPTIMIZED"""
        if not driver:
            driver = self.get_driver()
        
        if not driver:
            return None, None
        
        try:
            search_url = f"https://www.goodreads.com/search?q={quote_plus(author_name)}&search_type=books"
            
            driver.get(search_url)
            # REDUCED delay for speed
            time.sleep(random.uniform(0.5, 1.0) if FAST_GOODREADS else random.uniform(2, 4))
            
            try:
                author_links = driver.find_elements(By.CSS_SELECTOR, "a[href*='/author/show/']")
                if author_links:
                    author_url = author_links[0].get_attribute('href')
                    driver.get(author_url)
                    time.sleep(random.uniform(0.5, 1.0) if FAST_GOODREADS else random.uniform(2, 4))
                    
                    rating_element = driver.find_element(By.CSS_SELECTOR, ".average")
                    rating = float(rating_element.text.strip()) if rating_element else None
                    
                    works_elements = driver.find_elements(By.CSS_SELECTOR, ".bookTitle")
                    distinct_works = len(works_elements)
                    
                    return rating, distinct_works
            except NoSuchElementException:
                pass
                
            try:
                rating_elements = driver.find_elements(By.CSS_SELECTOR, ".minirating")
                if rating_elements:
                    rating_text = rating_elements[0].text
                    rating_match = re.search(r'(\d+\.\d+)', rating_text)
                    rating = float(rating_match.group(1)) if rating_match else None
                    
                    book_elements = driver.find_elements(By.CSS_SELECTOR, ".bookTitle")
                    distinct_works = min(len(book_elements), 10)
                    
                    return rating, distinct_works
            except (NoSuchElementException, AttributeError):
                pass
                
        except Exception as e:
            logger.error(f"Error scraping Goodreads for {author_name}: {e}")
        
        return None, None
    
    def get_author_book_count_google(self, author_name):
        """Get author's book count from Google Books"""
        try:
            url = 'https://www.googleapis.com/books/v1/volumes'
            params = {
                'q': f'inauthor:"{author_name}"',
                'maxResults': 1,
                'fields': 'totalItems'
            }
            
            self.rate_limit()
            response = self.session.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                total_items = data.get('totalItems', 0)
                return min(total_items, 500)
        except Exception as e:
            logger.error(f"Error getting book count for {author_name}: {e}")
        
        return 0
    
    def process_single_author(self, author_data, publisher):
        """Process a single author - used for threading"""
        try:
            author_name = author_data['name']
            
            # Get available driver for this thread
            driver = self.get_driver()
            
            # Get Goodreads data
            goodreads_rating, goodreads_works = self.scrape_goodreads_rating(author_name, driver)
            
            # Get work count
            distinct_works_count = 0
            
            if goodreads_works and goodreads_works > 0:
                distinct_works_count = goodreads_works
            else:
                openlibrary_count = self.get_author_work_count_openlibrary(author_name)
                if openlibrary_count and openlibrary_count > 0:
                    distinct_works_count = openlibrary_count
                else:
                    google_count = self.get_author_book_count_google(author_name)
                    distinct_works_count = google_count
            
            if not distinct_works_count:
                distinct_works_count = author_data.get('book_count', 0)
            
            result = {
                'Publisher': publisher,
                'Author': author_name,
                'Goodreads_Rating': goodreads_rating,
                'Distinct_Works_Count': distinct_works_count,
                'Sample_Book_Title': author_data.get('sample_book', ''),
                'Sample_Book_Genre': author_data.get('sample_book_genre', ''),
                'Sample_Book_Pages': author_data.get('sample_book_pages', 0)
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing author {author_name}: {e}")
            return None
    
    def process_authors_parallel(self, final_authors, publisher):
        """Process authors in parallel using threading"""
        results = []
        
        # Process in batches to avoid overwhelming APIs
        batch_size = MAX_WORKERS
        
        for i in range(0, len(final_authors), batch_size):
            batch = final_authors[i:i + batch_size]
            
            with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                futures = []
                
                for author_data in batch:
                    future = executor.submit(self.process_single_author, author_data, publisher)
                    futures.append((future, author_data['name']))
                
                for future, author_name in futures:
                    try:
                        result = future.result(timeout=30)  # 30 second timeout per author
                        if result:
                            results.append(result)
                            logger.info(f"  ✓ Processed author: {author_name}")
                    except Exception as e:
                        logger.error(f"  ✗ Failed to process author {author_name}: {e}")
            
            # Brief pause between batches
            time.sleep(1)
        
        return results
    
    def process_publishers(self):
        """Process all publishers from the CSV file"""
        try:
            publishers_df = pd.read_csv(self.input_csv_path)
            publisher_column = publishers_df.columns[0]
            publishers = publishers_df[publisher_column].tolist()
            
            # Resume from specific publisher
            publishers = publishers[START_FROM_PUBLISHER:]
            
            logger.info(f"Resuming from publisher {START_FROM_PUBLISHER + 1}, processing {len(publishers)} remaining publishers...")
            logger.info(f"Using {MAX_WORKERS} parallel threads for Goodreads scraping")
            
            for i, publisher in enumerate(publishers):
                actual_index = START_FROM_PUBLISHER + i
                logger.info(f"Processing publisher {actual_index + 1}/{len(publishers_df)}: {publisher}")
                
                # Get authors from APIs
                google_authors = self.get_google_books_authors(publisher, max_authors=25)
                openlibrary_authors = self.get_openlibrary_authors(publisher, max_authors=15)
                
                # Combine and deduplicate
                all_authors = google_authors + openlibrary_authors
                unique_authors = {}
                
                for author_data in all_authors:
                    author_name = author_data['name']
                    if author_name not in unique_authors:
                        unique_authors[author_name] = author_data
                
                final_authors = list(unique_authors.values())[:40]
                
                if final_authors:
                    # Process authors in parallel
                    logger.info(f"  Processing {len(final_authors)} authors in parallel...")
                    batch_results = self.process_authors_parallel(final_authors, publisher)
                    
                    # Thread-safe results addition
                    with self.results_lock:
                        self.results.extend(batch_results)
                
                # Save progress frequently
                self.save_results()
                logger.info(f"Progress saved after {actual_index + 1}: {publisher}")
                
                # Shorter delay between publishers
                time.sleep(random.uniform(2, 4))
            
            self.save_results()
            logger.info("Processing completed!")
            
        except Exception as e:
            logger.error(f"Error processing publishers: {e}")
            self.save_results()
    
    def save_results(self):
        """Thread-safe save results to CSV file"""
        with self.results_lock:
            if self.results:
                df = pd.DataFrame(self.results)
                df.to_csv(self.output_csv_path, index=False)
                logger.info(f"Saved {len(self.results)} author records to {self.output_csv_path}")
    
    def cleanup(self):
        """Clean up resources"""
        for driver in self.driver_pool:
            if driver:
                try:
                    driver.quit()
                except:
                    pass
        self.session.close()

def main():
    INPUT_CSV_PATH = "publishers.csv"
    OUTPUT_CSV_PATH = "publisher_authors_data_fast.csv"  # Different filename to avoid conflicts
    
    scraper = PublisherAuthorScraper(INPUT_CSV_PATH, OUTPUT_CSV_PATH)
    
    try:
        scraper.process_publishers()
        
        print(f"\nScraping completed!")
        print(f"Results saved to: {OUTPUT_CSV_PATH}")
        print(f"Total author records collected: {len(scraper.results)}")
        
    except KeyboardInterrupt:
        logger.info("Process interrupted by user")
        scraper.save_results()
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        scraper.save_results()
    finally:
        scraper.cleanup()

if __name__ == "__main__":
    main()