import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, CheckCircle, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface BOQItem {
  id: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
}

interface BOQData {
  items: BOQItem[];
  summary: {
    materials: number;
    equipment: number;
    labor: number;
    contingency: number;
    subtotal: number;
    tax: number;
    grandTotal: number;
  };
  projectDetails: {
    name: string;
    location: string;
    area: number;
    technology: string;
  };
}

interface BOQCostingStepProps {
  data: BOQData | null;
  projectId?: string;
  projectData: any;
  onUpdate: (data: BOQData) => void;
  onPrevious: () => void;
}

const BOQCostingStep: React.FC<BOQCostingStepProps> = ({
  data,
  projectId,
  projectData,
  onUpdate,
  onPrevious
}) => {
  const [boqData, setBOQData] = useState<BOQData | null>(data);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(!!data);

  const generateBOQ = async () => {
    if (!projectId) {
      toast.error('Project ID is required');
      return;
    }

    try {
      setGenerating(true);
      
      // TODO: Implement API call to POST /api/projects/:id/boq/
      // const response = await projectAPI.generateBOQ(projectId);
      
      // For now, generate mock BOQ data
      const mockBOQItems: BOQItem[] = [
        // Materials
        {
          id: '1',
          category: 'Materials',
          description: 'PVC Pipes (200mm diameter)',
          unit: 'm',
          quantity: 500,
          unitRate: 25000,
          amount: 12500000
        },
        {
          id: '2',
          category: 'Materials',
          description: 'Drip irrigation emitters',
          unit: 'pcs',
          quantity: 1000,
          unitRate: 2500,
          amount: 2500000
        },
        {
          id: '3',
          category: 'Materials',
          description: 'Control valves',
          unit: 'pcs',
          quantity: 20,
          unitRate: 45000,
          amount: 900000
        },
        
        // Equipment
        {
          id: '4',
          category: 'Equipment',
          description: 'Water pump (5HP)',
          unit: 'pcs',
          quantity: 2,
          unitRate: 1500000,
          amount: 3000000
        },
        {
          id: '5',
          category: 'Equipment',
          description: 'Filter system',
          unit: 'set',
          quantity: 1,
          unitRate: 800000,
          amount: 800000
        },
        
        // Labor
        {
          id: '6',
          category: 'Labor',
          description: 'Skilled technician',
          unit: 'hours',
          quantity: 200,
          unitRate: 8000,
          amount: 1600000
        },
        {
          id: '7',
          category: 'Labor',
          description: 'General laborer',
          unit: 'hours',
          quantity: 400,
          unitRate: 3000,
          amount: 1200000
        },
        {
          id: '8',
          category: 'Labor',
          description: 'Site supervision',
          unit: 'days',
          quantity: 30,
          unitRate: 25000,
          amount: 750000
        }
      ];

      const materialsTotal = mockBOQItems.filter(item => item.category === 'Materials').reduce((sum, item) => sum + item.amount, 0);
      const equipmentTotal = mockBOQItems.filter(item => item.category === 'Equipment').reduce((sum, item) => sum + item.amount, 0);
      const laborTotal = mockBOQItems.filter(item => item.category === 'Labor').reduce((sum, item) => sum + item.amount, 0);
      const subtotal = materialsTotal + equipmentTotal + laborTotal;
      const contingency = subtotal * 0.1; // 10% contingency
      const tax = (subtotal + contingency) * 0.18; // 18% VAT
      const grandTotal = subtotal + contingency + tax;

      const generatedBOQ: BOQData = {
        items: mockBOQItems,
        summary: {
          materials: materialsTotal,
          equipment: equipmentTotal,
          labor: laborTotal,
          contingency,
          subtotal,
          tax,
          grandTotal
        },
        projectDetails: {
          name: projectData.basicInfo?.projectName || 'Irrigation Project',
          location: `${projectData.basicInfo?.district || 'Unknown'}, ${projectData.basicInfo?.region || 'Unknown'}`,
          area: projectData.basicInfo?.potentialArea || 0,
          technology: projectData.technology?.technologyName || 'Unknown'
        }
      };

      setBOQData(generatedBOQ);
      setGenerated(true);
      onUpdate(generatedBOQ);
      toast.success('BOQ generated successfully');
      
    } catch (error) {
      console.error('Error generating BOQ:', error);
      toast.error('Failed to generate BOQ');
    } finally {
      setGenerating(false);
    }
  };

  const downloadBOQ = (format: 'excel' | 'pdf') => {
    if (!boqData) {
      toast.error('Please generate BOQ first');
      return;
    }

    // TODO: Implement actual download functionality
    toast.success(`BOQ ${format.toUpperCase()} download will be implemented`);
  };

  const getCategoryItems = (category: string) => {
    return boqData?.items.filter(item => item.category === category) || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          BOQ & Cost Analysis
        </CardTitle>
        <CardDescription>
          Generate comprehensive bill of quantities and cost breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Summary */}
        {projectData.basicInfo && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Project Name</p>
                  <p className="font-medium">{projectData.basicInfo.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{projectData.basicInfo.district}, {projectData.basicInfo.region}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Irrigable Area</p>
                  <p className="font-medium">{projectData.basicInfo.potentialArea} ha</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Technology</p>
                  <p className="font-medium capitalize">{projectData.technology?.technologyName || 'Not selected'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate BOQ Section */}
        {!generated && (
          <Card className="border-2 border-dashed border-primary/20">
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">Generate Bill of Quantities</h3>
              <p className="text-muted-foreground mb-6">
                Create a comprehensive BOQ based on your project requirements, selected technology, 
                crop calendar, hydraulic design, and resource requirements.
              </p>
              <Button 
                onClick={generateBOQ} 
                disabled={generating}
                size="lg"
                className="flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating BOQ...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate BOQ
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* BOQ Results */}
        {generated && boqData && (
          <>
            {/* Cost Summary */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Materials:</span>
                      <span className="font-medium">TSh {boqData.summary.materials.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment:</span>
                      <span className="font-medium">TSh {boqData.summary.equipment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor:</span>
                      <span className="font-medium">TSh {boqData.summary.labor.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-medium">TSh {boqData.summary.subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Contingency (10%):</span>
                      <span className="font-medium">TSh {boqData.summary.contingency.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (18%):</span>
                      <span className="font-medium">TSh {boqData.summary.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-lg font-bold">Grand Total:</span>
                      <span className="text-lg font-bold text-primary">
                        TSh {boqData.summary.grandTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        Cost per hectare: TSh {Math.round(boqData.summary.grandTotal / (projectData.basicInfo?.potentialArea || 1)).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BOQ Items Table */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Items ({boqData.items.length})</TabsTrigger>
                <TabsTrigger value="materials">Materials ({getCategoryItems('Materials').length})</TabsTrigger>
                <TabsTrigger value="equipment">Equipment ({getCategoryItems('Equipment').length})</TabsTrigger>
                <TabsTrigger value="labor">Labor ({getCategoryItems('Labor').length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete BOQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Rate (TSh)</TableHead>
                          <TableHead>Amount (TSh)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {boqData.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.quantity.toLocaleString()}</TableCell>
                            <TableCell>{item.unitRate.toLocaleString()}</TableCell>
                            <TableCell className="font-semibold">{item.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {['Materials', 'Equipment', 'Labor'].map((category) => (
                <TabsContent key={category.toLowerCase()} value={category.toLowerCase()}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{category} Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Rate (TSh)</TableHead>
                            <TableHead>Amount (TSh)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCategoryItems(category).map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.description}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>{item.quantity.toLocaleString()}</TableCell>
                              <TableCell>{item.unitRate.toLocaleString()}</TableCell>
                              <TableCell className="font-semibold">{item.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={4} className="font-medium text-right">
                              {category} Subtotal:
                            </TableCell>
                            <TableCell className="font-bold">
                              TSh {getCategoryItems(category).reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Download Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export BOQ</CardTitle>
                <CardDescription>
                  Download the BOQ in your preferred format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => downloadBOQ('excel')}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Excel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => downloadBOQ('pdf')}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Resources
          </Button>
          
          {generated && (
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <CheckCircle className="w-4 h-4" />
              Project Complete
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BOQCostingStep;