import mongoose from 'mongoose';

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

export default mongoose.model('Waitlist', waitlistSchema);
