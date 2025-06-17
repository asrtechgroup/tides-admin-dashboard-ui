
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Resources = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Resources & Cost Database</h1>
        <p className="text-stone-600 mt-1">Manage materials, equipment, and cost databases</p>
      </div>
      
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-stone-600">
            This section will contain resource management functionality including material costs, 
            equipment rates, and regional price variations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
