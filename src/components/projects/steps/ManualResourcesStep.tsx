import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ManualResourcesStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isManual?: boolean;
}

const ManualResourcesStep: React.FC<ManualResourcesStepProps> = ({ onNext }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources & Work Quantities</CardTitle>
        <CardDescription>Enter materials, equipment, and labor used</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">Manual resources entry coming soon...</p>
        <Button onClick={onNext} className="bg-emerald-600 hover:bg-emerald-700">
          Continue to Review
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManualResourcesStep;
