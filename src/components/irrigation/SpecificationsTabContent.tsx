
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TechSpecification } from '@/types/irrigation';
import SpecificationForm from './SpecificationForm';
import SpecificationsTable from './SpecificationsTable';

interface SpecificationsTabContentProps {
  specifications: TechSpecification[];
  showSpecificationForm: boolean;
  editingSpecification: TechSpecification | undefined;
  onShowForm: () => void;
  onEdit: (specification: TechSpecification) => void;
  onDelete: (id: string) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SpecificationsTabContent: React.FC<SpecificationsTabContentProps> = ({
  specifications,
  showSpecificationForm,
  editingSpecification,
  onShowForm,
  onEdit,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  if (showSpecificationForm) {
    return (
      <SpecificationForm
        specification={editingSpecification}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Technical Specifications</h2>
          <p className="text-stone-600">Detailed technical parameters for each technology</p>
        </div>
        <Button onClick={onShowForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Specification
        </Button>
      </div>

      <SpecificationsTable
        specifications={specifications}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
};

export default SpecificationsTabContent;
