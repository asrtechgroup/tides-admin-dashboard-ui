
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
import { Equipment } from '@/types/resources';

interface EquipmentTableProps {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({ equipment, onEdit, onDelete }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      excavator: 'bg-blue-100 text-blue-800',
      trencher: 'bg-green-100 text-green-800',
      pump: 'bg-yellow-100 text-yellow-800',
      generator: 'bg-red-100 text-red-800',
      compactor: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Hourly Rate (TSH)</TableHead>
            <TableHead>Daily Rate (TSH)</TableHead>
            <TableHead>Operator Required</TableHead>
            <TableHead>Fuel Consumption (L/hr)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <Badge className={getTypeColor(item.type)}>
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell>{item.hourlyRate.toLocaleString()}</TableCell>
              <TableCell>{item.dailyRate.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={item.operator ? 'default' : 'secondary'}>
                  {item.operator ? 'Yes' : 'No'}
                </Badge>
              </TableCell>
              <TableCell>{item.fuelConsumption}</TableCell>
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

export default EquipmentTable;
