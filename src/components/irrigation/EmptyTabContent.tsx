
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LucideIcon } from 'lucide-react';

interface EmptyTabContentProps {
  title: string;
  description: string;
  buttonText: string;
  Icon: LucideIcon;
  emptyMessage: string;
}

const EmptyTabContent: React.FC<EmptyTabContentProps> = ({
  title,
  description,
  buttonText,
  Icon,
  emptyMessage,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-stone-600 mt-1">{description}</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-stone-500">
          <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyTabContent;
