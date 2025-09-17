import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { projectsAPI } from '@/services/api';

/**
 * DJANGO API INTEGRATION POINTS:
 * 
 * 1. GET /api/projects/ - Fetch user's projects with filters
 *    - Headers: Authorization: Bearer {token}
 *    - Query params: search, status, user_id
 *    - Response: { results: Project[], count: number }
 * 
 * 2. POST /api/projects/ - Create new project
 *    - Headers: Authorization: Bearer {token}
 *    - Body: { name, description, zone, regions, districts, status }
 * 
 * 3. GET /api/projects/{id}/ - Get specific project details
 * 
 * 4. PUT /api/projects/{id}/ - Update project
 * 
 * 5. DELETE /api/projects/{id}/ - Delete project
 * 
 * Project Model Fields:
 * - id (UUID)
 * - name (CharField)
 * - description (TextField)
 * - zone (CharField)
 * - regions (JSONField)
 * - districts (JSONField)
 * - scheme_name (CharField)
 * - step (IntegerField)
 * - status (CharField) - choices: draft, submitted, approved
 * - created_by (ForeignKey to User)
 * - created_at (DateTimeField)
 * - updated_at (DateTimeField)
 * - project_data (JSONField) - stores complete wizard data
 */

interface Project {
  id: string;
  name: string;
  description: string;
  zone: string;
  regions: string[];
  districts: string[];
  schemeName: string;
  step: number;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from Django backend
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response: any = await projectsAPI.getProjects();
      // Handle paginated or flat array
      if (Array.isArray(response)) {
        setProjects(response);
      } else if (response && Array.isArray(response.results)) {
        setProjects(response.results);
      } else {
        setProjects([]);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create new project via Django API
   * TODO: Implement project creation
   */
  const createProject = async (projectData: Partial<Project>) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/projects/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(projectData),
      // });
      // const newProject = await response.json();
      // setProjects([newProject, ...projects]);
      
      toast({
        title: "Project Created",
        description: "New project has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStepName = (step: number) => {
    const steps = ['Project Info', 'Crop Calendar', 'Scheme Design', 'BOQ & Submission'];
    return steps[step] || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Projects & Schemes</h1>
          <p className="text-stone-600 mt-1">Manage your irrigation project drafts</p>
        </div>
        <Button asChild>
          <Link to="/project-scheme">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Draft Projects</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                placeholder="Search projects by name, description, or zone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Regions</TableHead>
                  <TableHead>Current Step</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                      {searchTerm ? 'No projects found matching your search.' : 'No draft projects found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-stone-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-stone-900">{project.name}</p>
                          <p className="text-sm text-stone-500 truncate max-w-xs">
                            {project.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-stone-400" />
                          {project.zone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {project.regions.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                          <span className="text-sm">Step {project.step + 1}: {getStepName(project.step)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-stone-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/project-wizard/${project.id}`}>
                            Continue
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;
