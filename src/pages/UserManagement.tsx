
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@tides.gov.in',
      role: 'Engineer',
      status: 'Active',
      lastLogin: '2 hours ago',
      projects: 12,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@tides.gov.in',
      role: 'Admin',
      status: 'Active',
      lastLogin: '1 day ago',
      projects: 28,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5d0?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.patel@tides.gov.in',
      role: 'Planner',
      status: 'Active',
      lastLogin: '3 hours ago',
      projects: 8,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@tides.gov.in',
      role: 'Viewer',
      status: 'Inactive',
      lastLogin: '1 week ago',
      projects: 0,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@tides.gov.in',
      role: 'Engineer',
      status: 'Active',
      lastLogin: '5 minutes ago',
      projects: 15,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Engineer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Planner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Viewer':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">User Management</h1>
          <p className="text-stone-600 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
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
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="planner">Planner</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold text-stone-800">{user.name}</h3>
                    <p className="text-sm text-stone-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </Badge>
                      <Badge className={`text-xs ${getStatusBadgeColor(user.status)}`}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-stone-600">
                  <div className="text-center">
                    <div className="font-semibold text-stone-800">{user.projects}</div>
                    <div>Projects</div>
                  </div>
                  <div className="text-center min-w-20">
                    <div className="font-semibold text-stone-800">Last Login</div>
                    <div>{user.lastLogin}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
