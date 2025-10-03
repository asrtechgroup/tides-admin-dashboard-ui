import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Engineer' | 'Planner' | 'Viewer';
  avatar?: string;
  requiresPasswordChange?: boolean;
}

// Backend user profile type
interface Profile {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'Admin' | 'Engineer' | 'Planner' | 'Viewer';
  avatar?: string;
  requires_password_change?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Role-based permissions
const PERMISSIONS = {
  Admin: [
    'user_management',
    'activity_logs', 
    'full_settings',
    'dashboard_admin',
    'register_users',
    'view_all_projects',
    'manage_all_projects'
  ],
  Engineer: [
    'dashboard_engineer',
    'basic_settings',
    'view_projects',
    'manage_technical_aspects',
    'boq_builder',
    'irrigation_tech',
    'gis_planning'
  ],
  Planner: [
    'dashboard_planner',
    'basic_settings', 
    'view_projects',
    'project_wizard',
    'gis_planning',
    'reports'
  ],
  Viewer: [
    'dashboard_viewer',
    'basic_settings',
    'view_projects'
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('tides_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      await authAPI.login({ username: email, password });
      // Use 'any' for profile to avoid type error (TODO: type strictly)
      const profile: any = await authAPI.getProfile();
      const backendUser: User = {
        id: profile.id,
        name: profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.username || profile.email,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar,
        requiresPasswordChange: profile.requires_password_change,
      };
      setUser(backendUser);
      localStorage.setItem('tides_user', JSON.stringify(backendUser));
    } catch (error) {
      setUser(null);
      localStorage.removeItem('tides_user');
      localStorage.removeItem('auth_token');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Backend logout failed, but continue with cleanup
      console.warn('Logout request failed:', error);
    }
    // Always clean up user state and storage
    setUser(null);
    localStorage.removeItem('tides_user');
    localStorage.removeItem('auth_token');
  };

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return PERMISSIONS[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
