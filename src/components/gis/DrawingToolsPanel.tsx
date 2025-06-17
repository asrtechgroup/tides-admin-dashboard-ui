
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DrawingToolsPanel: React.FC = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Drawing Tools</CardTitle>
        <CardDescription>Use the map controls to draw zones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-stone-50 rounded text-center">
            Rectangle
          </div>
          <div className="p-2 bg-stone-50 rounded text-center">
            Polygon
          </div>
          <div className="p-2 bg-stone-50 rounded text-center">
            Circle
          </div>
          <div className="p-2 bg-stone-50 rounded text-center">
            Marker
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawingToolsPanel;
