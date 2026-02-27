import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Author from '../models/Author.js';
import Post from '../models/Post.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const postTemplates = [
  { type: 'achievement', templates: [
    'Excited to announce that my manuscript "{title}" has been completed! {pages} pages of pure passion. Looking for the right publisher to bring this story to life.',
    'Just finished the final draft of "{title}"! This {genre} piece has been a labor of love. Open to publisher connections.',
    'Milestone reached! My {genre} manuscript "{title}" is ready for submission. {pages} pages that I\'m incredibly proud of.',
    'Thrilled to share that "{title}" is complete! This {genre} work explores themes close to my heart. Seeking publishing opportunities.'
  ]},
  { type: 'update', templates: [
    'Working on revisions for my latest manuscript. The editing process is challenging but rewarding. Any other authors in the same boat?',
    'Deep in the writing zone today. There\'s nothing quite like the flow state when the words just come.',
    'Taking a break from writing to connect with fellow authors. What\'s everyone working on?',
    'Researching publishers for my {genre} manuscript. The submission process is quite the journey!',
    'Coffee, keyboard, and creativity. That\'s the recipe for today\'s writing session.'
  ]},
  { type: 'question', templates: [
    'Question for fellow authors: What\'s your approach to finding the right publisher for your work?',
    'Looking for recommendations on publishers who specialize in {genre}. Any suggestions?',
    'How do you all handle rejection letters? Looking for some wisdom from experienced authors.',
    'What\'s the best way to prepare a manuscript for submission? First-time submitter here!',
    'Anyone have experience with literary agents? Trying to decide if I should pursue representation.'
  ]},
  { type: 'announcement', templates: [
    'Excited to join the Kavvy community! Looking forward to connecting with publishers and fellow authors.',
    'New to the platform and loving the community here. Can\'t wait to share my work and learn from others.',
    'Just updated my profile with my latest manuscript. Check it out and let me know what you think!',
    'Open to collaboration opportunities. If you\'re working on something in {genre}, let\'s connect!'
  ]}
];

function getRandomTemplate(type, manuscript) {
  const category = postTemplates.find(p => p.type === type);
  const template = category.templates[Math.floor(Math.random() * category.templates.length)];
  
  if (manuscript) {
    return template
      .replace('{title}', manuscript.title)
      .replace('{genre}', manuscript.genre || 'fiction')
      .replace('{pages}', manuscript.pageCount || '300');
  }
  
  return template.replace('{genre}', 'fiction');
}

async function seedPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kavvy');
    console.log('✅ Connected to MongoDB');

    await Post.deleteMany({});
    console.log('🗑️  Cleared existing posts');

    const authors = await Author.find().limit(100);
    console.log(`📝 Found ${authors.length} authors`);

    const posts = [];
    
    for (const author of authors) {
      // Get author's manuscripts
      const manuscripts = await mongoose.model('Manuscript').find({ authorId: author._id }).limit(2);
      
      // Create 1-3 posts per author
      const numPosts = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numPosts; i++) {
        const types = ['achievement', 'update', 'question', 'announcement'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const manuscript = manuscripts.length > 0 && type === 'achievement' 
          ? manuscripts[Math.floor(Math.random() * manuscripts.length)]
          : null;
        
        const content = getRandomTemplate(type, manuscript);
        
        // Random likes from other authors
        const numLikes = Math.floor(Math.random() * 15);
        const likers = authors
          .filter(a => a._id.toString() !== author._id.toString())
          .sort(() => 0.5 - Math.random())
          .slice(0, numLikes)
          .map(a => a._id);
        
        // Random comments
        const numComments = Math.floor(Math.random() * 5);
        const comments = [];
        
        for (let j = 0; j < numComments; j++) {
          const commenter = authors[Math.floor(Math.random() * authors.length)];
          const commentTexts = [
            'Congratulations! This sounds amazing.',
            'Best of luck with your submission!',
            'I\'d love to read this when it\'s published.',
            'Keep up the great work!',
            'This is inspiring. Thanks for sharing!',
            'Wishing you all the best on your publishing journey.',
            'Your dedication is admirable!'
          ];
          
          comments.push({
            authorId: commenter._id,
            content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
        }
        
        posts.push({
          authorId: author._id,
          content,
          type,
          likes: likers,
          comments,
          createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
        });
      }
    }

    await Post.insertMany(posts);
    console.log(`✅ Seeded ${posts.length} posts`);
    
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
    process.exit(1);
  }
}

seedPosts();
