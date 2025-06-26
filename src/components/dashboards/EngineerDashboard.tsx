
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Wrench, FileText, Droplets, Map, BarChart3 } from 'lucide-react';

const EngineerDashboard = () => {
  const engineerKpiData = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+3',
      changeType: 'positive' as const,
      icon: Wrench,
      description: 'Technical projects assigned'
    },
    {
      title: 'BOQs Completed',
      value: '28',
      change: '+5%',
      changeType: 'positive' as const,
      icon: FileText,
      description: 'This month'
    },
    {
      title: 'Systems Designed',
      value: '15',
      change: '+2',
      changeType: 'positive' as const,
      icon: Droplets,
      description: 'Irrigation systems'
    },
    {
      title: 'Efficiency Rate',
      value: '94%',
      change: '+2%',
      changeType: 'positive' as const,
      icon: BarChart3,
      description: 'Technical accuracy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Engineer Dashboard</h1>
          <p className="text-stone-600 mt-1">Technical implementation and system design</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">Engineer Access</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engineerKpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-stone-600">
                  {kpi.title}
                </CardTitle>
                <Icon className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stone-800 mb-1">
                  {kpi.value}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="default"
                    className="text-xs bg-green-100 text-green-700 border-green-200"
                  >
                    {kpi.change}
                  </Badge>
                  <span className="text-xs text-stone-500">{kpi.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Engineer Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Engineering Tools</CardTitle>
            <CardDescription>Technical design and implementation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
              <div className="font-medium text-blue-800">BOQ Builder</div>
              <div className="text-sm text-blue-600">Create technical specifications</div>
            </button>
            <button className="w-full p-3 text-left bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200">
              <div className="font-medium text-emerald-800">Irrigation Technologies</div>
              <div className="text-sm text-emerald-600">Configure system parameters</div>
            </button>
            <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
              <div className="font-medium text-purple-800">GIS Planning</div>
              <div className="text-sm text-purple-600">Technical layout design</div>
            </button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Technical Work</CardTitle>
            <CardDescription>Your latest engineering activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4 p-3 rounded-lg bg-stone-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800">BOQ completed for Maharashtra project</p>
                <p className="text-sm text-stone-600">Drip irrigation system - 50 hectares</p>
                <span className="text-xs text-stone-500">2 hours ago</span>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-3 rounded-lg bg-stone-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800">Technical review completed</p>
                <p className="text-sm text-stone-600">Gujarat subsurface irrigation</p>
                <span className="text-xs text-stone-500">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngineerDashboard;
