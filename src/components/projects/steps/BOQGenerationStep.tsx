import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Save } from 'lucide-react';

interface BOQGenerationStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const BOQGenerationStep: React.FC<BOQGenerationStepProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>BOQ Generation</CardTitle>
        <CardDescription>Save and download your Bill of Quantities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">BOQ generation content coming soon...</p>
        <div className="flex gap-3">
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" />
            Save to Database
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BOQGenerationStep;
