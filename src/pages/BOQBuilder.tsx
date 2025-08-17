import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Calculator, Download, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { boqAPI, handleAPIError } from '@/services/api';

const BOQBuilder = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [existingProjects, setExistingProjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [boqItems, setBoqItems] = useState<any[]>([]);
  const [boqAnalyses, setBoqAnalyses] = useState<any[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [projectsData, materialsData, technologiesData, analysesData, costData] = await Promise.all([
        boqAPI.getExistingProjects(),
        boqAPI.getMaterials(),
        boqAPI.getTechnologies(),
        boqAPI.getBOQAnalyses(),
        boqAPI.getCostAnalysis(),
      ]);

      setExistingProjects(projectsData.results || projectsData);
      setMaterials(materialsData.results || materialsData);
      setTechnologies(technologiesData.results || technologiesData);
      setBoqAnalyses(analysesData.results || analysesData);
      setCostAnalysis(costData);
    } catch (error) {
      toast.error('Failed to load data: ' + handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = (material: any) => {
    const newItem = {
      id: Date.now().toString(),
      description: material.name,
      unit: material.unit,
      quantity: 1,
      rate: material.current_price || material.regional_price || 0,
      amount: material.current_price || material.regional_price || 0
    };
    setBoqItems([...boqItems, newItem]);
    toast.success(`${material.name} added to BOQ`);
  };

  const handleAddTechnology = (technology: any) => {
    const newItem = {
      id: Date.now().toString(),
      description: `${technology.name} (${technology.technology_type})`,
      unit: 'set',
      quantity: 1,
      rate: technology.cost_per_unit || 0,
      amount: technology.cost_per_unit || 0,
      technology_type: technology.technology_type,
      efficiency: technology.efficiency
    };
    setBoqItems([...boqItems, newItem]);
    toast.success(`${technology.name} added to BOQ`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setBoqItems(boqItems.map(item => 
      item.id === id 
        ? { ...item, quantity, amount: quantity * item.rate }
        : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setBoqItems(boqItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return boqItems.reduce((total, item) => total + item.amount, 0);
  };

  const handleSaveBOQAnalysis = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    try {
      setSubmitting(true);
      const analysisData = {
        existing_project: selectedProject.id,
        boq_data: boqItems,
        total_cost: calculateTotal(),
        cost_per_hectare: selectedProject.area ? calculateTotal() / selectedProject.area : 0,
      };

      const result = await boqAPI.createBOQAnalysis(analysisData);
      setBoqAnalyses([result, ...boqAnalyses]);
      toast.success('BOQ analysis saved successfully');
      
      // Reset form
      setBoqItems([]);
      setSelectedProject(null);
    } catch (error) {
      toast.error('Failed to save BOQ analysis: ' + handleAPIError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportBOQ = async (analysisId: string, format: 'pdf' | 'excel') => {
    try {
      const result = await boqAPI.exportBOQ(analysisId, format);
      toast.success(result.message || `BOQ exported in ${format} format`);
      
      // Trigger download if URL is provided
      if (result.download_url) {
        window.open(result.download_url, '_blank');
      }
    } catch (error) {
      toast.error('Failed to export BOQ: ' + handleAPIError(error));
    }
  };

  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || material.category?.name?.toLowerCase() === filterType)
  );

  const filteredProjects = existingProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTechnologies = technologies.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || tech.technology_type === filterType)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading BOQ Builder...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">BOQ Builder</h1>
          <p className="text-muted-foreground">
            Analyze costs for existing irrigation projects and generate Bills of Quantities
          </p>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Existing Projects</TabsTrigger>
          <TabsTrigger value="materials">Materials Database</TabsTrigger>
          <TabsTrigger value="technologies">Technologies</TabsTrigger>
          <TabsTrigger value="boq">BOQ Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className={`cursor-pointer transition-colors ${
                  selectedProject?.id === project.id ? 'bg-primary/5 border-primary' : ''
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.irrigation_type}</CardDescription>
                    </div>
                    <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <MapPin className="inline-block w-4 h-4 mr-1" />
                      {project.location}
                    </p>
                    <p className="text-muted-foreground">
                      <CalendarDays className="inline-block w-4 h-4 mr-1" />
                      {new Date(project.construction_date).toLocaleDateString()}
                    </p>
                    <p className="font-semibold">
                      Area: {project.area} hectares
                    </p>
                    <p className="font-semibold text-lg">
                      Total Cost: TSh {project.actual_cost.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground">
                      Cost per hectare: TSh {(project.actual_cost / project.area).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {[...new Set(materials.map(m => m.category?.name).filter(Boolean))].map(category => (
                  <SelectItem key={category} value={category?.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{material.name}</h4>
                    <p className="text-sm text-muted-foreground">{material.category?.name}</p>
                    <p className="font-semibold">
                      TSh {(material.current_price || material.regional_price || 0).toLocaleString()} per {material.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">{material.specifications}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddMaterial(material)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technologies" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="surface">Surface Irrigation</SelectItem>
                <SelectItem value="pressurized">Pressurized</SelectItem>
                <SelectItem value="subsurface">Subsurface</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredTechnologies.map((technology) => (
              <Card key={technology.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{technology.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{technology.technology_type}</p>
                    <p className="font-semibold">
                      TSh {technology.cost_per_unit?.toLocaleString()} per unit
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Efficiency: {technology.efficiency}%
                    </p>
                    {technology.specifications && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {JSON.stringify(technology.specifications)}
                      </p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddTechnology(technology)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="boq" className="space-y-4">
          {selectedProject ? (
            <Card>
              <CardHeader>
                <CardTitle>BOQ for {selectedProject.name}</CardTitle>
                <CardDescription>
                  Location: {selectedProject.location} | Area: {selectedProject.area} hectares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {boqItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-border p-2 text-left">Description</th>
                            <th className="border border-border p-2 text-left">Unit</th>
                            <th className="border border-border p-2 text-left">Quantity</th>
                            <th className="border border-border p-2 text-left">Rate (TSh)</th>
                            <th className="border border-border p-2 text-left">Amount (TSh)</th>
                            <th className="border border-border p-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {boqItems.map((item) => (
                            <tr key={item.id}>
                              <td className="border border-border p-2">{item.description}</td>
                              <td className="border border-border p-2">{item.unit}</td>
                              <td className="border border-border p-2">
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                                  className="w-20"
                                />
                              </td>
                              <td className="border border-border p-2">{item.rate.toLocaleString()}</td>
                              <td className="border border-border p-2">{item.amount.toLocaleString()}</td>
                              <td className="border border-border p-2">
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No items added yet. Go to Materials or Technologies tab to add items.
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">
                      Total: TSh {calculateTotal().toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveBOQAnalysis}
                        disabled={submitting || boqItems.length === 0 || !selectedProject}
                      >
                        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calculator className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Project</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Choose an existing project from the Projects tab to start building your BOQ analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BOQBuilder;