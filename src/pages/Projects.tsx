
import React, { useState } from 'react';
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

// Mock data for draft projects - replace with actual API call
const mockDraftProjects = [
  {
    id: '1',
    name: 'Irrigation Project Alpha',
    description: 'Drip irrigation system for agricultural zone A',
    zone: 'Zone A',
    regions: ['Region 1', 'Region 2'],
    districts: ['District 1'],
    schemeName: 'Alpha Scheme',
    step: 2,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Beta Water Management',
    description: 'Sprinkler system implementation',
    zone: 'Zone B',
    regions: ['Region 3'],
    districts: ['District 2', 'District 3'],
    schemeName: 'Beta Management Scheme',
    step: 1,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Gamma Irrigation Network',
    description: 'Comprehensive irrigation network for multiple crops',
    zone: 'Zone C',
    regions: ['Region 4', 'Region 5'],
    districts: ['District 4'],
    schemeName: 'Gamma Network',
    step: 3,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-22'
  }
];

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects] = useState(mockDraftProjects);

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
          <Link to="/project-wizard">
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
