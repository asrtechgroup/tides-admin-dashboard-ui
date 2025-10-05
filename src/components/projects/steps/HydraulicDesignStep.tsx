import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HydraulicDesignStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const HydraulicDesignStep: React.FC<HydraulicDesignStepProps> = ({ onNext }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hydraulic Design</CardTitle>
        <CardDescription>System recommendations and adjustments</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">Hydraulic design content coming soon...</p>
        <Button onClick={onNext} className="bg-emerald-600 hover:bg-emerald-700">
          Continue to Costing
        </Button>
      </CardContent>
    </Card>
  );
};

export default HydraulicDesignStep;
