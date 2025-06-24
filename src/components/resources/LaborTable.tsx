
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
import { Labor } from '@/types/resources';

interface LaborTableProps {
  labor: Labor[];
  onEdit: (labor: Labor) => void;
  onDelete: (id: string) => void;
}

const LaborTable: React.FC<LaborTableProps> = ({ labor, onEdit, onDelete }) => {
  const getExperienceColor = (experience: string) => {
    const colors = {
      entry: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      expert: 'bg-red-100 text-red-800',
    };
    return colors[experience as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill/Trade</TableHead>
            <TableHead>Experience Level</TableHead>
            <TableHead>Daily Rate (TSH)</TableHead>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labor.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.skill}</TableCell>
              <TableCell>
                <Badge className={getExperienceColor(item.experience)}>
                  {item.experience}
                </Badge>
              </TableCell>
              <TableCell>{item.dailyRate.toLocaleString()}</TableCell>
              <TableCell>{item.region}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
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

export default LaborTable;
