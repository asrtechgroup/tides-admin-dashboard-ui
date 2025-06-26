
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminSettings from './AdminSettings';
import BasicSettings from './BasicSettings';

const SettingsSelector = () => {
  const { user, hasPermission } = useAuth();

  // Admin gets full settings, others get basic settings
  if (hasPermission('full_settings')) {
    return <AdminSettings />;
  }

  return <BasicSettings />;
};

export default SettingsSelector;
