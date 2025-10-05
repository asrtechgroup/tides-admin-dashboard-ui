import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CostingStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CostingStep: React.FC<CostingStepProps> = ({ onNext }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Costing</CardTitle>
        <CardDescription>Resource costs and calculations</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">Costing content coming soon...</p>
        <Button onClick={onNext} className="bg-emerald-600 hover:bg-emerald-700">
          Continue to BOQ Generation
        </Button>
      </CardContent>
    </Card>
  );
};

export default CostingStep;
