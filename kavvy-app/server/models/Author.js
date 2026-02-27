import mongoose from 'mongoose';

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

export default mongoose.model('Author', authorSchema);
