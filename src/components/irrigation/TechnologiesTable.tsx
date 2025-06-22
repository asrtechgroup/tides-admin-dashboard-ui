
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { IrrigationTechnology } from '@/types/irrigation';

interface TechnologiesTableProps {
  technologies: IrrigationTechnology[];
  onEdit: (technology: IrrigationTechnology) => void;
  onDelete: (id: string) => void;
}

const TechnologiesTable: React.FC<TechnologiesTableProps> = ({ technologies, onEdit, onDelete }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      drip: 'bg-blue-100 text-blue-800',
      sprinkler: 'bg-green-100 text-green-800',
      'micro-spray': 'bg-yellow-100 text-yellow-800',
      surface: 'bg-orange-100 text-orange-800',
      subsurface: 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMaintenanceColor = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Efficiency</TableHead>
            <TableHead>Water Req.</TableHead>
            <TableHead>Maintenance</TableHead>
            <TableHead>Lifespan</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technologies.map((tech) => (
            <TableRow key={tech.id}>
              <TableCell className="font-medium">{tech.name}</TableCell>
              <TableCell>
                <Badge className={getTypeColor(tech.type)}>
                  {tech.type.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell>{tech.efficiency}%</TableCell>
              <TableCell>{tech.waterRequirement} L/m²/day</TableCell>
              <TableCell>
                <Badge className={getMaintenanceColor(tech.maintenanceLevel)}>
                  {tech.maintenanceLevel}
                </Badge>
              </TableCell>
              <TableCell>{tech.lifespan} years</TableCell>
              <TableCell className="max-w-xs truncate">{tech.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(tech)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(tech.id)}
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
