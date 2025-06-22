
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
import { Material } from '@/types/resources';

interface MaterialsTableProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({ materials, onEdit, onDelete }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      pipes: 'bg-blue-100 text-blue-800',
      fittings: 'bg-green-100 text-green-800',
      valves: 'bg-yellow-100 text-yellow-800',
      pumps: 'bg-red-100 text-red-800',
      controllers: 'bg-purple-100 text-purple-800',
      sensors: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Base Price (TSH)</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Specifications</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell className="font-medium">{material.name}</TableCell>
              <TableCell>
                <Badge className={getCategoryColor(material.category)}>
                  {material.category}
                </Badge>
              </TableCell>
              <TableCell>{material.unit}</TableCell>
              <TableCell>{material.basePrice.toLocaleString()}</TableCell>
              <TableCell>{material.supplier}</TableCell>
              <TableCell className="max-w-xs truncate">{material.specifications}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(material)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(material.id)}
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

export default MaterialsTable;
