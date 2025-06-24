
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
import { Edit, Trash2 } from 'lucide-react';
import { TechSpecification } from '@/types/irrigation';

interface SpecificationsTableProps {
  specifications: TechSpecification[];
  onEdit: (specification: TechSpecification) => void;
  onDelete: (id: string) => void;
}

const SpecificationsTable: React.FC<SpecificationsTableProps> = ({ specifications, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parameter</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specifications.map((spec, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{spec.parameter}</TableCell>
              <TableCell>{spec.value}</TableCell>
              <TableCell>{spec.unit}</TableCell>
              <TableCell className="max-w-xs truncate">{spec.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(spec)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(index.toString())}
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

export default SpecificationsTable;
