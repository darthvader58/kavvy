import express from 'express';
import Publisher from '../models/Publisher.js';

const router = express.Router();

// Get all publishers with optional filters
router.get('/', async (req, res) => {
  try {
    const { genre, requiresAgent, openCalls } = req.query;
    const filter = {};
    
    if (genre) filter.genres = { $in: [genre] };
    if (requiresAgent !== undefined) filter.requiresAgent = requiresAgent === 'true';
    if (openCalls !== undefined) filter.openCalls = openCalls === 'true';
    
    const publishers = await Publisher.find(filter).sort({ booksPublished: -1 });
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get publisher by ID
router.get('/:id', async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
    res.json(publisher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create publisher
router.post('/', async (req, res) => {
  try {
    const publisher = new Publisher(req.body);
    await publisher.save();
    res.status(201).json(publisher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update publisher
router.patch('/:id', async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
    res.json(publisher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete publisher
router.delete('/:id', async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
    res.json({ message: 'Publisher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
