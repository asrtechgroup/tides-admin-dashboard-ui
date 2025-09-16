import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, X, Settings, Gauge } from 'lucide-react';
import { toast } from 'sonner';

interface HydraulicParameter {
  id: string;
  parameter: string;
  value: number;
  unit: string;
  description: string;
  editable: boolean;
  category: 'canal' | 'pipe' | 'pump' | 'general';
}

interface HydraulicDesignData {
  parameters: HydraulicParameter[];
  designFlow: number;
  headLoss: number;
  pumpingHead: number;
  efficiency: number;
}

interface HydraulicDesignStepProps {
  data: HydraulicDesignData | null;
  projectId?: string;
  onUpdate: (data: HydraulicDesignData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const HydraulicDesignStep: React.FC<HydraulicDesignStepProps> = ({
  data,
  projectId,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [parameters, setParameters] = useState<HydraulicParameter[]>(data?.parameters || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadHydraulicDesign();
  }, [projectId]);

  const loadHydraulicDesign = async () => {
    if (!projectId) return;

    try {
      setLoadingData(true);
      
      // TODO: Implement API call to GET /api/projects/:id/hydraulic-design/
      // const response = await projectAPI.getHydraulicDesign(projectId);
      
      // For now, use mock data
      const mockParameters: HydraulicParameter[] = [
        {
          id: '1',
          parameter: 'Main Canal Width',
          value: 2.5,
          unit: 'm',
          description: 'Width of the main distribution canal',
          editable: true,
          category: 'canal'
        },
        {
          id: '2',
          parameter: 'Main Canal Depth',
          value: 1.2,
          unit: 'm',
          description: 'Depth of the main distribution canal',
          editable: true,
          category: 'canal'
        },
        {
          id: '3',
          parameter: 'Canal Bed Slope',
          value: 0.001,
          unit: 'm/m',
          description: 'Longitudinal slope of the canal bed',
          editable: true,
          category: 'canal'
        },
        {
          id: '4',
          parameter: 'Main Pipe Diameter',
          value: 300,
          unit: 'mm',
          description: 'Diameter of main distribution pipe',
          editable: true,
          category: 'pipe'
        },
        {
          id: '5',
          parameter: 'Secondary Pipe Diameter',
          value: 200,
          unit: 'mm',
          description: 'Diameter of secondary distribution pipes',
          editable: true,
          category: 'pipe'
        },
        {
          id: '6',
          parameter: 'Pump Head Required',
          value: 45,
          unit: 'm',
          description: 'Total dynamic head required for pumping',
          editable: true,
          category: 'pump'
        },
        {
          id: '7',
          parameter: 'Pump Efficiency',
          value: 85,
          unit: '%',
          description: 'Overall pump system efficiency',
          editable: true,
          category: 'pump'
        },
        {
          id: '8',
          parameter: 'Design Flow Rate',
          value: 0.85,
          unit: 'm³/s',
          description: 'Maximum design flow rate for the system',
          editable: false,
          category: 'general'
        }
      ];

      setParameters(mockParameters);
      
    } catch (error) {
      console.error('Error loading hydraulic design:', error);
      toast.error('Failed to load hydraulic design parameters');
    } finally {
      setLoadingData(false);
    }
  };

  const handleEdit = (parameter: HydraulicParameter) => {
    if (!parameter.editable) {
      toast.error('This parameter cannot be edited');
      return;
    }
    setEditingId(parameter.id);
    setEditValue(parameter.value);
  };

  const handleSave = async (id: string) => {
    try {
      const updatedParameters = parameters.map(param =>
        param.id === id ? { ...param, value: editValue } : param
      );
      
      setParameters(updatedParameters);
      setEditingId(null);
      toast.success('Parameter updated successfully');
      
      // TODO: Implement API call to update parameter
      // await projectAPI.updateHydraulicParameter(projectId, id, editValue);
      
    } catch (error) {
      console.error('Error updating parameter:', error);
      toast.error('Failed to update parameter');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue(0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const designData: HydraulicDesignData = {
        parameters,
        designFlow: parameters.find(p => p.parameter === 'Design Flow Rate')?.value || 0,
        headLoss: 10, // Calculate based on parameters
        pumpingHead: parameters.find(p => p.parameter === 'Pump Head Required')?.value || 0,
        efficiency: parameters.find(p => p.parameter === 'Pump Efficiency')?.value || 0
      };

      onUpdate(designData);
      toast.success('Hydraulic design saved successfully');
      onNext();
      
    } catch (error) {
      console.error('Error saving hydraulic design:', error);
      toast.error('Failed to save hydraulic design');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'canal': return '🏞️';
      case 'pipe': return '🔧';
      case 'pump': return '⚡';
      case 'general': return '📊';
      default: return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'canal': return 'bg-blue-100 text-blue-800';
      case 'pipe': return 'bg-gray-100 text-gray-800';
      case 'pump': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading hydraulic design parameters...</p>
        </CardContent>
      </Card>
    );
  }

  const canalParams = parameters.filter(p => p.category === 'canal');
  const pipeParams = parameters.filter(p => p.category === 'pipe');
  const pumpParams = parameters.filter(p => p.category === 'pump');
  const generalParams = parameters.filter(p => p.category === 'general');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Hydraulic Design Parameters
        </CardTitle>
        <CardDescription>
          Review and configure hydraulic parameters for your irrigation system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Design Flow</p>
                  <p className="font-semibold">
                    {parameters.find(p => p.parameter === 'Design Flow Rate')?.value || 0} m³/s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pump Head</p>
                  <p className="font-semibold">
                    {parameters.find(p => p.parameter === 'Pump Head Required')?.value || 0} m
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="font-semibold">
                    {parameters.find(p => p.parameter === 'Pump Efficiency')?.value || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Main Pipe</p>
                  <p className="font-semibold">
                    {parameters.find(p => p.parameter === 'Main Pipe Diameter')?.value || 0} mm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parameters Tables by Category */}
        <div className="space-y-6">
          {/* Canal Parameters */}
          {canalParams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🏞️</span>
                  Canal Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {canalParams.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell className="font-medium">{param.parameter}</TableCell>
                        <TableCell>
                          {editingId === param.id ? (
                            <Input
                              type="number"
                              step="0.001"
                              value={editValue}
                              onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          ) : (
                            param.value
                          )}
                        </TableCell>
                        <TableCell>{param.unit}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {param.description}
                        </TableCell>
                        <TableCell>
                          {editingId === param.id ? (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSave(param.id)}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(param)}
                              disabled={!param.editable}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Pipe Parameters */}
          {pipeParams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🔧</span>
                  Pipe Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pipeParams.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell className="font-medium">{param.parameter}</TableCell>
                        <TableCell>
                          {editingId === param.id ? (
                            <Input
                              type="number"
                              step="1"
                              value={editValue}
                              onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          ) : (
                            param.value
                          )}
                        </TableCell>
                        <TableCell>{param.unit}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {param.description}
                        </TableCell>
                        <TableCell>
                          {editingId === param.id ? (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSave(param.id)}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(param)}
                              disabled={!param.editable}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Pump Parameters */}
          {pumpParams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>⚡</span>
                  Pump Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pumpParams.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell className="font-medium">{param.parameter}</TableCell>
                        <TableCell>
                          {editingId === param.id ? (
                            <Input
                              type="number"
                              step="1"
                              value={editValue}
                              onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          ) : (
                            param.value
                          )}
                        </TableCell>
                        <TableCell>{param.unit}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {param.description}
                        </TableCell>
                        <TableCell>
                          {editingId === param.id ? (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSave(param.id)}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(param)}
                              disabled={!param.editable}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Crop Calendar
          </Button>
          
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Next: Resources'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HydraulicDesignStep;