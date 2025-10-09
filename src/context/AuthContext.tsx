import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  salesCount: number;
  totalEarnings: number;
  joinDate: string;
  location?: string;
  website?: string;
  isCreator: boolean;
  creatorLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  
  // Extended profile fields
  dateOfBirth?: string;
  occupation?: string;
  education?: string;
  coverPhoto?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon?: React.ReactNode;
  }>;
  interests?: string[];
  isPrivate?: boolean;
  showEmail?: boolean;
  showLocation?: boolean;
  allowMessages?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        username: 'johndoe',
        email: email,
        displayName: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: 'Social commerce enthusiast | Creating amazing content',
        isVerified: true,
        followerCount: 12500,
        followingCount: 890,
        postCount: 342,
        salesCount: 156,
        totalEarnings: 25680.50,
        joinDate: '2023-01-15',
        location: 'New York, USA',
        website: 'https://johndoe.com',
        isCreator: true,
        creatorLevel: 'gold',
        
        // Extended profile fields with defaults
        dateOfBirth: '1990-05-15',
        occupation: 'Content Creator',
        education: 'Computer Science, NYU',
        coverPhoto: '',
        socialLinks: [],
        interests: ['Technology', 'Photography', 'Travel'],
        isPrivate: false,
        showEmail: false,
        showLocation: true,
        allowMessages: true,
        emailNotifications: true,
        pushNotifications: true,
        theme: 'light',
        language: 'en'
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token');
      
      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        displayName: userData.displayName,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        bio: '',
        isVerified: false,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        salesCount: 0,
        totalEarnings: 0,
        joinDate: new Date().toISOString().split('T')[0],
        isCreator: false,
        creatorLevel: 'bronze'
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', 'mock-jwt-token');

      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!user) return false;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return true;
    } catch (err) {
      setError('Profile update failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};