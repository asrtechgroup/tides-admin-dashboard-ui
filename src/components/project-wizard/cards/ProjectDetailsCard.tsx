
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProjectInfo } from '@/types/project-wizard';

interface ProjectDetailsCardProps {
  data: ProjectInfo;
  onUpdate: (field: keyof ProjectInfo, value: any) => void;
}

const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({ data, onUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Details</CardTitle>
        <CardDescription>Basic project information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={data.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Project description"
          />
        </div>
        
        <div>
          <Label htmlFor="schemeName">Scheme Name</Label>
          <Input
            id="schemeName"
            value={data.schemeName}
            onChange={(e) => onUpdate('schemeName', e.target.value)}
            placeholder="Enter scheme name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="totalArea">Total Area (Ha)</Label>
            <Input
              id="totalArea"
              type="number"
              value={data.totalArea || ''}
              onChange={(e) => onUpdate('totalArea', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="potentialArea">Potential Area (Ha)</Label>
            <Input
              id="potentialArea"
              type="number"
              value={data.potentialArea || ''}
              onChange={(e) => onUpdate('potentialArea', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetailsCard;
