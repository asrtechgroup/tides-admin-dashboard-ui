
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Engineer' | 'Planner' | 'Viewer';
  avatar?: string;
  requiresPasswordChange?: boolean;
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock different user types based on email
    let mockUser: User;
    
    if (email.includes('admin')) {
      mockUser = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      };
    } else if (email.includes('engineer')) {
      mockUser = {
        id: '2',
        name: 'Engineer User',
        email: email,
        role: 'Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      };
    } else if (email.includes('planner')) {
      mockUser = {
        id: '3',
        name: 'Planner User',
        email: email,
        role: 'Planner',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5d0?w=32&h=32&fit=crop&crop=face'
      };
    } else {
      mockUser = {
        id: '4',
        name: 'Viewer User',
        email: email,
        role: 'Viewer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
      };
    }
    
    setUser(mockUser);
    localStorage.setItem('tides_user', JSON.stringify(mockUser));
    localStorage.setItem('tides_token', 'mock_jwt_token');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tides_user');
    localStorage.removeItem('tides_token');
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
