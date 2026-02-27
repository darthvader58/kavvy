// src/components/Feed.tsx
import { Author } from '../types';

interface FeedProps {
  currentAuthor: Author;
  posts: any[];
  authors: Author[];
}

export function Feed({ currentAuthor, posts, authors }: FeedProps) {
  const formatTimeAgo = (date: string | Date): string => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="feed">
      <div className="post-composer">
        <div className="post-composer-input">
          <img src={currentAuthor.avatar} alt={currentAuthor.name} className="post-composer-avatar" />
          <textarea placeholder="Share your writing journey..."></textarea>
        </div>
        <div className="post-composer-actions">
          <div className="post-composer-buttons">
            <button className="icon-btn" title="Add image">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>
            <button className="icon-btn" title="Add document">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
            </button>
            <button className="icon-btn" title="Add poll">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </button>
          </div>
          <button className="btn-primary">Post</button>
        </div>
      </div>
      
      {posts.map(post => {
        const author = post.authorId;
        if (!author) return null;

        return (
          <article key={post._id} className="post">
            <div className="post-header">
              <img src={author.avatar} alt={author.name} className="post-avatar" />
              <div className="post-author-info">
                <div className="post-author-name">{author.name}</div>
                <div className="post-author-meta">
                  {author.location || 'Author'} • {formatTimeAgo(post.createdAt)}
                </div>
              </div>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-actions">
              <button className="post-action">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>{post.likes?.length || 0}</span>
              </button>
              <button className="post-action">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{post.comments?.length || 0}</span>
              </button>
              <button className="post-action">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <span>Share</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}