import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  regionalPreference: { type: String },
  website: { type: String },
  subjects: [{ type: String }],
  genres: [{ type: String }],
  booksPublished: { type: Number, default: 0 },
  maxYear: { type: Number },
  maxSeason: { type: String },
  manuscriptNeeded: { type: Boolean, default: false },
  chaptersNeeded: { type: Boolean, default: false },
  requiresAgent: { type: Boolean, default: false },
  peerReviewed: { type: Boolean, default: false },
  proposalRequired: { type: Boolean, default: false },
  academicFocus: { type: Boolean, default: false },
  religiousFocus: { type: String },
  inHouse: { type: Boolean, default: false },
  openCalls: { type: Boolean, default: false },
  miscSubmissionRequirements: { type: String },
  promotionChannels: { type: String },
  recognition: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Publisher', publisherSchema);
