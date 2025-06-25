
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ResourceItem } from '@/types/project-wizard';

interface ResourcesTableProps {
  resources: ResourceItem[];
  onRemove: (id: string) => void;
}

const ResourcesTable: React.FC<ResourcesTableProps> = ({ resources, onRemove }) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        <p>No resources selected yet. Add resources above to build your project requirements.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium">Selected Resources</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Rate (TSh)</TableHead>
            <TableHead>Amount (TSh)</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.rate.toLocaleString()}</TableCell>
              <TableCell>{item.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResourcesTable;
