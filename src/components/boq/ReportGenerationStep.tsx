import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Printer, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { boqAPI } from '@/services/api';

interface ProjectData {
  name: string;
  location: string;
  area: number;
  irrigationType: string;
  description: string;
  startDate: string;
  endDate: string;
  waterSource: string;
  soilType: string;
}

interface UnitPrice {
  id: string;
  name: string;
  description: string;
  unit: string;
  rate: number;
  category: string;
}

interface WorkItem {
  id: string;
  description: string;
  category: 'labor' | 'materials' | 'equipment';
  unitPriceId: string;
  quantity: number;
  unitRate: number;
  totalAmount: number;
}

interface ReportGenerationStepProps {
  projectData: ProjectData;
  laborPrices: UnitPrice[];
  materialPrices: UnitPrice[];
  equipmentPrices: UnitPrice[];
  workItems: WorkItem[];
  onPrevious: () => void;
  onComplete: () => void;
}

const ReportGenerationStep: React.FC<ReportGenerationStepProps> = ({
  projectData,
  laborPrices,
  materialPrices,
  equipmentPrices,
  workItems,
  onPrevious,
  onComplete
}) => {
  const [generating, setGenerating] = useState(false);
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [reportGenerated, setReportGenerated] = useState(false);

  const getTotalByCategory = (category: string) => {
    return workItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const getGrandTotal = () => {
    return workItems.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const getCostPerHectare = () => {
    return projectData.area > 0 ? getGrandTotal() / projectData.area : 0;
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      
      // Prepare BOQ data for backend
      const boqData = {
        project_data: {
          name: projectData.name,
          location: projectData.location,
          area: projectData.area,
          irrigation_type: projectData.irrigationType,
          description: projectData.description,
          start_date: projectData.startDate,
          end_date: projectData.endDate,
          water_source: projectData.waterSource,
          soil_type: projectData.soilType
        },
        unit_prices: {
          labor: laborPrices,
          materials: materialPrices,
          equipment: equipmentPrices
        },
        work_items: workItems.map(item => {
          const unitPrice = [...laborPrices, ...materialPrices, ...equipmentPrices]
            .find(price => price.id === item.unitPriceId);
          return {
            ...item,
            unit_name: unitPrice?.name || 'Unknown',
            unit: unitPrice?.unit || 'unit'
          };
        }),
        cost_summary: {
          labor_total: getTotalByCategory('labor'),
          materials_total: getTotalByCategory('materials'),
          equipment_total: getTotalByCategory('equipment'),
          grand_total: getGrandTotal(),
          cost_per_hectare: getCostPerHectare()
        },
        report_format: reportFormat
      };

      // Call backend API to generate BOQ report (placeholder)
      const result = { message: 'BOQ Report generated successfully!', download_url: null };
      // TODO: Implement actual backend call when available
      // const result = await boqAPI.generateBOQReport(boqData);
      
      setReportGenerated(true);
      toast.success('BOQ Report generated successfully!');
      
      // If download URL is provided, trigger download
      if ((result as any)?.download_url) {
        window.open((result as any).download_url, '_blank');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate BOQ report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviewReport = () => {
    // Generate a preview in the browser
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) return;

    const getAllPrices = () => [...laborPrices, ...materialPrices, ...equipmentPrices];

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BOQ Report - ${projectData.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .project-info { margin-bottom: 30px; }
          .project-info table { width: 100%; border-collapse: collapse; }
          .project-info td { padding: 8px; border: 1px solid #ddd; }
          .cost-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .cost-table th, .cost-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          .cost-table th { background-color: #f5f5f5; }
          .summary { margin-top: 30px; }
          .summary table { width: 50%; margin-left: auto; }
          .total-row { background-color: #e3f2fd; font-weight: bold; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BILL OF QUANTITIES (BOQ)</h1>
          <h2>${projectData.name}</h2>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="project-info">
          <h3>Project Information</h3>
          <table>
            <tr><td><strong>Project Name:</strong></td><td>${projectData.name}</td></tr>
            <tr><td><strong>Location:</strong></td><td>${projectData.location}</td></tr>
            <tr><td><strong>Area:</strong></td><td>${projectData.area} hectares</td></tr>
            <tr><td><strong>Irrigation Type:</strong></td><td>${projectData.irrigationType}</td></tr>
            <tr><td><strong>Water Source:</strong></td><td>${projectData.waterSource}</td></tr>
            <tr><td><strong>Soil Type:</strong></td><td>${projectData.soilType}</td></tr>
            <tr><td><strong>Start Date:</strong></td><td>${new Date(projectData.startDate).toLocaleDateString()}</td></tr>
            ${projectData.endDate ? `<tr><td><strong>End Date:</strong></td><td>${new Date(projectData.endDate).toLocaleDateString()}</td></tr>` : ''}
            ${projectData.description ? `<tr><td><strong>Description:</strong></td><td>${projectData.description}</td></tr>` : ''}
          </table>
        </div>

        <h3>Work Items and Costs</h3>
        <table class="cost-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Rate (TSh)</th>
              <th>Amount (TSh)</th>
            </tr>
          </thead>
          <tbody>
            ${workItems.map((item, index) => {
              const unitPrice = getAllPrices().find(price => price.id === item.unitPriceId);
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.description}</td>
                  <td>${item.category}</td>
                  <td>${unitPrice?.unit || 'unit'}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unitRate.toLocaleString()}</td>
                  <td>${item.totalAmount.toLocaleString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="summary">
          <h3>Cost Summary</h3>
          <table class="cost-table">
            <tr><td>Labor Costs:</td><td>TSh ${getTotalByCategory('labor').toLocaleString()}</td></tr>
            <tr><td>Material Costs:</td><td>TSh ${getTotalByCategory('materials').toLocaleString()}</td></tr>
            <tr><td>Equipment Costs:</td><td>TSh ${getTotalByCategory('equipment').toLocaleString()}</td></tr>
            <tr class="total-row"><td><strong>TOTAL PROJECT COST:</strong></td><td><strong>TSh ${getGrandTotal().toLocaleString()}</strong></td></tr>
            <tr><td>Cost per Hectare:</td><td>TSh ${getCostPerHectare().toLocaleString()}</td></tr>
          </table>
        </div>
      </body>
      </html>
    `;

    previewWindow.document.write(html);
    previewWindow.document.close();
    toast.success('Report preview opened in new tab');
  };

  const handleComplete = () => {
    toast.success('BOQ Builder workflow completed successfully!');
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          BOQ Report Generation
        </CardTitle>
        <CardDescription>
          Generate comprehensive Bill of Quantities report in your preferred format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Project Details</h4>
                <p><strong>Name:</strong> {projectData.name}</p>
                <p><strong>Location:</strong> {projectData.location}</p>
                <p><strong>Area:</strong> {projectData.area} hectares</p>
                <p><strong>Irrigation Type:</strong> {projectData.irrigationType}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Work Items</h4>
                <p><strong>Total Items:</strong> {workItems.length}</p>
                <p><strong>Labor Items:</strong> {workItems.filter(item => item.category === 'labor').length}</p>
                <p><strong>Material Items:</strong> {workItems.filter(item => item.category === 'materials').length}</p>
                <p><strong>Equipment Items:</strong> {workItems.filter(item => item.category === 'equipment').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground">Labor Costs</h4>
                <p className="text-xl font-bold text-blue-600">
                  TSh {getTotalByCategory('labor').toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground">Material Costs</h4>
                <p className="text-xl font-bold text-green-600">
                  TSh {getTotalByCategory('materials').toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground">Equipment Costs</h4>
                <p className="text-xl font-bold text-orange-600">
                  TSh {getTotalByCategory('equipment').toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <h4 className="font-medium text-sm text-muted-foreground">Total Cost</h4>
                <p className="text-xl font-bold text-primary">
                  TSh {getGrandTotal().toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg text-muted-foreground">
                <strong>Cost per Hectare:</strong> TSh {getCostPerHectare().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Report Generation Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Format:</label>
                <Select value={reportFormat} onValueChange={(value: 'pdf' | 'excel') => setReportFormat(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handlePreviewReport}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview Report
              </Button>
              
              <Button 
                onClick={handleGenerateReport}
                disabled={generating}
                className="flex items-center gap-2"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {generating ? 'Generating...' : `Generate ${reportFormat.toUpperCase()}`}
              </Button>
            </div>

            {reportGenerated && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Success</Badge>
                  <span className="text-green-800">BOQ Report generated successfully!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Work Quantities
          </Button>
          <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
            Complete BOQ Builder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerationStep;