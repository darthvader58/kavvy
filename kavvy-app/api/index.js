// Vercel serverless function wrapper for Express API
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = connection;
  return connection;
}

// Import models
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, sparse: true },
  avatar: { type: String },
  bio: { type: String, default: '' },
  genres: [{ type: String }],
  subjects: [{ type: String }],
  manuscriptStatus: { 
    type: String, 
    enum: ['draft', 'complete', 'polishing'],
    default: 'draft'
  },
  hasAgent: { type: Boolean, default: false },
  previousPublications: { type: Number, default: 0 },
  location: { type: String, default: '' },
  website: { type: String },
  socialMedia: {
    twitter: { type: String },
    linkedin: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

const waitlistSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  name: { type: String, trim: true },
  userType: { 
    type: String, 
    enum: ['author', 'publisher', 'other'],
    default: 'author'
  },
  referralSource: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Author = mongoose.models.Author || mongoose.model('Author', authorSchema);
const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kavvy API is running' });
});

app.post('/api/waitlist', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, name, userType, referralSource } = req.body;
    
    const existing = await Waitlist.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered on waitlist' });
    }
    
    const waitlistEntry = new Waitlist({
      email,
      name,
      userType,
      referralSource
    });
    
    await waitlistEntry.save();
    const count = await Waitlist.countDocuments();
    
    res.status(201).json({ 
      message: 'Successfully added to waitlist!',
      position: count
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/waitlist/count', async (req, res) => {
  try {
    await connectToDatabase();
    const count = await Waitlist.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default app;
