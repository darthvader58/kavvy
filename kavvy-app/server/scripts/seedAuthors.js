import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Author from '../models/Author.js';
import Manuscript from '../models/Manuscript.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Parse CSV data
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  
  return data;
}

// Generate author bio based on their work
function generateBio(authorName, genre, worksCount) {
  const bios = [
    `Award-winning author of ${worksCount} published works in ${genre}. Passionate about storytelling and connecting with readers.`,
    `Published author with ${worksCount} titles. Specializing in ${genre}. Always working on the next great story.`,
    `${genre} author with ${worksCount} published books. Love exploring new narratives and pushing creative boundaries.`,
    `Experienced writer in ${genre} with ${worksCount} publications. Seeking new publishing opportunities.`,
    `Author of ${worksCount} books. ${genre} enthusiast. Looking to connect with publishers and fellow writers.`
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

// Generate locations
function getRandomLocation() {
  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA', 
    'San Francisco, CA', 'Seattle, WA', 'Austin, TX', 'Portland, OR',
    'Denver, CO', 'Atlanta, GA', 'Philadelphia, PA', 'Phoenix, AZ',
    'London, UK', 'Toronto, Canada', 'Sydney, Australia'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

// Generate avatar URL
function generateAvatar(name) {
  const initial = name.charAt(0).toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6B4E71&color=fff&size=200`;
}

async function seedAuthors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kavvy');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Author.deleteMany({});
    await Manuscript.deleteMany({});
    console.log('🗑️  Cleared existing authors and manuscripts');

    // Read and parse CSV
    const csvPath = path.join(__dirname, '../../../phase1/all_data/publisher_authors_data.csv');
    const authorsData = parseCSV(csvPath);
    
    // Group by author to avoid duplicates
    const authorMap = new Map();
    
    authorsData.forEach(row => {
      const authorName = row.Author;
      if (!authorName || authorName === 'Author') return;
      
      if (!authorMap.has(authorName)) {
        authorMap.set(authorName, {
          name: authorName,
          books: []
        });
      }
      
      authorMap.get(authorName).books.push({
        title: row.Sample_Book_Title,
        genre: row.Sample_Book_Genre,
        rating: parseFloat(row.Goodreads_Rating) || null,
        worksCount: parseInt(row.Distinct_Works_Count) || 1,
        pages: parseInt(row.Sample_Book_Pages) || 0,
        publisher: row.Publisher
      });
    });

    console.log(`📚 Found ${authorMap.size} unique authors`);

    // Create authors and manuscripts
    let authorCount = 0;
    let manuscriptCount = 0;
    let skippedCount = 0;

    for (const [authorName, authorData] of authorMap) {
      const firstBook = authorData.books[0];
      const totalWorks = firstBook.worksCount;
      
      // Generate unique email with timestamp to avoid duplicates
      const baseEmail = authorName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${baseEmail}${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;
      
      try {
        // Create author
        const author = new Author({
          name: authorName,
          email: email,
          avatar: generateAvatar(authorName),
          bio: generateBio(authorName, firstBook.genre, totalWorks),
          genres: [...new Set(authorData.books.map(b => b.genre).filter(Boolean))],
          subjects: [...new Set(authorData.books.map(b => b.genre).filter(Boolean))],
          manuscriptStatus: Math.random() > 0.5 ? 'complete' : 'polishing',
          hasAgent: Math.random() > 0.6,
          previousPublications: totalWorks,
          location: getRandomLocation(),
          socialMedia: {
            twitter: Math.random() > 0.5 ? `@${authorName.replace(/\s+/g, '')}` : undefined,
            linkedin: Math.random() > 0.5 ? `linkedin.com/in/${authorName.toLowerCase().replace(/\s+/g, '-')}` : undefined
          }
        });

        await author.save();
        authorCount++;

        // Create manuscripts for each book
        for (const book of authorData.books) {
          if (!book.title) continue;
          
          const manuscript = new Manuscript({
            authorId: author._id,
            title: book.title,
            genre: book.genre,
            subjects: [book.genre].filter(Boolean),
            status: Math.random() > 0.3 ? 'published' : 'complete',
            wordCount: book.pages ? book.pages * 250 : Math.floor(Math.random() * 100000) + 50000,
            pageCount: book.pages || Math.floor(Math.random() * 400) + 100,
            synopsis: `A compelling work in ${book.genre || 'fiction'} that explores...`,
            goodreadsRating: book.rating,
            completionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
          });

          await manuscript.save();
          manuscriptCount++;
        }
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error - skip this author
          skippedCount++;
          continue;
        }
        throw error;
      }
    }

    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} duplicate authors`);
    }

    console.log(`✅ Seeded ${authorCount} authors`);
    console.log(`✅ Seeded ${manuscriptCount} manuscripts`);
    
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding authors:', error);
    process.exit(1);
  }
}

seedAuthors();
