// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Author } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Feed } from '../components/Feed';
import { RightSidebar } from '../components/RightSidebar';
import { api } from '../services/api';

interface HomePageProps {
  author: Author;
}

export function HomePage({ author }: HomePageProps) {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [postsData, authorsData, publishersData] = await Promise.all([
          api.getPosts(50),
          api.getAuthors(),
          api.getPublishers()
        ]);
        
        setPosts(postsData);
        setAuthors(authorsData);
        setPublishers(publishersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="main-container">
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
          <div className="loading-spinner"></div>
          <p>Loading feed...</p>
        </div>
      </div>
    );
  }

  const featuredPublisher = publishers.find(p => p.openCalls) || publishers[0];

  return (
    <div className="main-container">
      <Sidebar author={author} />
      <Feed 
        currentAuthor={author} 
        posts={posts} 
        authors={authors} 
      />
      <RightSidebar featuredPublisher={featuredPublisher} />
    </div>
  );
}