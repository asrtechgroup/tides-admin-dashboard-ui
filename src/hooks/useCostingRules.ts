
import { useState } from 'react';
import { toast } from 'sonner';
import { CostingRule } from '@/types/irrigation';

const initialCostingRules: CostingRule[] = [
  {
    component: 'Drip Pipes',
    costPerUnit: 1500,
    unit: 'm',
    formula: 'length * cost_per_unit',
    factors: ['length', 'diameter']
  },
  {
    component: 'Emitters',
    costPerUnit: 50,
    unit: 'pcs',
    formula: 'plant_count * emitters_per_plant * cost_per_unit',
    factors: ['plant_count', 'emitters_per_plant', 'flow_rate']
  },
  {
    component: 'Filter System',
    costPerUnit: 25000,
    unit: 'pcs',
    formula: 'area * filter_factor * cost_per_unit',
    factors: ['area', 'water_quality', 'flow_rate']
  }
];

export const useCostingRules = () => {
  const [costingRules, setCostingRules] = useState<CostingRule[]>(initialCostingRules);
  const [showCostingForm, setShowCostingForm] = useState(false);
  const [editingCostingRule, setEditingCostingRule] = useState<CostingRule | undefined>();

  const handleAddCostingRule = (data: any) => {
    const newRule: CostingRule = {
      ...data,
    };
    setCostingRules([...costingRules, newRule]);
    setShowCostingForm(false);
    toast.success('Costing rule added successfully');
  };

  const handleEditCostingRule = (rule: CostingRule) => {
    setEditingCostingRule(rule);
    setShowCostingForm(true);
  };

  const handleUpdateCostingRule = (data: any) => {
    if (editingCostingRule) {
      setCostingRules(costingRules.map(r => 
        r.component === editingCostingRule.component 
          ? { ...data }
          : r
      ));
      setShowCostingForm(false);
      setEditingCostingRule(undefined);
      toast.success('Costing rule updated successfully');
    }
  };

  const handleDeleteCostingRule = (component: string) => {
    setCostingRules(costingRules.filter(r => r.component !== component));
    toast.success('Costing rule deleted successfully');
  };

  const handleCancelForm = () => {
    setShowCostingForm(false);
    setEditingCostingRule(undefined);
  };

  return {
    costingRules,
    showCostingForm,
    editingCostingRule,
    setShowCostingForm,
    handleAddCostingRule,
    handleEditCostingRule,
    handleUpdateCostingRule,
    handleDeleteCostingRule,
    handleCancelForm,
  };
};
