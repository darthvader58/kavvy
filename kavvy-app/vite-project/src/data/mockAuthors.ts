// src/data/mockData.ts
import { Author, Post } from '../types';

export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Speculative fiction writer exploring themes of identity and technology. Currently working on a sci-fi trilogy about AI consciousness and human evolution.',
    genres: ['Science Fiction', 'Fantasy'],
    subjects: ['Technology', 'Society', 'Science'],
    manuscriptStatus: 'complete',
    hasAgent: false,
    previousPublications: 2,
    location: 'Portland, OR',
    website: 'https://sarahmitchell.com',
    socialMedia: {
      twitter: '@sarahmitchell',
      linkedin: 'sarah-mitchell'
    },
    createdAt: new Date('2023-06-15'),
    lastLogin: new Date('2024-10-18')
  },
  {
    id: '2',
    name: 'James Chen',
    email: 'james.chen@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    bio: 'Literary fiction author focused on immigrant experiences and cultural identity. Writing stories that bridge East and West.',
    genres: ['Literary Fiction'],
    subjects: ['Society', 'Cultural Studies', 'Biographies & Memoirs'],
    manuscriptStatus: 'polishing',
    hasAgent: false,
    previousPublications: 0,
    location: 'San Francisco, CA',
    socialMedia: {
      twitter: '@jameschen_writes'
    },
    createdAt: new Date('2023-09-22'),
    lastLogin: new Date('2024-10-17')
  },
  {
    id: '3',
    name: 'Maya Patel',
    email: 'maya.patel@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    bio: 'YA fantasy author championing diverse voices. Debut novel coming soon! Writing about magic, mythology, and finding your power.',
    genres: ['Young Adult', 'Fantasy'],
    subjects: ['Adventure', 'Fantasy', 'Diverse Literature'],
    manuscriptStatus: 'complete',
    hasAgent: false,
    previousPublications: 0,
    location: 'Austin, TX',
    website: 'https://mayapatelwrites.com',
    socialMedia: {
      twitter: '@mayapatelya',
      linkedin: 'maya-patel-author'
    },
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-10-19')
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    bio: 'Thriller and mystery writer with a background in journalism. Bringing real-world investigative techniques to fiction.',
    genres: ['Mystery', 'Thriller'],
    subjects: ['Crime', 'Politics', 'Journalism'],
    manuscriptStatus: 'draft',
    hasAgent: true,
    previousPublications: 3,
    location: 'Chicago, IL',
    website: 'https://marcusjohnsonbooks.com',
    socialMedia: {
      twitter: '@mjohnson_writes',
      linkedin: 'marcus-johnson-author'
    },
    createdAt: new Date('2022-11-05'),
    lastLogin: new Date('2024-10-16')
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    bio: 'Romance novelist crafting contemporary love stories with Latinx representation. Believer in happily ever afters for everyone.',
    genres: ['Romance', 'Contemporary'],
    subjects: ['Relationships', 'Family', 'Cultural Identity'],
    manuscriptStatus: 'complete',
    hasAgent: false,
    previousPublications: 1,
    location: 'Miami, FL',
    website: 'https://elenarodriguezwrites.com',
    socialMedia: {
      twitter: '@elena_romance',
      linkedin: 'elena-rodriguez-author'
    },
    createdAt: new Date('2023-03-20'),
    lastLogin: new Date('2024-10-19')
  }
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    authorId: '1',
    content: 'Just finished the third draft of my manuscript! The journey from draft one to three has been incredible. Each iteration brings new clarity to the story. Anyone else find that the real story emerges in revision? #AmWriting #SciFi',
    timestamp: new Date('2024-10-15T10:30:00'),
    likes: 42,
    comments: 8,
    type: 'update',
    likedBy: ['2', '3', '5']
  },
  {
    id: 'p2',
    authorId: '3',
    content: 'Excited to share that I\'ve been selected for the emerging writers workshop! This is a dream come true. Huge thanks to everyone who\'s supported my journey. 🎉📚 #WritingCommunity #YAFantasy',
    timestamp: new Date('2024-10-14T15:45:00'),
    likes: 127,
    comments: 23,
    type: 'achievement',
    likedBy: ['1', '2', '4', '5']
  },
  {
    id: 'p3',
    authorId: '2',
    content: 'Question for the community: How do you approach writing authentic dialogue for characters from different cultural backgrounds? Looking for resources and perspectives. #WritingAdvice #LiteraryFiction',
    timestamp: new Date('2024-10-13T09:15:00'),
    likes: 34,
    comments: 15,
    type: 'question',
    likedBy: ['1', '3']
  },
  {
    id: 'p4',
    authorId: '1',
    content: 'Researching quantum mechanics for my next project. Science fiction writers: what are your favorite resources for keeping the "science" accurate in your fiction? Drop your recommendations below! 🔬📖',
    timestamp: new Date('2024-10-12T14:20:00'),
    likes: 56,
    comments: 19,
    type: 'question',
    likedBy: ['2', '4']
  },
  {
    id: 'p5',
    authorId: '3',
    content: 'Character development tip: I create playlists for each of my main characters. Music helps me understand their emotional landscape and motivations. What unique methods do you use for character building? #WritingTips',
    timestamp: new Date('2024-10-11T11:00:00'),
    likes: 89,
    comments: 31,
    type: 'update',
    likedBy: ['1', '2', '5']
  },
  {
    id: 'p6',
    authorId: '4',
    content: 'Just signed with an agent! After 47 queries and countless rejections, I finally found the right match. To everyone still in the query trenches: your time will come. Keep going! 💪📝',
    timestamp: new Date('2024-10-10T16:30:00'),
    likes: 203,
    comments: 45,
    type: 'achievement',
    likedBy: ['1', '2', '3', '5']
  },
  {
    id: 'p7',
    authorId: '5',
    content: 'Working on love scene revisions and it\'s harder than writing action sequences! How do you balance heat with emotional depth? Romance writers, I need your wisdom! ❤️✍️ #RomanceWriting',
    timestamp: new Date('2024-10-09T13:45:00'),
    likes: 67,
    comments: 28,
    type: 'question',
    likedBy: ['3', '4']
  },
  {
    id: 'p8',
    authorId: '2',
    content: 'Finally finished my literary fiction manuscript about three generations of immigrants. 85,000 words of love, loss, and finding home. Now begins the terrifying journey of querying. Wish me luck! 🍀',
    timestamp: new Date('2024-10-08T09:00:00'),
    likes: 94,
    comments: 22,
    type: 'achievement',
    likedBy: ['1', '3', '4', '5']
  },
  {
    id: 'p9',
    authorId: '5',
    content: 'Hot take: The "show don\'t tell" rule is overrated. Sometimes telling is exactly what your story needs. Context matters more than rigid rules. What controversial writing advice do you disagree with? 🤔',
    timestamp: new Date('2024-10-07T18:20:00'),
    likes: 156,
    comments: 67,
    type: 'question',
    likedBy: ['1', '2', '3', '4']
  },
  {
    id: 'p10',
    authorId: '4',
    content: 'Reminder: Your first draft is supposed to be messy. It\'s called a "rough" draft for a reason. Give yourself permission to write badly. You can\'t edit a blank page! #WritingMotivation #AmWriting',
    timestamp: new Date('2024-10-06T08:15:00'),
    likes: 178,
    comments: 41,
    type: 'update',
    likedBy: ['1', '2', '3', '5']
  }
];

// Default author for new signups
export const createDefaultAuthor = (user: { id: string; email: string; name: string; picture: string }): Author => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.picture,
    bio: 'New author on Kavvy. Excited to connect with publishers and fellow writers!',
    genres: [],
    subjects: [],
    manuscriptStatus: 'draft',
    hasAgent: false,
    previousPublications: 0,
    location: '',
    socialMedia: {},
    createdAt: new Date(),
    lastLogin: new Date()
  };
};

export const currentAuthor = mockAuthors[0];