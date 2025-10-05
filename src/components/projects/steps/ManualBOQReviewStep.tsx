import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ManualBOQReviewStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isManual?: boolean;
}

const ManualBOQReviewStep: React.FC<ManualBOQReviewStepProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleStore = () => {
    toast.success('Manual BOQ stored successfully!');
    setTimeout(() => navigate('/projects'), 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Store</CardTitle>
        <CardDescription>Review your manual BOQ data before storing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Project: {data.projectName}</h3>
          <p className="text-sm text-muted-foreground">
            Review your entries and click Store to save this manual BOQ data to help improve future recommendations.
          </p>
        </div>
        <Button onClick={handleStore} className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-4 h-4 mr-2" />
          Store Manual BOQ
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManualBOQReviewStep;
