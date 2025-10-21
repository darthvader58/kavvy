// src/components/Sidebar.tsx
import { Author } from '../types';

interface SidebarProps {
  author: Author;
}

export function Sidebar({ author }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="profile-card">
        <div className="profile-banner"></div>
        <div className="profile-info">
          <img src={author.avatar} alt={author.name} className="profile-avatar" />
          <div className="profile-name">{author.name}</div>
          <div className="profile-bio">{author.bio.substring(0, 60)}...</div>
        </div>
        <div className="profile-stats">
          <div className="stat">
            <div className="stat-value">{author.previousPublications}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat">
            <div className="stat-value">245</div>
            <div className="stat-label">Connections</div>
          </div>
        </div>
      </div>
      
      <div className="quick-links">
        <h3>Quick Links</h3>
        <button className="quick-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"/>
            <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"/>
          </svg>
          My Manuscripts
        </button>
        <button className="quick-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Submission Tracker
        </button>
        <button className="quick-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Writing Groups
        </button>
        <button className="quick-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Resources
        </button>
      </div>
    </aside>
  );
}