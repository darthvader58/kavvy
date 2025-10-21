// src/pages/ProfilePage.tsx
import { Author } from '../types';

interface ProfilePageProps {
  author: Author;
}

export function ProfilePage({ author }: ProfilePageProps) {
  return (
    <div className="main-container">
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-main">
            <div className="profile-top">
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="profile-avatar-large" 
              />
              <div className="profile-details">
                <h1>{author.name}</h1>
                <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                  {author.bio}
                </p>
                <div className="profile-meta">
                  <div className="profile-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {author.location}
                  </div>
                  {author.website && (
                    <div className="profile-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      {author.website}
                    </div>
                  )}
                  <div className="profile-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {author.email}
                  </div>
                </div>
                <div className="profile-actions">
                  <button className="btn-primary">Edit Profile</button>
                  <button className="btn-secondary">Share Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="info-section">
              <h3>Writing Information</h3>
              <div className="info-row">
                <span className="info-label">Genres</span>
                <span className="info-value">{author.genres.join(', ')}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Manuscript Status</span>
                <span className="info-value" style={{ textTransform: 'capitalize' }}>
                  {author.manuscriptStatus}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Has Agent</span>
                <span className="info-value">{author.hasAgent ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Publications</span>
                <span className="info-value">{author.previousPublications}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>Social Media</h3>
              {author.socialMedia.twitter && (
                <div className="info-row">
                  <span className="info-label">Twitter</span>
                  <span className="info-value">{author.socialMedia.twitter}</span>
                </div>
              )}
              {author.socialMedia.linkedin && (
                <div className="info-row">
                  <span className="info-label">LinkedIn</span>
                  <span className="info-value">{author.socialMedia.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-main-content">
            <div className="widget">
              <h3>About</h3>
              <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>
                {author.bio}
              </p>
              <div className="publisher-tags" style={{ marginTop: '1rem' }}>
                {author.subjects.map((subject, idx) => (
                  <span key={idx} className="tag">{subject}</span>
                ))}
              </div>
            </div>

            <div className="widget">
              <h3>Recent Activity</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                No recent activity to display.
              </p>
            </div>

            <div className="widget">
              <h3>Manuscripts</h3>
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                color: 'var(--text-light)',
                background: 'var(--bg)',
                borderRadius: '8px'
              }}>
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>Upload your first manuscript to get started</p>
                <button className="btn-primary" style={{ marginTop: '1rem' }}>
                  Upload Manuscript
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}