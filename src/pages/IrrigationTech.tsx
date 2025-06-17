
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const IrrigationTech = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Irrigation Technologies</h1>
        <p className="text-stone-600 mt-1">Manage supported irrigation technologies and their specifications</p>
      </div>
      
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-stone-600">
            This section will contain irrigation technology management including technology types, 
            specifications, costing rules, and suitability criteria.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IrrigationTech;
