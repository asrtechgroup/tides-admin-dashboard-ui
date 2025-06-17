
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';

interface PageHeaderProps {
  onUpload: () => void;
  onExport: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onUpload, onExport }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">GIS Planning</h1>
        <p className="text-stone-600 mt-1">Interactive mapping and zone planning for irrigation projects</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onUpload} className="border-emerald-200 text-emerald-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Shapefile
        </Button>
        <Button variant="outline" onClick={onExport} className="border-blue-200 text-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
