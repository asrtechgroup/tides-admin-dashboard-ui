
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Calculator, Download, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  area: number;
  irrigationType: string;
  zones: number;
  status: 'Designed' | 'Under Review' | 'Approved';
  cropType: string;
  designDate: string;
}

interface BOQItem {
  id: string;
  category: string;
  description: string;
  specification: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

const BOQBuilder = () => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [editingItem, setEditingItem] = useState<BOQItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<BOQItem>>({
    category: 'Materials',
    description: '',
    specification: '',
    quantity: 0,
    unit: 'nos',
    rate: 0
  });

  // Mock project data
  const projects: Project[] = [
    {
      id: '1',
      name: 'Mwanza Rice Irrigation Scheme',
      area: 250,
      irrigationType: 'Surface Irrigation',
      zones: 5,
      status: 'Designed',
      cropType: 'Rice, Maize',
      designDate: '2024-06-15'
    },
    {
      id: '2',
      name: 'Arusha Horticultural Project',
      area: 120,
      irrigationType: 'Drip Irrigation',
      zones: 8,
      status: 'Under Review',
      cropType: 'Vegetables, Fruits',
      designDate: '2024-06-10'
    },
    {
      id: '3',
      name: 'Dodoma Cotton Scheme',
      area: 180,
      irrigationType: 'Sprinkler',
      zones: 6,
      status: 'Designed',
      cropType: 'Cotton, Sunflower',
      designDate: '2024-06-08'
    }
  ];

  useEffect(() => {
    if (selectedProject) {
      generateBOQFromProject(selectedProject);
    }
  }, [selectedProject]);

  const generateBOQFromProject = (project: Project) => {
    const baseItems: BOQItem[] = [];
    let itemId = 1;

    // Generate BOQ based on irrigation type and area
    if (project.irrigationType === 'Drip Irrigation') {
      baseItems.push(
        {
          id: (itemId++).toString(),
          category: 'Earth Work',
          description: 'Excavation for main pipeline',
          specification: 'Manual excavation 0.8m deep',
          quantity: Math.round(project.area * 2),
          unit: 'meter',
          rate: 25,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Materials',
          description: 'HDPE Main Pipeline',
          specification: '110mm PN 6 HDPE pipe',
          quantity: Math.round(project.area * 4),
          unit: 'meter',
          rate: 45,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Materials',
          description: 'Sub-main Pipeline',
          specification: '75mm PN 6 HDPE pipe',
          quantity: Math.round(project.area * 8),
          unit: 'meter',
          rate: 32,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Materials',
          description: 'Lateral Lines',
          specification: '16mm PE pipe with emitters',
          quantity: Math.round(project.area * 150),
          unit: 'meter',
          rate: 12,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Equipment',
          description: 'Filtration System',
          specification: 'Sand + Screen filters',
          quantity: project.zones,
          unit: 'set',
          rate: 25000,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Equipment',
          description: 'Control Valves',
          specification: 'Hydraulic control valves',
          quantity: project.zones * 2,
          unit: 'nos',
          rate: 1500,
          amount: 0
        }
      );
    } else if (project.irrigationType === 'Surface Irrigation') {
      baseItems.push(
        {
          id: (itemId++).toString(),
          category: 'Earth Work',
          description: 'Main Canal Excavation',
          specification: '2.5m top width, 1.8m depth',
          quantity: Math.round(project.area * 0.8),
          unit: 'meter',
          rate: 180,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Earth Work',
          description: 'Secondary Canal Excavation',
          specification: '1.2m top width, 0.8m depth',
          quantity: Math.round(project.area * 2.5),
          unit: 'meter',
          rate: 120,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Materials',
          description: 'Canal Lining',
          specification: 'Concrete lining 75mm thick',
          quantity: Math.round(project.area * 1.5),
          unit: 'sqm',
          rate: 85,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Equipment',
          description: 'Outlet Structures',
          specification: 'Gated outlets with measuring',
          quantity: Math.round(project.area / 5),
          unit: 'nos',
          rate: 2500,
          amount: 0
        }
      );
    } else if (project.irrigationType === 'Sprinkler') {
      baseItems.push(
        {
          id: (itemId++).toString(),
          category: 'Materials',
          description: 'Main Pipeline',
          specification: '100mm PVC pipe',
          quantity: Math.round(project.area * 3),
          unit: 'meter',
          rate: 38,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Materials',
          description: 'Sub-main Pipeline',
          specification: '75mm PVC pipe',
          quantity: Math.round(project.area * 6),
          unit: 'meter',
          rate: 28,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Equipment',
          description: 'Sprinkler Heads',
          specification: 'Impact sprinklers 15m radius',
          quantity: Math.round(project.area * 1.2),
          unit: 'nos',
          rate: 450,
          amount: 0
        },
        {
          id: (itemId++).toString(),
          category: 'Equipment',
          description: 'Riser Pipes',
          specification: '25mm galvanized pipes',
          quantity: Math.round(project.area * 1.2),
          unit: 'nos',
          rate: 180,
          amount: 0
        }
      );
    }

    // Common items for all irrigation types
    baseItems.push(
      {
        id: (itemId++).toString(),
        category: 'Labor',
        description: 'Installation Labor',
        specification: 'Skilled technicians',
        quantity: Math.round(project.area * 0.5),
        unit: 'days',
        rate: 25000,
        amount: 0
      },
      {
        id: (itemId++).toString(),
        category: 'Labor',
        description: 'Unskilled Labor',
        specification: 'General laborers',
        quantity: Math.round(project.area * 1.5),
        unit: 'days',
        rate: 15000,
        amount: 0
      }
    );

    // Calculate amounts
    const itemsWithAmounts = baseItems.map(item => ({
      ...item,
      amount: item.quantity * item.rate
    }));

    setBOQItems(itemsWithAmounts);
    
    toast({
      title: "BOQ Generated",
      description: `Generated ${itemsWithAmounts.length} items for ${project.name}`,
    });
  };

  const handleAddItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.rate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const item: BOQItem = {
      id: (Date.now()).toString(),
      category: newItem.category || 'Materials',
      description: newItem.description,
      specification: newItem.specification || '',
      quantity: newItem.quantity || 0,
      unit: newItem.unit || 'nos',
      rate: newItem.rate || 0,
      amount: (newItem.quantity || 0) * (newItem.rate || 0)
    };

    setBOQItems([...boqItems, item]);
    setNewItem({
      category: 'Materials',
      description: '',
      specification: '',
      quantity: 0,
      unit: 'nos',
      rate: 0
    });
    setShowAddForm(false);
    
    toast({
      title: "Item Added",
      description: "BOQ item has been added successfully",
    });
  };

  const handleEditItem = (item: BOQItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    const updatedItems = boqItems.map(item => 
      item.id === editingItem.id 
        ? { ...editingItem, amount: editingItem.quantity * editingItem.rate }
        : item
    );
    
    setBOQItems(updatedItems);
    setEditingItem(null);
    
    toast({
      title: "Item Updated",
      description: "BOQ item has been updated successfully",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setBOQItems(boqItems.filter(item => item.id !== itemId));
    toast({
      title: "Item Deleted",
      description: "BOQ item has been removed",
    });
  };

  const totalCost = boqItems.reduce((sum, item) => sum + item.amount, 0);
  const costPerHa = selectedProject ? Math.round(totalCost / selectedProject.area) : 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Earth Work': return 'bg-amber-100 text-amber-800';
      case 'Materials': return 'bg-blue-100 text-blue-800';
      case 'Equipment': return 'bg-green-100 text-green-800';
      case 'Labor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Designed': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">BOQ Builder</h1>
          <p className="text-stone-600 mt-1">Analyze designed irrigation projects and generate comprehensive BOQ</p>
        </div>
        <div className="flex space-x-2">
          {selectedProject && (
            <>
              <Button variant="outline" onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="w-4 h-4 mr-2" />
                Export BOQ
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Project Selection */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Select Project</CardTitle>
            <CardDescription>Choose a designed project to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Available Projects</Label>
              <Select 
                value={selectedProject?.id || ''} 
                onValueChange={(value) => {
                  const project = projects.find(p => p.id === value);
                  setSelectedProject(project || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProject && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">Project Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Area:</span>
                    <span className="font-medium">{selectedProject.area} ha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Type:</span>
                    <span className="font-medium">{selectedProject.irrigationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Zones:</span>
                    <span className="font-medium">{selectedProject.zones}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Crops:</span>
                    <span className="font-medium">{selectedProject.cropType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Status:</span>
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {selectedProject.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* BOQ Content */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedProject ? (
            <Card className="border-0 shadow-md">
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-stone-800 mb-2">No Project Selected</h3>
                  <p className="text-stone-600">Select a designed project to generate and analyze BOQ</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Bill of Quantities</CardTitle>
                    <CardDescription>{selectedProject.name} - {boqItems.length} items</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      TSH {totalCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-stone-600">
                      TSH {costPerHa.toLocaleString()}/ha
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-16">Qty</TableHead>
                        <TableHead className="w-16">Unit</TableHead>
                        <TableHead className="w-20">Rate</TableHead>
                        <TableHead className="w-24">Amount</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {boqItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{item.description}</div>
                              {item.specification && (
                                <div className="text-xs text-stone-500">{item.specification}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{item.quantity}</TableCell>
                          <TableCell className="text-sm">{item.unit}</TableCell>
                          <TableCell className="text-sm">TSH {item.rate.toLocaleString()}</TableCell>
                          <TableCell className="text-sm font-medium">TSH {item.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Item Form */}
          {showAddForm && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Add BOQ Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select 
                      value={newItem.category} 
                      onValueChange={(value) => setNewItem({...newItem, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Earth Work">Earth Work</SelectItem>
                        <SelectItem value="Materials">Materials</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select 
                      value={newItem.unit} 
                      onValueChange={(value) => setNewItem({...newItem, unit: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nos">nos</SelectItem>
                        <SelectItem value="meter">meter</SelectItem>
                        <SelectItem value="sqm">sqm</SelectItem>
                        <SelectItem value="cum">cum</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="days">days</SelectItem>
                        <SelectItem value="set">set</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input 
                    value={newItem.description || ''} 
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Enter item description"
                  />
                </div>
                <div>
                  <Label>Specification</Label>
                  <Input 
                    value={newItem.specification || ''} 
                    onChange={(e) => setNewItem({...newItem, specification: e.target.value})}
                    placeholder="Enter specifications (optional)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      value={newItem.quantity || ''} 
                      onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Rate (TSH)</Label>
                    <Input 
                      type="number" 
                      value={newItem.rate || ''} 
                      onChange={(e) => setNewItem({...newItem, rate: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddItem} className="bg-emerald-600 hover:bg-emerald-700">
                    Add Item
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Item Form */}
          {editingItem && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Edit BOQ Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select 
                      value={editingItem.category} 
                      onValueChange={(value) => setEditingItem({...editingItem, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Earth Work">Earth Work</SelectItem>
                        <SelectItem value="Materials">Materials</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select 
                      value={editingItem.unit} 
                      onValueChange={(value) => setEditingItem({...editingItem, unit: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nos">nos</SelectItem>
                        <SelectItem value="meter">meter</SelectItem>
                        <SelectItem value="sqm">sqm</SelectItem>
                        <SelectItem value="cum">cum</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="days">days</SelectItem>
                        <SelectItem value="set">set</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input 
                    value={editingItem.description} 
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Specification</Label>
                  <Input 
                    value={editingItem.specification} 
                    onChange={(e) => setEditingItem({...editingItem, specification: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      value={editingItem.quantity} 
                      onChange={(e) => setEditingItem({...editingItem, quantity: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Rate (TSH)</Label>
                    <Input 
                      type="number" 
                      value={editingItem.rate} 
                      onChange={(e) => setEditingItem({...editingItem, rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleUpdateItem} className="bg-emerald-600 hover:bg-emerald-700">
                    Update Item
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cost Summary */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-lg">Cost Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProject ? (
              <>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-800">
                    TSH {totalCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-emerald-600">Total Project Cost</div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-800">
                    TSH {costPerHa.toLocaleString()}/ha
                  </div>
                  <div className="text-sm text-blue-600">Cost per Hectare</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-stone-800">Category Breakdown</h4>
                  {['Earth Work', 'Materials', 'Equipment', 'Labor'].map(category => {
                    const categoryTotal = boqItems
                      .filter(item => item.category === category)
                      .reduce((sum, item) => sum + item.amount, 0);
                    const percentage = totalCost > 0 ? ((categoryTotal / totalCost) * 100).toFixed(1) : '0';
                    
                    return (
                      <div key={category} className="flex justify-between items-center p-2 bg-stone-50 rounded">
                        <span className="text-sm font-medium">{category}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">TSH {categoryTotal.toLocaleString()}</div>
                          <div className="text-xs text-stone-500">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                <p className="text-stone-600 text-sm">Select a project to view cost analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BOQBuilder;
