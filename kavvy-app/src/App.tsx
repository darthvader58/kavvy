// src/App.tsx
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { PublishersPage } from './pages/PublishersPage';
import { MatchesPage } from './pages/MatchesPage';
import { ManuscriptWriterPage } from './pages/ManuscriptWriterPage';
import { UpgradePage } from './pages/UpgradePage';
import { LoginPage } from './pages/LoginPage';
import { Page } from './types';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('kavvy_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      document.documentElement.setAttribute('data-theme', systemTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kavvy_theme', newTheme);
  };

  const handlePageChange = (page: Page) => {
    console.log('Navigating to:', page); // Debug log
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Kavvy...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const author = user.author || {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.picture,
    bio: 'New author on Kavvy. Excited to connect with publishers!',
    genres: [],
    subjects: [],
    manuscriptStatus: 'draft' as const,
    hasAgent: false,
    previousPublications: 0,
    location: '',
    socialMedia: {}
  };

  const renderPage = () => {
    console.log('Current page:', currentPage); // Debug log
    
    switch (currentPage) {
      case 'home':
        return <HomePage author={author} />;
      case 'profile':
        return <ProfilePage author={author} />;
      case 'publishers':
        return <PublishersPage author={author} />;
      case 'matches':
        return <MatchesPage author={author} />;
      case 'writer':
        return <ManuscriptWriterPage author={author} />;
      case 'upgrade':
        return <UpgradePage author={author} />;
      default:
        console.log('Unknown page, defaulting to home');
        return <HomePage author={author} />;
    }
  };

  return (
    <div className="app">
      <Header 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div key={currentPage}>
        {renderPage()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;