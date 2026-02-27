import express from 'express';
import Waitlist from '../models/Waitlist.js';

const router = express.Router();

// Add to waitlist
router.post('/', async (req, res) => {
  try {
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
    res.status(201).json({ 
      message: 'Successfully added to waitlist!',
      position: await Waitlist.countDocuments()
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get waitlist count
router.get('/count', async (req, res) => {
  try {
    const count = await Waitlist.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
