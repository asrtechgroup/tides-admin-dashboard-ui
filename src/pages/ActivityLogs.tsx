
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Activity, User, FileText, Settings as SettingsIcon } from 'lucide-react';

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const activityLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:25',
      user: 'Rajesh Kumar',
      userRole: 'Engineer',
      action: 'BOQ Created',
      details: 'Created BOQ for Maharashtra Drip Irrigation Project',
      category: 'project',
      status: 'success'
    },
    {
      id: 2,
      timestamp: '2024-01-15 13:45:12',
      user: 'Priya Sharma',
      userRole: 'Admin',
      action: 'User Registered',
      details: 'Registered new engineer: Amit Patel',
      category: 'user',
      status: 'success'
    },
    {
      id: 3,
      timestamp: '2024-01-15 12:20:08',
      user: 'Sneha Reddy',
      userRole: 'Planner',
      action: 'Project Planning',
      details: 'Completed site analysis for Karnataka project',
      category: 'project',
      status: 'success'
    },
    {
      id: 4,
      timestamp: '2024-01-15 11:15:33',
      user: 'Vikram Singh',
      userRole: 'Engineer',
      action: 'Login Failed',
      details: 'Multiple failed login attempts',
      category: 'security',
      status: 'warning'
    },
    {
      id: 5,
      timestamp: '2024-01-15 10:30:45',
      user: 'Admin System',
      userRole: 'System',
      action: 'Settings Updated',
      details: 'System configuration parameters updated',
      category: 'system',
      status: 'success'
    }
  ];

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.category === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user':
        return User;
      case 'project':
        return FileText;
      case 'system':
        return SettingsIcon;
      case 'security':
        return Activity;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Engineer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Planner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'System':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Activity Logs</h1>
          <p className="text-stone-600 mt-1">Monitor system activity and user actions</p>
        </div>
        <Badge className="bg-red-100 text-red-700 border-red-200">Admin Only</Badge>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                placeholder="Search logs by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="user">User Actions</SelectItem>
                <SelectItem value="project">Project Actions</SelectItem>
                <SelectItem value="system">System Actions</SelectItem>
                <SelectItem value="security">Security Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Activity Log ({filteredLogs.length} entries)</CardTitle>
          <CardDescription>Chronological record of system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const CategoryIcon = getCategoryIcon(log.category);
              return (
                <div key={log.id} className="flex items-start space-x-4 p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <CategoryIcon className="w-5 h-5 text-stone-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-stone-800">{log.action}</h3>
                        <Badge className={`text-xs ${getStatusColor(log.status)}`}>
                          {log.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-stone-500">{log.timestamp}</span>
                    </div>
                    
                    <p className="text-sm text-stone-600 mb-2">{log.details}</p>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-stone-500">User:</span>
                        <span className="text-sm font-medium text-stone-700">{log.user}</span>
                        <Badge className={`text-xs ${getRoleColor(log.userRole)}`}>
                          {log.userRole}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;
