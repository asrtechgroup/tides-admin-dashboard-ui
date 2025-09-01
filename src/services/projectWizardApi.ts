// Download project report (PDF/Excel)
export async function exportProjectReport(projectId: string, format: 'pdf' | 'excel'): Promise<string> {
  const res = await fetch(`/api/projects/${projectId}/export/?format=${format}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to export project report');
  const data = await res.json();
  return data.download_url;
}

// Download BOQ report (PDF/Excel) for BOQAnalysis
export async function exportBOQReport(boqAnalysisId: string, format: 'pdf' | 'excel'): Promise<string> {
  const res = await fetch(`/api/boq/analyses/${boqAnalysisId}/export_boq/?format=${format}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to export BOQ report');
  const data = await res.json();
  return data.download_url;
}
import { ProjectWizardData } from '../types/project-wizard';

const API_BASE = '/api/projects';

export async function fetchProjectWizard(projectId: string): Promise<ProjectWizardData> {
  const res = await fetch(`${API_BASE}/${projectId}/wizard/`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch project wizard data');
  return res.json();
}

export async function updateProjectWizard(projectId: string, data: Partial<ProjectWizardData>): Promise<ProjectWizardData> {
  const res = await fetch(`${API_BASE}/${projectId}/wizard/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update project wizard data');
  return res.json();
}

export async function submitProject(projectId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${projectId}/submit/`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to submit project');
}
