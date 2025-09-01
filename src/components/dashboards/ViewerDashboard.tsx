
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, FolderOpen, BarChart3, MapPin } from 'lucide-react';
import { projectsAPI } from '@/services/api';
import { DashboardStats } from '@/types/irrigation';

const ViewerDashboard = () => {
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats = await projectsAPI.getDashboardStats() as DashboardStats;
        setKpiData([
          {
            title: 'Projects Accessible',
            value: stats.viewer_projects_accessible,
            icon: FolderOpen,
            description: 'Projects you can view'
          },
          {
            title: 'Reports Available',
            value: stats.viewer_reports_available,
            icon: BarChart3,
            description: 'Available for viewing'
          },
          {
            title: 'Locations Covered',
            value: stats.viewer_locations_covered,
            icon: MapPin,
            description: 'Different regions'
          },
          {
            title: 'Last Updated',
            value: stats.viewer_last_updated,
            icon: Eye,
            description: 'Data refresh time'
          }
        ]);
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
          <h1 className="text-3xl font-bold text-stone-800">Viewer Dashboard</h1>
          <p className="text-stone-600 mt-1">Read-only access to project information</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-stone-100 text-stone-700 border-stone-200">Viewer Access</Badge>
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
                  <Icon className="w-5 h-5 text-stone-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stone-800 mb-1">
                    {kpi.value}
                  </div>
                  <span className="text-xs text-stone-500">{kpi.description}</span>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Available Information */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Available Information</CardTitle>
          <CardDescription>What you can access with viewer permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="font-medium text-stone-800 mb-1">Project Information</div>
            <div className="text-sm text-stone-600">View project details, status, and basic information</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="font-medium text-stone-800 mb-1">Reports & Analytics</div>
            <div className="text-sm text-stone-600">Access generated reports and project analytics</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="font-medium text-stone-800 mb-1">Basic Settings</div>
            <div className="text-sm text-stone-600">Update your profile and personal preferences</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewerDashboard;
