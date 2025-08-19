import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authAPI } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'Viewer',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from backend
        const response = await authAPI.getUsers();
        // Try to handle paginated or flat array
        if (Array.isArray(response)) {
          setUsers(response);
        } else if (response && Array.isArray(response.results)) {
          setUsers(response.results);
        } else {
          setUsers([]);
        }
      } catch (err: any) {
        toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || (user.role?.toLowerCase() === roleFilter.toLowerCase());
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

  const handleAddUser = async () => {
    setLoading(true);
    try {
      await authAPI.registerUser(addUserForm);
      toast({ title: 'User registered', description: 'The user was created successfully.', variant: 'default' });
      setShowAddUser(false);
      setAddUserForm({ username: '', email: '', first_name: '', last_name: '', role: 'Viewer', password: '' });
      // Refresh user list from backend
      const response = await authAPI.getUsers();
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && Array.isArray(response.results)) {
        setUsers(response.results);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err?.response?.data?.error || err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">User Management</h1>
          <p className="text-stone-600 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowAddUser(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Username" value={addUserForm.username} onChange={e => setAddUserForm(f => ({ ...f, username: e.target.value }))} />
            <Input placeholder="Email" type="email" value={addUserForm.email} onChange={e => setAddUserForm(f => ({ ...f, email: e.target.value }))} />
            <div className="flex gap-2">
              <Input placeholder="First Name" value={addUserForm.first_name} onChange={e => setAddUserForm(f => ({ ...f, first_name: e.target.value }))} />
              <Input placeholder="Last Name" value={addUserForm.last_name} onChange={e => setAddUserForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
            <Select value={addUserForm.role} onValueChange={role => setAddUserForm(f => ({ ...f, role }))}>
              <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Engineer">Engineer</SelectItem>
                <SelectItem value="Planner">Planner</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Password" type="password" value={addUserForm.password} onChange={e => setAddUserForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddUser} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 w-full">{loading ? 'Registering...' : 'Register User'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    <AvatarImage src={user.avatar || undefined} alt={user.username} />
                    <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-stone-800">{user.username}</h3>
                    <p className="text-sm text-stone-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>{user.role}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-stone-600">
                  <div className="text-center min-w-20">
                    <div className="font-semibold text-stone-800">Joined</div>
                    <div>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</div>
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
