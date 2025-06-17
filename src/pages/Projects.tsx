
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Projects = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Projects & Schemes</h1>
        <p className="text-stone-600 mt-1">Manage irrigation projects and government schemes</p>
      </div>
      
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-stone-600">
            This section will contain project management functionality including project creation, 
            tracking, and scheme management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;
