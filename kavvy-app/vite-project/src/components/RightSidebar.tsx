// src/components/RightSidebar.tsx
import { Publisher } from '../types';

interface RightSidebarProps {
  featuredPublisher: Publisher;
}

export function RightSidebar({ featuredPublisher }: RightSidebarProps) {
  return (
    <aside className="right-sidebar">
      <div className="widget">
        <h3>Featured Publisher</h3>
        <div className="featured-publisher">
          <div className="publisher-name">{featuredPublisher.name}</div>
          <div className="publisher-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {featuredPublisher.location}
          </div>
          <div className="publisher-tags">
            {featuredPublisher.genres.slice(0, 3).map((genre, idx) => (
              <span key={idx} className={idx === 0 ? "tag primary" : "tag"}>
                {genre}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
            {featuredPublisher.recognition.substring(0, 100)}...
          </p>
          {featuredPublisher.openCalls && (
            <span className="open-badge" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
              Open Submissions
            </span>
          )}
          <button className="btn-secondary">View Publisher</button>
        </div>
      </div>

      <div className="widget">
        <h3>Trending Topics</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="quick-link">
            <span style={{ fontWeight: 600 }}>#AmWriting</span>
          </button>
          <button className="quick-link">
            <span style={{ fontWeight: 600 }}>#QueryTip</span>
          </button>
          <button className="quick-link">
            <span style={{ fontWeight: 600 }}>#WritingCommunity</span>
          </button>
          <button className="quick-link">
            <span style={{ fontWeight: 600 }}>#BookDeals</span>
          </button>
        </div>
      </div>

      <div className="widget">
        <h3>Writing Resources</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="quick-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Query Letter Guide
          </button>
          <button className="quick-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Market Watch
          </button>
          <button className="quick-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            </svg>
            Agent Database
          </button>
        </div>
      </div>
    </aside>
  );
}