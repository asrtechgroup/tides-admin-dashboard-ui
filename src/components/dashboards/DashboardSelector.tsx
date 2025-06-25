
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import EngineerDashboard from './EngineerDashboard';
import PlannerDashboard from './PlannerDashboard';
import ViewerDashboard from './ViewerDashboard';

const DashboardSelector = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Engineer':
      return <EngineerDashboard />;
    case 'Planner':
      return <PlannerDashboard />;
    case 'Viewer':
      return <ViewerDashboard />;
    default:
      return <ViewerDashboard />;
  }
};

export default DashboardSelector;
