
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectTotalCardProps {
  total: number;
}

const ProjectTotalCard: React.FC<ProjectTotalCardProps> = ({ total }) => {
  return (
    <Card className="bg-emerald-50 mt-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Total Project Cost:</span>
          <span className="text-2xl font-bold text-emerald-600">
            TSh {total.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTotalCard;
