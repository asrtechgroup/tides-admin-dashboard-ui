
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ResourceSummaryCardProps {
  category: string;
  total: number;
}

const ResourceSummaryCard: React.FC<ResourceSummaryCardProps> = ({ category, total }) => {
  return (
    <Card className="bg-stone-50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{category} Subtotal:</span>
          <span className="text-lg font-bold text-emerald-600">
            TSh {total.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceSummaryCard;
