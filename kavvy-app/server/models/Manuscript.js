import mongoose from 'mongoose';

const manuscriptSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  title: { type: String, required: true },
  genre: { type: String },
  subjects: [{ type: String }],
  status: { 
    type: String, 
    enum: ['draft', 'complete', 'polishing', 'submitted', 'published'],
    default: 'draft'
  },
  wordCount: { type: Number, default: 0 },
  pageCount: { type: Number, default: 0 },
  synopsis: { type: String },
  completionDate: { type: Date },
  submittedTo: [{ 
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
    submittedAt: { type: Date },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected', 'under_review'],
      default: 'pending'
    }
  }],
  goodreadsRating: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Manuscript', manuscriptSchema);
