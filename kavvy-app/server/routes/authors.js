import express from 'express';
import Author from '../models/Author.js';

const router = express.Router();

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 });
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get author by ID
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update author
router.post('/', async (req, res) => {
  try {
    const { email, googleId } = req.body;
    
    let author = await Author.findOne({ $or: [{ email }, { googleId }] });
    
    if (author) {
      // Update existing author
      Object.assign(author, req.body);
      author.lastLogin = new Date();
      await author.save();
    } else {
      // Create new author
      author = new Author(req.body);
      await author.save();
    }
    
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update author
router.patch('/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete author
router.delete('/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
