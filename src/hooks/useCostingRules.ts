import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { materialsAPI } from '@/services/api';
import { CostingRule } from '@/types/irrigation';

export const useCostingRules = () => {
  const [costingRules, setCostingRules] = useState<CostingRule[]>([]);
  const [showCostingForm, setShowCostingForm] = useState(false);
  const [editingCostingRule, setEditingCostingRule] = useState<CostingRule | undefined>();

  // Fetch from backend on mount and after any change
  const fetchCostingRules = async () => {
    try {
      const data: any = await materialsAPI.getCostingRules();
      setCostingRules(data.results || data);
    } catch (error) {
      toast.error('Failed to load costing rules from backend.');
      setCostingRules([]);
    }
  };

  useEffect(() => {
    fetchCostingRules();
  }, []);

  const handleAddCostingRule = async (data: any) => {
    try {
      await materialsAPI.createCostingRule(data);
      toast.success('Costing rule added successfully');
      setShowCostingForm(false);
      fetchCostingRules();
    } catch (error) {
      toast.error('Failed to add costing rule.');
    }
  };

  const handleEditCostingRule = (rule: CostingRule) => {
    setEditingCostingRule(rule);
    setShowCostingForm(true);
  };

  const handleUpdateCostingRule = async (data: any) => {
    if (!editingCostingRule) return;
    try {
      await materialsAPI.updateCostingRule(editingCostingRule.component, data);
      toast.success('Costing rule updated successfully');
      setShowCostingForm(false);
      setEditingCostingRule(undefined);
      fetchCostingRules();
    } catch (error) {
      toast.error('Failed to update costing rule.');
    }
  };

  const handleDeleteCostingRule = async (component: string) => {
    try {
      await materialsAPI.deleteCostingRule(component);
      toast.success('Costing rule deleted successfully');
      fetchCostingRules();
    } catch (error) {
      toast.error('Failed to delete costing rule.');
    }
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
