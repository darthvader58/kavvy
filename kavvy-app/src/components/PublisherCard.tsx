// src/components/PublisherCard.tsx
import { Publisher } from '../types';

interface PublisherCardProps {
  publisher: Publisher;
}

export function PublisherCard({ publisher }: PublisherCardProps) {
  return (
    <div className="publisher-card">
      <div className="publisher-card-header">
        <div className="publisher-card-title">
          <h3>{publisher.name}</h3>
          <div className="publisher-card-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {publisher.location}
          </div>
        </div>
        {publisher.openCalls ? (
          <span className="open-badge">Open</span>
        ) : (
          <span className="closed-badge">Closed</span>
        )}
      </div>

      <div className="publisher-card-stats">
        <div className="publisher-stat">
          <div className="publisher-stat-value">
            {publisher.booksPublished > 1000 
              ? `${(publisher.booksPublished / 1000).toFixed(1)}k` 
              : publisher.booksPublished}
          </div>
          <div className="publisher-stat-label">Books Published</div>
        </div>
        <div className="publisher-stat">
          <div className="publisher-stat-value">{publisher.maxYear}</div>
          <div className="publisher-stat-label">Max Year</div>
        </div>
      </div>

      <div className="publisher-card-info">
        {publisher.requiresAgent ? (
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Agent Required
          </div>
        ) : (
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            Direct Submissions OK
          </div>
        )}

        {publisher.manuscriptNeeded && (
          <div className="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Full Manuscript Required
          </div>
        )}

        <div className="publisher-tags">
          {publisher.genres.slice(0, 4).map((genre, idx) => (
            <span key={idx} className="tag">{genre}</span>
          ))}
        </div>
      </div>

      <div className="publisher-card-footer">
        <button className="btn-small primary">View Details</button>
        <button className="btn-small secondary">Save</button>
      </div>
    </div>
  );
}