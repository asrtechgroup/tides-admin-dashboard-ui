
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, FolderOpen, Activity, Shield, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminKpiData = [
    {
      title: 'Total Users',
      value: '89',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Active system users'
    },
    {
      title: 'Total Projects',
      value: '247',
      change: '+8%',
      changeType: 'positive' as const,
      icon: FolderOpen,
      description: 'All irrigation projects'
    },
    {
      title: 'System Activity',
      value: '1,245',
      change: '+25%',
      changeType: 'positive' as const,
      icon: Activity,
      description: 'Actions this week'
    },
    {
      title: 'Security Alerts',
      value: '3',
      change: '-2',
      changeType: 'negative' as const,
      icon: Shield,
      description: 'Resolved this month'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New engineer registered',
      user: 'Admin',
      details: 'Rahul Sharma - Maharashtra',
      time: '2 hours ago',
      status: 'registered'
    },
    {
      id: 2,
      action: 'Project approval required',
      user: 'Priya Patel',
      details: 'Gujarat Drip Irrigation - Phase 2',
      time: '4 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      action: 'User role updated',
      user: 'Admin',
      details: 'Amit Kumar - Engineer to Senior Engineer',
      time: '6 hours ago',
      status: 'updated'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Admin Dashboard</h1>
          <p className="text-stone-600 mt-1">System overview and user management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-red-100 text-red-700 border-red-200">Admin Access</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminKpiData.map((kpi, index) => {
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
                    variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}
                    className={`text-xs ${
                      kpi.changeType === 'positive' ? 'bg-green-100 text-green-700 border-green-200' :
                      'bg-red-100 text-red-700 border-red-200'
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
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>System Activity</span>
            </CardTitle>
            <CardDescription>Recent administrative actions</CardDescription>
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
                      by <span className="font-medium">{activity.user}</span> • {activity.details}
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

        {/* Admin Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>System management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button 
              onClick={() => navigate('/users')}
              className="w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
            >
              <div className="font-medium text-red-800 flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Register New User
              </div>
              <div className="text-sm text-red-600">Add engineers and planners</div>
            </button>
            <button 
              onClick={() => navigate('/users')}
              className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <div className="font-medium text-blue-800 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </div>
              <div className="text-sm text-blue-600">Edit roles and permissions</div>
            </button>
            <button 
              onClick={() => navigate('/activity-logs')}
              className="w-full p-3 text-left bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
            >
              <div className="font-medium text-amber-800 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                View Activity Logs
              </div>
              <div className="text-sm text-amber-600">Monitor system usage</div>
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
            >
              <div className="font-medium text-purple-800 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                System Settings
              </div>
              <div className="text-sm text-purple-600">Configure system parameters</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
