
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Settings</h1>
        <p className="text-stone-600 mt-1">Configure system settings and preferences</p>
      </div>
      
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-stone-600">
            This section will contain system settings including user preferences, 
            regional configurations, and integration settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
