import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    
    const posts = await Post.find()
      .populate('authorId', 'name avatar email location')
      .populate('comments.authorId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'name avatar email bio location')
      .populate('comments.authorId', 'name avatar');
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name avatar email');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/Unlike post
router.post('/:id/like', async (req, res) => {
  try {
    const { authorId } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const likeIndex = post.likes.indexOf(authorId);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(authorId);
    }
    
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name avatar email');
    
    res.json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add comment
router.post('/:id/comment', async (req, res) => {
  try {
    const { authorId, content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    post.comments.push({
      authorId,
      content,
      createdAt: new Date()
    });
    
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name avatar email')
      .populate('comments.authorId', 'name avatar');
    
    res.json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts by author
router.get('/author/:authorId', async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.authorId })
      .populate('authorId', 'name avatar email')
      .populate('comments.authorId', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
