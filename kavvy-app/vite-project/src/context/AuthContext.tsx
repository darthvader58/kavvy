// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthContextType, User } from '../types';
import { createDefaultAuthor, mockAuthors } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from session storage)
    const storedUser = sessionStorage.getItem('kavvy_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        sessionStorage.removeItem('kavvy_user');
      }
    }
    setLoading(false);

    // Load Google Sign-In script only if client ID is provided
    if (GOOGLE_CLIENT_ID) {
      loadGoogleScript();
    }
  }, []);

  const loadGoogleScript = () => {
    // Check if script already exists
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
          });
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error);
        }
      }
    };
  };

  const handleGoogleResponse = (response: any) => {
    try {
      // Decode JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const newUser: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub,
      };

      // Check if author profile exists, if not create one
      let authorProfile = mockAuthors.find(a => a.email === newUser.email);
      if (!authorProfile) {
        authorProfile = createDefaultAuthor(newUser);
        mockAuthors.push(authorProfile);
      }

      newUser.author = authorProfile;

      setUser(newUser);
      sessionStorage.setItem('kavvy_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error processing Google sign-in:', error);
    }
  };

  const signIn = async () => {
    try {
      console.log('🔵 signIn function called');
      
      // Use demo user
      const demoUser: User = {
        id: '1',
        email: 'sarah.mitchell@email.com',
        name: 'Sarah Mitchell',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        googleId: 'demo-user-1',
        author: mockAuthors[0]
      };
      
      console.log('🟢 Demo user created:', demoUser);
      console.log('🟢 Setting user state...');
      
      setUser(demoUser);
      sessionStorage.setItem('kavvy_user', JSON.stringify(demoUser));
      
      console.log('✅ User state set, user should be:', demoUser.name);
      
      // Force a small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('❌ Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      if (window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
      setUser(null);
      sessionStorage.removeItem('kavvy_user');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// TypeScript declaration for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}