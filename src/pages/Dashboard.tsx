
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, FolderOpen, Droplets, MapPin, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const kpiData = [
    {
      title: 'Total Projects',
      value: '247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FolderOpen,
      description: 'Active irrigation projects'
    },
    {
      title: 'Average Cost/Ha',
      value: '₹45,230',
      change: '-5%',
      changeType: 'negative' as const,
      icon: DollarSign,
      description: 'Cost efficiency improved'
    },
    {
      title: 'Active Users',
      value: '89',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Engineers and planners'
    },
    {
      title: 'Top Technology',
      value: 'Micro-drip',
      change: '67%',
      changeType: 'neutral' as const,
      icon: Droplets,
      description: 'Most utilized irrigation method'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New project submitted',
      user: 'Rahul Sharma',
      location: 'Maharashtra, Pune',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      action: 'BOQ approved',
      user: 'Priya Patel',
      location: 'Gujarat, Ahmedabad',
      time: '4 hours ago',
      status: 'approved'
    },
    {
      id: 3,
      action: 'Cost estimation updated',
      user: 'Amit Kumar',
      location: 'Rajasthan, Jaipur',
      time: '6 hours ago',
      status: 'updated'
    },
    {
      id: 4,
      action: 'New user registered',
      user: 'Sneha Reddy',
      location: 'Telangana, Hyderabad',
      time: '1 day ago',
      status: 'registered'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Dashboard</h1>
          <p className="text-stone-600 mt-1">Welcome back! Here's what's happening with your irrigation projects.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-stone-500">
          <MapPin className="w-4 h-4" />
          <span>Last updated: 5 minutes ago</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-stone-600">
                  {kpi.title}
                </CardTitle>
                <Icon className="w-5 h-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-stone-800 mb-1">
                  {kpi.value}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={kpi.changeType === 'positive' ? 'default' : kpi.changeType === 'negative' ? 'destructive' : 'secondary'}
                    className={`text-xs ${
                      kpi.changeType === 'positive' ? 'bg-green-100 text-green-700 border-green-200' :
                      kpi.changeType === 'negative' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-stone-50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800">
                      {activity.action}
                    </p>
                    <p className="text-sm text-stone-600">
                      by <span className="font-medium">{activity.user}</span> • {activity.location}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-stone-500">{activity.time}</span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200">
              <div className="font-medium text-emerald-800">Create New Project</div>
              <div className="text-sm text-emerald-600">Start a new irrigation project</div>
            </button>
            <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
              <div className="font-medium text-blue-800">Generate BOQ</div>
              <div className="text-sm text-blue-600">Build quantity estimates</div>
            </button>
            <button className="w-full p-3 text-left bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200">
              <div className="font-medium text-amber-800">View GIS Map</div>
              <div className="text-sm text-amber-600">Open planning interface</div>
            </button>
            <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
              <div className="font-medium text-purple-800">Export Reports</div>
              <div className="text-sm text-purple-600">Download project data</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
