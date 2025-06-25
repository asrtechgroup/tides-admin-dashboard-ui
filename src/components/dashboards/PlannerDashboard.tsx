
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MapPin, Calendar, Target, Map, BarChart3 } from 'lucide-react';

const PlannerDashboard = () => {
  const plannerKpiData = [
    {
      title: 'Planning Projects',
      value: '8',
      change: '+2',
      changeType: 'positive' as const,
      icon: Target,
      description: 'Active planning phases'
    },
    {
      title: 'Sites Analyzed',
      value: '24',
      change: '+6',
      changeType: 'positive' as const,
      icon: MapPin,
      description: 'Location assessments'
    },
    {
      title: 'Reports Generated',
      value: '18',
      change: '+4',
      changeType: 'positive' as const,
      icon: BarChart3,
      description: 'Planning documents'
    },
    {
      title: 'Project Success',
      value: '96%',
      change: '+3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Planning accuracy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Planner Dashboard</h1>
          <p className="text-stone-600 mt-1">Project planning: Why, What, and Where</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-700 border-green-200">Planner Access</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plannerKpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-stone-600">
                  {kpi.title}
                </CardTitle>
                <Icon className="w-5 h-5 text-green-600" />
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

      {/* Planning Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Planning Tools</CardTitle>
            <CardDescription>Project analysis and strategic planning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
              <div className="font-medium text-green-800">Project Wizard</div>
              <div className="text-sm text-green-600">Start new project planning</div>
            </button>
            <button className="w-full p-3 text-left bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200">
              <div className="font-medium text-amber-800">GIS Planning</div>
              <div className="text-sm text-amber-600">Site analysis and mapping</div>
            </button>
            <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
              <div className="font-medium text-purple-800">Generate Reports</div>
              <div className="text-sm text-purple-600">Planning documentation</div>
            </button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Planning Activities</CardTitle>
            <CardDescription>Your latest planning work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4 p-3 rounded-lg bg-stone-50">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800">Site assessment completed</p>
                <p className="text-sm text-stone-600">Rajasthan - 100 hectare analysis</p>
                <span className="text-xs text-stone-500">3 hours ago</span>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-3 rounded-lg bg-stone-50">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800">Planning report generated</p>
                <p className="text-sm text-stone-600">Karnataka irrigation feasibility</p>
                <span className="text-xs text-stone-500">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlannerDashboard;
