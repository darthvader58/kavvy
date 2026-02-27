import { useState } from 'react';
import { api } from '../services/api';

export function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'author',
    referralSource: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const data = await api.joinWaitlist(formData);
      setStatus('success');
      setMessage(data.message);
      setPosition(data.position);
      setFormData({ name: '', email: '', userType: 'author', referralSource: '' });
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to join waitlist');
    }
  };

  return (
    <div className="waitlist-page">
      <div className="waitlist-container">
        <div className="waitlist-hero">
          <div className="waitlist-brand">
            <img src="/kavvy-logo-white.svg" alt="Kavvy" style={{ height: '64px' }} />
            <h1>KAVVY</h1>
          </div>
          <h2>Connect Authors with Publishers</h2>
          <p className="waitlist-subtitle">
            Join the waitlist for the LinkedIn of publishing. Connect with publishers, 
            showcase your work, and find the perfect match for your manuscript.
          </p>
        </div>

        <div className="waitlist-card">
          {status === 'success' ? (
            <div className="waitlist-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h3>You're on the list!</h3>
              <p>{message}</p>
              {position && <p className="waitlist-position">You're #{position} on the waitlist</p>}
              <button 
                className="btn-primary"
                onClick={() => setStatus('idle')}
              >
                Add Another Email
              </button>
            </div>
          ) : (
            <>
              <h3>Join the Waitlist</h3>
              <p>Be among the first to experience Kavvy when we launch.</p>

              <form onSubmit={handleSubmit} className="waitlist-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="userType">I am a...</label>
                  <select
                    id="userType"
                    value={formData.userType}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  >
                    <option value="author">Author</option>
                    <option value="publisher">Publisher</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="referralSource">How did you hear about us? (Optional)</label>
                  <input
                    id="referralSource"
                    type="text"
                    value={formData.referralSource}
                    onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                    placeholder="Twitter, friend, etc."
                  />
                </div>

                {status === 'error' && (
                  <div className="error-message">{message}</div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary btn-full"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="waitlist-features">
          <div className="waitlist-feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h4>Network with Publishers</h4>
            <p>Connect directly with publishers looking for manuscripts in your genre</p>
          </div>

          <div className="waitlist-feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <h4>Smart Matching</h4>
            <p>AI recommendations to find publishers that fit and appreciate your work</p>
          </div>

          <div className="waitlist-feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <h4>Showcase Your Work</h4>
            <p>Build your author profile and share your writing journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}
