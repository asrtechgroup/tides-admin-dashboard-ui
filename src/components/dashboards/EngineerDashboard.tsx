
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Wrench, FileText, Droplets, Map, BarChart3 } from 'lucide-react';
import { projectsAPI } from '@/services/api';
import { DashboardStats } from '@/types/irrigation';

const EngineerDashboard = () => {
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [recentWork, setRecentWork] = useState<any[]>([]);
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
            title: 'Active Projects',
            value: stats.engineer_active_projects,
            change: stats.kpi_changes?.engineer_projects || '',
            changeType: stats.kpi_changes?.engineer_projects_type || 'positive',
            icon: Wrench,
            description: 'Technical projects assigned'
          },
          {
            title: 'BOQs Completed',
            value: stats.engineer_boqs_completed,
            change: stats.kpi_changes?.engineer_boqs || '',
            changeType: stats.kpi_changes?.engineer_boqs_type || 'positive',
            icon: FileText,
            description: 'This month'
          },
          {
            title: 'Systems Designed',
            value: stats.engineer_systems_designed,
            change: stats.kpi_changes?.engineer_systems || '',
            changeType: stats.kpi_changes?.engineer_systems_type || 'positive',
            icon: Droplets,
            description: 'Irrigation systems'
          },
          {
            title: 'Efficiency Rate',
            value: stats.engineer_efficiency_rate,
            change: stats.kpi_changes?.engineer_efficiency || '',
            changeType: stats.kpi_changes?.engineer_efficiency_type || 'positive',
            icon: BarChart3,
            description: 'Technical accuracy'
          }
        ]);
        setRecentWork(stats.engineer_recent_work || []);
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
          <h1 className="text-3xl font-bold text-stone-800">Engineer Dashboard</h1>
          <p className="text-stone-600 mt-1">Technical implementation and system design</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">Engineer Access</Badge>
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
          })
        )}
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
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : recentWork.length === 0 ? (
              <div>No recent technical work.</div>
            ) : (
              recentWork.map((work: any, idx: number) => (
                <div key={work.id || idx} className="flex items-start space-x-4 p-3 rounded-lg bg-stone-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800">{work.title || work.action}</p>
                    <p className="text-sm text-stone-600">{work.details || ''}</p>
                    <span className="text-xs text-stone-500">{work.time || work.timestamp || ''}</span>
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

export default EngineerDashboard;
