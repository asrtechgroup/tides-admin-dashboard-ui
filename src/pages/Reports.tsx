
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Map,
  Eye
} from 'lucide-react';

const Reports = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [reportType, setReportType] = useState('');

  // Mock data for reports
  const projects = [
    { id: '1', name: 'Drip Irrigation System - Farm A', status: 'completed' },
    { id: '2', name: 'Sprinkler System - Farm B', status: 'in-progress' },
    { id: '3', name: 'Smart Irrigation - Farm C', status: 'completed' },
  ];

  const reportTemplates = [
    {
      id: 'project-summary',
      title: 'Project Summary Report',
      description: 'Comprehensive overview of project progress, costs, and timeline',
      icon: FileText,
      category: 'Project Reports'
    },
    {
      id: 'cost-analysis',
      title: 'Cost Analysis Report',
      description: 'Detailed breakdown of project costs and budget variance',
      icon: DollarSign,
      category: 'Financial Reports'
    },
    {
      id: 'resource-utilization',
      title: 'Resource Utilization Report',
      description: 'Analysis of material, labor, and equipment usage',
      icon: BarChart3,
      category: 'Resource Reports'
    },
    {
      id: 'performance-metrics',
      title: 'Performance Metrics Report',
      description: 'Key performance indicators and project efficiency metrics',
      icon: TrendingUp,
      category: 'Analytics Reports'
    },
    {
      id: 'team-productivity',
      title: 'Team Productivity Report',
      description: 'Team performance and productivity analysis',
      icon: Users,
      category: 'Team Reports'
    },
    {
      id: 'gis-analysis',
      title: 'GIS Analysis Report',
      description: 'Geographical and spatial analysis of irrigation coverage',
      icon: Map,
      category: 'Technical Reports'
    }
  ];

  const recentReports = [
    {
      id: '1',
      name: 'Monthly Cost Analysis - October 2024',
      type: 'Cost Analysis',
      generated: '2024-11-01',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: '2',
      name: 'Project Summary - Farm A Completion',
      type: 'Project Summary',
      generated: '2024-10-28',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: '3',
      name: 'Resource Utilization Q3 2024',
      type: 'Resource Analysis',
      generated: '2024-10-15',
      size: '3.1 MB',
      format: 'PDF'
    }
  ];

  const handleGenerateReport = () => {
    console.log('Generating report:', { selectedProject, dateRange, reportType });
    // Mock report generation
    alert('Report generation started! You will be notified when it\'s ready for download.');
  };

  const handleExport = (format: string) => {
    console.log('Exporting in format:', format);
    // Mock export functionality
    alert(`Exporting report in ${format} format...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Reports & Exports</h1>
        <p className="text-stone-600 mt-1">Generate and export project reports and analytics</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Report Generation Form */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generate New Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-select">Select Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose project..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleGenerateReport} className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Generate Report
                </Button>
                <Button variant="outline" onClick={() => handleExport('PDF')} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => handleExport('Excel')} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Report Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card key={template.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="w-5 h-5 text-emerald-600" />
                      {template.title}
                    </CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      {template.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-stone-600 text-sm mb-4">{template.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Report History */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-emerald-600" />
                      <div>
                        <h4 className="font-medium text-stone-800">{report.name}</h4>
                        <p className="text-sm text-stone-600">
                          {report.type} • Generated: {report.generated} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
