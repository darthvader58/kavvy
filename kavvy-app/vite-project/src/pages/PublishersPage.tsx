// src/pages/PublishersPage.tsx
import { useState } from 'react';
import { Author } from '../types';
import { publishers } from '../data/publishers';
import { PublisherCard } from '../components/PublisherCard';

interface PublishersPageProps {
  author: Author;
}

export function PublishersPage({ author }: PublishersPageProps) {
  const [filterGenre, setFilterGenre] = useState('');
  const [filterOpenCalls, setFilterOpenCalls] = useState(false);
  const [filterNoAgent, setFilterNoAgent] = useState(false);

  const filteredPublishers = publishers.filter(pub => {
    if (filterGenre && !pub.genres.some(g => g.toLowerCase().includes(filterGenre.toLowerCase()))) {
      return false;
    }
    if (filterOpenCalls && !pub.openCalls) {
      return false;
    }
    if (filterNoAgent && pub.requiresAgent) {
      return false;
    }
    return true;
  });

  return (
    <div className="main-container">
      <div className="publishers-header">
        <h1>Discover Publishers</h1>
        <p>Find the perfect publisher for your manuscript. Connect with traditional publishing houses that match your genre and style.</p>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Genre</label>
          <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
            <option value="">All Genres</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Literary Fiction">Literary Fiction</option>
            <option value="Young Adult">Young Adult</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input 
              type="checkbox" 
              checked={filterOpenCalls} 
              onChange={(e) => setFilterOpenCalls(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Open Submissions Only
          </label>
        </div>

        <div className="filter-group">
          <label>
            <input 
              type="checkbox" 
              checked={filterNoAgent} 
              onChange={(e) => setFilterNoAgent(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            No Agent Required
          </label>
        </div>
      </div>

      <div className="publishers-grid">
        {filteredPublishers.map((publisher, idx) => (
          <PublisherCard key={idx} publisher={publisher} />
        ))}
      </div>

      {filteredPublishers.length === 0 && (
        <div style={{ 
          gridColumn: '1 / -1', 
          textAlign: 'center', 
          padding: '3rem',
          color: 'var(--text-light)'
        }}>
          No publishers found matching your criteria. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}