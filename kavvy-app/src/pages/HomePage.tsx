// src/pages/HomePage.tsx
import { Author } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Feed } from '../components/Feed';
import { RightSidebar } from '../components/RightSidebar';
import { mockAuthors, mockPosts } from '../data/mockData';
import { publishers } from '../data/publishers';

interface HomePageProps {
  author: Author;
}

export function HomePage({ author }: HomePageProps) {
  const featuredPublisher = publishers[1]; // Tor.com

  return (
    <div className="main-container">
      <Sidebar author={author} />
      <Feed 
        currentAuthor={author} 
        posts={mockPosts} 
        authors={mockAuthors} 
      />
      <RightSidebar featuredPublisher={featuredPublisher} />
    </div>
  );
}