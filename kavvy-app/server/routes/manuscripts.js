import express from 'express';
import Manuscript from '../models/Manuscript.js';

const router = express.Router();

// Get all manuscripts with optional filters
router.get('/', async (req, res) => {
  try {
    const { authorId, genre, status } = req.query;
    const filter = {};
    
    if (authorId) filter.authorId = authorId;
    if (genre) filter.genre = { $regex: genre, $options: 'i' };
    if (status) filter.status = status;
    
    const manuscripts = await Manuscript.find(filter)
      .populate('authorId', 'name avatar email')
      .sort({ createdAt: -1 });
    
    res.json(manuscripts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get manuscript by ID
router.get('/:id', async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id)
      .populate('authorId', 'name avatar email bio');
    
    if (!manuscript) return res.status(404).json({ message: 'Manuscript not found' });
    res.json(manuscript);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create manuscript
router.post('/', async (req, res) => {
  try {
    const manuscript = new Manuscript(req.body);
    await manuscript.save();
    res.status(201).json(manuscript);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update manuscript
router.patch('/:id', async (req, res) => {
  try {
    const manuscript = await Manuscript.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!manuscript) return res.status(404).json({ message: 'Manuscript not found' });
    res.json(manuscript);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete manuscript
router.delete('/:id', async (req, res) => {
  try {
    const manuscript = await Manuscript.findByIdAndDelete(req.params.id);
    if (!manuscript) return res.status(404).json({ message: 'Manuscript not found' });
    res.json({ message: 'Manuscript deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get manuscripts by author
router.get('/author/:authorId', async (req, res) => {
  try {
    const manuscripts = await Manuscript.find({ authorId: req.params.authorId })
      .sort({ createdAt: -1 });
    res.json(manuscripts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
