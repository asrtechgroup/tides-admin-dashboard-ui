
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TechnologyEntry } from '@/types/irrigation';
import TechnologyForm from './TechnologyForm';
import TechnologiesTable from './TechnologiesTable';

interface TechnologiesTabContentProps {
  technologies: TechnologyEntry[];
  showTechnologyForm: boolean;
  editingTechnology: TechnologyEntry | undefined;
  onShowForm: () => void;
  onEdit: (technology: TechnologyEntry) => void;
  onDelete: (id: string) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TechnologiesTabContent: React.FC<TechnologiesTabContentProps> = ({
  technologies,
  showTechnologyForm,
  editingTechnology,
  onShowForm,
  onEdit,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  if (showTechnologyForm) {
    return (
      <TechnologyForm
        open={showTechnologyForm}
        onOpenChange={(open) => !open && onCancel()}
        onSave={onSubmit}
        technology={editingTechnology}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Technology Catalog</h2>
          <p className="text-stone-600">Manage irrigation technology types and specifications</p>
        </div>
        <Button onClick={onShowForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Technology
        </Button>
      </div>

      <TechnologiesTable
        technologies={technologies}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
};

export default TechnologiesTabContent;
