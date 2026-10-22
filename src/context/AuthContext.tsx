import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from '../firebase';
import { triggerHaptic } from '../utils/haptics';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ur-admin-authenticated') === 'true';
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to live Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(true);
        localStorage.setItem('ur-admin-authenticated', 'true');
      } else {
        // Only clear if not in demo admin session
        const demoAuth = localStorage.getItem('ur-demo-admin') === 'true';
        if (!demoAuth) {
          setIsAdmin(false);
          localStorage.removeItem('ur-admin-authenticated');
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    triggerHaptic('medium');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      setUser(userCredential.user);
      setIsAdmin(true);
      localStorage.setItem('ur-admin-authenticated', 'true');
      localStorage.removeItem('ur-demo-admin');
      setIsLoading(false);
      triggerHaptic('success');
      return { success: true };
    } catch (err: any) {
      console.warn('Firebase signInWithEmailAndPassword failed:', err);
      setIsLoading(false);
      triggerHaptic('error');

      // Detailed human friendly error mapping
      let message = 'Invalid email or password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        message = 'No account found with these credentials. Ensure Email/Password provider is enabled in Firebase Console.';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Access temporarily disabled due to many failed login attempts. Try again later.';
      } else if (err.message) {
        message = err.message;
      }

      return { success: false, error: message };
    }
  };

  const loginAsDemoAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem('ur-admin-authenticated', 'true');
    localStorage.setItem('ur-demo-admin', 'true');
    triggerHaptic('success');
  };

  const logout = async () => {
    triggerHaptic('light');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Error signing out from Firebase:', e);
    }
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('ur-admin-authenticated');
    localStorage.removeItem('ur-demo-admin');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout, loginAsDemoAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
