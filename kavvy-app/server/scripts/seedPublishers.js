import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Publisher from '../models/Publisher.js';

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

// Transform CSV row to Publisher model
function transformPublisher(row) {
  return {
    name: row.Publisher,
    location: row['Regional Preference/Origin Location'],
    regionalPreference: row['Regional Preference/Origin Location'],
    website: row.Website,
    subjects: row.Subjects ? row.Subjects.split(',').map(s => s.trim()) : [],
    genres: row.Genre ? row.Genre.split(',').map(g => g.trim()) : [],
    booksPublished: parseInt(row['No. of Books Published (last 5 yrs)']) || 0,
    maxYear: parseInt(row["Max. Publications' Year"]) || new Date().getFullYear(),
    maxSeason: row["Max. Publications' Season"],
    manuscriptNeeded: row['Manuscript Needed (Y/N)'] === 'Y',
    chaptersNeeded: row['Chapters Needed (Y/N)'] === 'Y',
    requiresAgent: row.requires_agent === 'Y',
    peerReviewed: row.peer_reviewed === 'Y',
    proposalRequired: row.proposal_required === 'Y',
    academicFocus: row.academic_focus === 'Y',
    religiousFocus: row.religious_focus !== 'None' ? row.religious_focus : undefined,
    inHouse: row.in_house === 'Y',
    openCalls: row.open_calls === 'Y',
    miscSubmissionRequirements: row['Miscellaneous Submission Requirements'],
    promotionChannels: row['Promotion Channels'],
    recognition: row['Titles/Industry Recognitions']
  };
}

async function seedPublishers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kavvy');
    console.log('✅ Connected to MongoDB');

    // Clear existing publishers
    await Publisher.deleteMany({});
    console.log('🗑️  Cleared existing publishers');

    // Read and parse CSV
    const csvPath = path.join(__dirname, '../../../phase1/all_data/publishers_full_data.csv');
    const publishersData = parseCSV(csvPath);
    
    // Transform and insert
    const publishers = publishersData.map(transformPublisher);
    await Publisher.insertMany(publishers);
    
    console.log(`✅ Seeded ${publishers.length} publishers`);
    
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding publishers:', error);
    process.exit(1);
  }
}

seedPublishers();
