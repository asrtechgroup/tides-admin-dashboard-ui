
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Reports & Exports</h1>
        <p className="text-stone-600 mt-1">Generate and export project reports and analytics</p>
      </div>
      
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-stone-600">
            This section will contain reporting functionality including project reports, 
            cost analyses, and data export capabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
