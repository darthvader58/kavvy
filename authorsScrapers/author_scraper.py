"""
DO NOT USE 
This script was replaced by author_scraper_fast.py
USE author_scraper_fast.py instead
Script was too slow as it only handles one author at a time
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

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PublisherAuthorScraper:
    def __init__(self, input_csv_path, output_csv_path):
        self.input_csv_path = input_csv_path
        self.output_csv_path = output_csv_path
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Setup Selenium WebDriver for Goodreads scraping
        self.driver = None
        self.setup_driver()
        
        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 1  # Minimum seconds between requests
        
        # Results storage
        self.results = []
        
    def setup_driver(self):
        """Setup Chrome WebDriver for Goodreads scraping"""
        try:
            chrome_options = Options()
            chrome_options.binary_location = '/usr/bin/chromium-browser'  # Use chromium directly
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--disable-extensions')
            chrome_options.add_argument('--disable-plugins')
            chrome_options.add_argument('--disable-images')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument('--remote-debugging-port=9222')
            chrome_options.add_argument('--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
            
            self.driver = webdriver.Chrome(options=chrome_options)
            logger.info("Chrome WebDriver initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize WebDriver: {e}")
            logger.info("Continuing without Goodreads scraping - will use API data only")
            self.driver = None
    
    def rate_limit(self):
        """Implement rate limiting to avoid being blocked"""
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
            # Search for books by publisher
            query = f'inpublisher:"{publisher_name}"'
            url = f'https://www.googleapis.com/books/v1/volumes'
            
            start_index = 0
            max_results = 40
            
            while len(authors) < max_authors and start_index < 400:  # Limit total API calls
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
                        
                        # For each book, only take the FIRST author to avoid duplicates
                        if book_authors and len(authors) < max_authors:
                            author = book_authors[0]  # Take only the first/primary author
                            
                            # Check if we already have this author
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
                    logger.warning(f"Google Books API error for {publisher_name}: {response.status_code}")
                    break
                    
        except Exception as e:
            logger.error(f"Error getting authors from Google Books for {publisher_name}: {e}")
        
        return authors[:max_authors]
    
    def get_openlibrary_authors(self, publisher_name, max_authors=20):
        """Get additional authors from OpenLibrary API"""
        authors = []
        try:
            # Search OpenLibrary for works by publisher
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
                    
                    # For each book, only take the FIRST author to avoid duplicates
                    if book_authors:
                        author = book_authors[0]  # Take only the first/primary author
                        
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
                
                # Convert to list and limit
                authors = list(author_books.values())[:max_authors]
                
        except Exception as e:
            logger.error(f"Error getting authors from OpenLibrary for {publisher_name}: {e}")
        
        return authors
    
    def get_author_work_count_openlibrary(self, author_name):
        """Get author's work count from OpenLibrary API"""
        try:
            # Search for works by this specific author
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
    
    def scrape_goodreads_rating(self, author_name):
        """Scrape author rating from Goodreads"""
        if not self.driver:
            return None, None
        
        try:
            # Search for author on Goodreads
            search_url = f"https://www.goodreads.com/search?q={quote_plus(author_name)}&search_type=books"
            
            self.driver.get(search_url)
            time.sleep(random.uniform(2, 4))  # Random delay
            
            # Look for author page link
            try:
                author_links = self.driver.find_elements(By.CSS_SELECTOR, "a[href*='/author/show/']")
                if author_links:
                    author_url = author_links[0].get_attribute('href')
                    self.driver.get(author_url)
                    time.sleep(random.uniform(2, 4))
                    
                    # Extract rating and book count
                    rating_element = self.driver.find_element(By.CSS_SELECTOR, ".average")
                    rating = float(rating_element.text.strip()) if rating_element else None
                    
                    # Count distinct works (books)
                    works_elements = self.driver.find_elements(By.CSS_SELECTOR, ".bookTitle")
                    distinct_works = len(works_elements)
                    
                    return rating, distinct_works
            except NoSuchElementException:
                pass
                
            # If no author page found, try to get rating from search results
            try:
                rating_elements = self.driver.find_elements(By.CSS_SELECTOR, ".minirating")
                if rating_elements:
                    rating_text = rating_elements[0].text
                    rating_match = re.search(r'(\d+\.\d+)', rating_text)
                    rating = float(rating_match.group(1)) if rating_match else None
                    
                    # Try to estimate book count from search results
                    book_elements = self.driver.find_elements(By.CSS_SELECTOR, ".bookTitle")
                    distinct_works = min(len(book_elements), 10)  # Estimate
                    
                    return rating, distinct_works
            except (NoSuchElementException, AttributeError):
                pass
                
        except Exception as e:
            logger.error(f"Error scraping Goodreads for {author_name}: {e}")
        
        return None, None
    
    def get_author_book_count_google(self, author_name):
        """Get author's book count from Google Books - but limit the result"""
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
                # Cap the result to reasonable numbers (Google Books sometimes returns inflated counts)
                return min(total_items, 500)  # Cap at 500 to avoid unrealistic numbers
        except Exception as e:
            logger.error(f"Error getting book count for {author_name}: {e}")
        
        return 0
    
    def process_publishers(self):
        """Process all publishers from the CSV file"""
        try:
            # Read publishers CSV
            publishers_df = pd.read_csv(self.input_csv_path)
            
            # Assume the first column contains publisher names
            publisher_column = publishers_df.columns[0]
            publishers = publishers_df[publisher_column].tolist()
            
            logger.info(f"Processing {len(publishers)} publishers...")
            
            for i, publisher in enumerate(publishers):
                logger.info(f"Processing publisher {i+1}/{len(publishers)}: {publisher}")
                
                # Get authors from multiple sources
                google_authors = self.get_google_books_authors(publisher, max_authors=25)
                openlibrary_authors = self.get_openlibrary_authors(publisher, max_authors=15)
                
                # Combine and deduplicate authors
                all_authors = google_authors + openlibrary_authors
                unique_authors = {}
                
                for author_data in all_authors:
                    author_name = author_data['name']
                    if author_name not in unique_authors:
                        unique_authors[author_name] = author_data
                
                # Limit to 40 authors per publisher
                final_authors = list(unique_authors.values())[:40]
                
                # Process each author
                for j, author_data in enumerate(final_authors):
                    author_name = author_data['name']
                    logger.info(f"  Processing author {j+1}/{len(final_authors)}: {author_name}")
                    
                    # Get Goodreads data
                    goodreads_rating, goodreads_works = self.scrape_goodreads_rating(author_name)
                    
                    # Get work count - prioritize OpenLibrary, then Goodreads, then Google Books
                    distinct_works_count = 0
                    
                    if goodreads_works and goodreads_works > 0:
                        distinct_works_count = goodreads_works
                    else:
                        # Try OpenLibrary first
                        openlibrary_count = self.get_author_work_count_openlibrary(author_name)
                        if openlibrary_count and openlibrary_count > 0:
                            distinct_works_count = openlibrary_count
                        else:
                            # Fallback to Google Books
                            google_count = self.get_author_book_count_google(author_name)
                            distinct_works_count = google_count
                    
                    # If still no count, use the book_count from the original data
                    if not distinct_works_count:
                        distinct_works_count = author_data.get('book_count', 0)
                    
                    # Add to results
                    result = {
                        'Publisher': publisher,
                        'Author': author_name,
                        'Goodreads_Rating': goodreads_rating,
                        'Distinct_Works_Count': distinct_works_count,
                        'Sample_Book_Title': author_data.get('sample_book', ''),
                        'Sample_Book_Genre': author_data.get('sample_book_genre', ''),
                        'Sample_Book_Pages': author_data.get('sample_book_pages', 0)
                    }
                    
                    self.results.append(result)
                
                # Save progress periodically
                if (i + 1) % 10 == 0:
                    self.save_results()
                    logger.info(f"Progress saved after {i+1} publishers")
                
                # Longer delay between publishers to avoid rate limiting
                time.sleep(random.uniform(3, 6))
            
            # Final save
            self.save_results()
            logger.info("Processing completed!")
            
        except Exception as e:
            logger.error(f"Error processing publishers: {e}")
            # Save what we have so far
            self.save_results()
    
    def save_results(self):
        """Save results to CSV file"""
        if self.results:
            df = pd.DataFrame(self.results)
            df.to_csv(self.output_csv_path, index=False)
            logger.info(f"Saved {len(self.results)} author records to {self.output_csv_path}")
    
    def cleanup(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()
        self.session.close()

def main():
    # Configuration
    INPUT_CSV_PATH = "publishers.csv"  # Your input CSV file with publishers
    OUTPUT_CSV_PATH = "publisher_authors_data.csv"  # Output file
    
    # Create scraper instance
    scraper = PublisherAuthorScraper(INPUT_CSV_PATH, OUTPUT_CSV_PATH)
    
    try:
        # Process all publishers
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