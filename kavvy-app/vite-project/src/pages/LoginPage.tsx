// src/pages/LoginPage.tsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signIn } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Render Google Sign-In button
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: 'filled_blue',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 280,
        }
      );
    }
  }, []);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
              <path d="M2 17L12 22L22 17"/>
              <path d="M2 12L12 17L22 12"/>
            </svg>
            <h1>KAVVY</h1>
          </div>
          <h2>Recognizing Literary Talent</h2>
          <p className="login-subtitle">
            Connect with traditional publishers, discover opportunities, and advance your writing career.
          </p>
          
          <div className="login-features">
            <div className="login-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <div>
                <h3>Smart Matching</h3>
                <p>AI-powered algorithm matches you with publishers based on genre, style, and requirements</p>
              </div>
            </div>

            <div className="login-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"/>
                <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"/>
              </svg>
              <div>
                <h3>Publisher Directory</h3>
                <p>Browse hundreds of traditional publishers with detailed submission guidelines</p>
              </div>
            </div>

            <div className="login-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <div>
                <h3>Writing Community</h3>
                <p>Connect with fellow authors, share your journey, and get support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h2>Welcome to Kavvy</h2>
            <p>Sign in to start connecting with publishers</p>

            <div className="google-signin-container">
              <div ref={googleButtonRef} id="google-signin-button"></div>
            </div>

            <div className="login-divider">
              <span>or</span>
            </div>

            <button className="btn-demo" onClick={signIn}>
              Continue as Demo User
            </button>

            <p className="login-terms">
              By continuing, you agree to Kavvy's Terms of Service and Privacy Policy
            </p>
          </div>

          <div className="login-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Publishers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Authors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Match Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}