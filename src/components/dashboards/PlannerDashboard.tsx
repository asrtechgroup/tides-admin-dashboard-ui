
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MapPin, Calendar, Target, Map, BarChart3 } from 'lucide-react';
import { projectsAPI } from '@/services/api';

const PlannerDashboard = () => {
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [recentPlanning, setRecentPlanning] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats = await projectsAPI.getDashboardStats();
        setKpiData([
          {
            title: 'Planning Projects',
            value: stats.planner_projects,
            change: stats.kpi_changes?.planner_projects || '',
            changeType: stats.kpi_changes?.planner_projects_type || 'positive',
            icon: Target,
            description: 'Active planning phases'
          },
          {
            title: 'Sites Analyzed',
            value: stats.planner_sites_analyzed,
            change: stats.kpi_changes?.planner_sites || '',
            changeType: stats.kpi_changes?.planner_sites_type || 'positive',
            icon: MapPin,
            description: 'Location assessments'
          },
          {
            title: 'Reports Generated',
            value: stats.planner_reports_generated,
            change: stats.kpi_changes?.planner_reports || '',
            changeType: stats.kpi_changes?.planner_reports_type || 'positive',
            icon: BarChart3,
            description: 'Planning documents'
          },
          {
            title: 'Project Success',
            value: stats.planner_project_success,
            change: stats.kpi_changes?.planner_success || '',
            changeType: stats.kpi_changes?.planner_success_type || 'positive',
            icon: TrendingUp,
            description: 'Planning accuracy'
          }
        ]);
        setRecentPlanning(stats.planner_recent_activities || []);
      } catch (err: any) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

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
        {loading ? (
          <div className="col-span-4 text-center">Loading...</div>
        ) : error ? (
          <div className="col-span-4 text-center text-red-500">{error}</div>
        ) : (
          kpiData.map((kpi, index) => {
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
          })
        )}
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
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : recentPlanning.length === 0 ? (
              <div>No recent planning activities.</div>
            ) : (
              recentPlanning.map((activity: any, idx: number) => (
                <div key={activity.id || idx} className="flex items-start space-x-4 p-3 rounded-lg bg-stone-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800">{activity.title || activity.action}</p>
                    <p className="text-sm text-stone-600">{activity.details || ''}</p>
                    <span className="text-xs text-stone-500">{activity.time || activity.timestamp || ''}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlannerDashboard;
