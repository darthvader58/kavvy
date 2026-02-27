import mongoose from 'mongoose';

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

// Waitlist model
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

const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept,Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectToDatabase();

    if (req.method === 'POST') {
      const { email, name, userType, referralSource } = req.body;
      
      // Check if email already exists
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
      
      return res.status(201).json({ 
        message: 'Successfully added to waitlist!',
        position: count
      });
    }

    if (req.method === 'GET') {
      const count = await Waitlist.countDocuments();
      return res.json({ count });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
}
