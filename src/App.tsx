import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import UserManagement from "@/pages/UserManagement";
import Projects from "@/pages/Projects";
import BOQBuilder from "@/pages/BOQBuilder";
import IrrigationTech from "@/pages/IrrigationTech";
import GISPlanning from "@/pages/GISPlanning";
import Resources from "@/pages/Resources";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ActivityLogs from "@/pages/ActivityLogs";
import ProjectScheme from "./pages/ProjectScheme";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="admin-dashboard" element={<Dashboard />} />
              <Route path="engineer-dashboard" element={<Dashboard />} />
              <Route path="planner-dashboard" element={<Dashboard />} />
              <Route path="viewer-dashboard" element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="activity-logs" element={<ActivityLogs />} />
              <Route path="projects" element={<Projects />} />
              <Route path="project-scheme/:projectId?" element={<ProjectScheme/>} />
              <Route path="boq-builder" element={<BOQBuilder />} />
              <Route path="irrigation-tech" element={<IrrigationTech />} />
              <Route path="gis-planning" element={<GISPlanning />} />
              <Route path="resources" element={<Resources />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />4
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
