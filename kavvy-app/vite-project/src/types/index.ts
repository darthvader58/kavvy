// src/types/index.ts
export interface Publisher {
  name: string;
  location: string;
  website: string;
  subjects: string[];
  genres: string[];
  booksPublished: number;
  maxYear: number;
  maxSeason: string;
  manuscriptNeeded: boolean;
  chaptersNeeded: boolean;
  requiresAgent: boolean;
  openCalls: boolean;
  promotionChannels: string;
  recognition: string;
  regionalPreference?: string;
  peerReviewed?: boolean;
  proposalRequired?: boolean;
  academicFocus?: boolean;
  religiousFocus?: string;
  inHouse?: boolean;
  miscSubmissionRequirements?: string;
  titlesRecognitions?: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  genres: string[];
  subjects: string[];
  manuscriptStatus: 'draft' | 'complete' | 'polishing';
  hasAgent: boolean;
  previousPublications: number;
  location: string;
  website?: string;
  socialMedia: {
    twitter?: string;
    linkedin?: string;
  };
  googleId?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  type: 'update' | 'achievement' | 'question';
  likedBy?: string[];
}

export interface Match {
  publisher: Publisher;
  score: number;
  reasons: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  googleId: string;
  author?: Author;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export type Page = 'home' | 'profile' | 'publishers' | 'matches';