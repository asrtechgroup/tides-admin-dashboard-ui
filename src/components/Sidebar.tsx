
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  Database, 
  Settings, 
  FileText, 
  Map, 
  Droplets,
  TrendingUp,
  FolderOpen,
  BarChart3,
  Activity
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  permission: string;
}

const allMenuItems: MenuItem[] = [
  { icon: TrendingUp, label: 'Dashboard', path: '/', permission: 'dashboard_admin' },
  { icon: Users, label: 'User Management', path: '/users', permission: 'user_management' },
  { icon: Activity, label: 'Activity Logs', path: '/activity-logs', permission: 'activity_logs' },
  { icon: FolderOpen, label: 'Projects & Schemes', path: '/project-scheme', permission: 'view_projects' },
  { icon: Calendar, label: 'Project Scheme', path: '/project-scheme', permission: 'project_scheme' },
  { icon: FileText, label: 'BOQ Builder', path: '/boq-builder', permission: 'boq_builder' },
  { icon: Droplets, label: 'Irrigation Technologies', path: '/irrigation-tech', permission: 'irrigation_tech' },
  { icon: Map, label: 'GIS Planning', path: '/gis-planning', permission: 'gis_planning' },
  { icon: Database, label: 'Resources & Cost Database', path: '/resources', permission: 'manage_technical_aspects' },
  { icon: BarChart3, label: 'Reports & Exports', path: '/reports', permission: 'reports' },
  { icon: Settings, label: 'Settings', path: '/settings', permission: 'basic_settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => {
    // Special handling for dashboard - show for all roles but with different permissions
    if (item.path === '/') {
      return hasPermission('dashboard_admin') || 
             hasPermission('dashboard_engineer') || 
             hasPermission('dashboard_planner') || 
             hasPermission('dashboard_viewer');
    }
    // Special handling for settings - show for all roles but with different permissions
    if (item.path === '/settings') {
      return hasPermission('basic_settings') || hasPermission('full_settings');
    }
    return hasPermission(item.permission);
  });

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-gradient-to-b from-emerald-800 to-emerald-900 text-white shadow-xl transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-emerald-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">TIDES</h1>
              <p className="text-xs text-emerald-200">
                {user?.role} Dashboard
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-emerald-100 hover:bg-emerald-700/50 hover:text-white"
              )}
            >
              <Icon className={cn("flex-shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5")} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
