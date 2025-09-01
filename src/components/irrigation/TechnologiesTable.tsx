import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { TechnologyEntry } from '@/types/irrigation';

interface TechnologiesTableProps {
  technologies: TechnologyEntry[];
  onEdit: (technology: TechnologyEntry) => void;
  onDelete: (id: string) => void;
}

const TechnologiesTable: React.FC<TechnologiesTableProps> = ({ technologies, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Technology Name</TableHead>
            <TableHead>Irrigation Type</TableHead>
            <TableHead>Efficiency (%)</TableHead>
            <TableHead>Water Requirement</TableHead>
            <TableHead>Maintenance Level</TableHead>
            <TableHead>Lifespan (years)</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technologies.map((technology) => (
            <TableRow key={technology.id}>
              <TableCell className="font-medium">
                {technology.technology_name?.replace('_', ' ')?.toUpperCase() || 'N/A'}
              </TableCell>
              <TableCell>{technology.irrigation_type}</TableCell>
              <TableCell>{technology.efficiency}%</TableCell>
              <TableCell>{technology.water_requirement} L/m²/day</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    technology.maintenance_level === 'low' ? 'default' : 
                    technology.maintenance_level === 'medium' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {technology.maintenance_level?.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{technology.lifespan} years</TableCell>
              <TableCell className="max-w-xs truncate">{technology.description || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(technology)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(technology.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TechnologiesTable;