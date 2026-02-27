import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['update', 'achievement', 'question', 'announcement'],
    default: 'update'
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  comments: [{
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
