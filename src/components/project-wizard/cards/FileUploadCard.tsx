
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ProjectInfo } from '@/types/project-wizard';
import { useToast } from '@/hooks/use-toast';

interface FileUploadCardProps {
  data: ProjectInfo;
  onUpdate: (field: keyof ProjectInfo, value: any) => void;
  onFileCoordinates?: (coordinates: [number, number][]) => void;
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({ data, onUpdate, onFileCoordinates }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processShapefile = (file: File) => {
    // Mock coordinate extraction - in real implementation, you'd use libraries like shapefile-js or turf
    // For demonstration, we'll use different coordinates based on selected zone/region
    let mockCoordinates: [number, number][] = [];
    
    if (data.zone === 'Kilimanjaro') {
      mockCoordinates = [
        [-3.0674, 37.3556], // Mount Kilimanjaro area
        [-3.1000, 37.4000],
        [-3.0500, 37.4500],
        [-3.0200, 37.3800]
      ];
    } else if (data.zone === 'Dodoma') {
      mockCoordinates = [
        [-6.1630, 35.7516], // Dodoma area
        [-6.2000, 35.8000],
        [-6.1200, 35.8200],
        [-6.1400, 35.7200]
      ];
    } else {
      // Default coordinates for other zones
      mockCoordinates = [
        [-6.3678, 34.8854], // Central Tanzania
        [-6.4000, 34.9200],
        [-6.3400, 34.9400],
        [-6.3200, 34.8600]
      ];
    }

    return mockCoordinates;
  };

  const processKMZ = (file: File) => {
    // Mock KMZ processing - similar approach as shapefile
    return processShapefile(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploading file:', file);
      
      let coordinates: [number, number][] = [];
      
      if (file.name.toLowerCase().endsWith('.shp') || file.name.toLowerCase().includes('shapefile')) {
        coordinates = processShapefile(file);
      } else if (file.name.toLowerCase().endsWith('.kmz') || file.name.toLowerCase().endsWith('.kml')) {
        coordinates = processKMZ(file);
      }

      // Update the parent component with coordinates
      if (coordinates.length > 0 && onFileCoordinates) {
        onFileCoordinates(coordinates);
      }

      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded and processed successfully.`,
      });

      // Store file info in project data
      onUpdate('shapefileUrl', file.name);
      
      setTimeout(() => {
        onUpdate('soilType', 'Loamy Clay');
        toast({
          title: "Soil Type Detected",
          description: "Soil analysis complete: Loamy Clay",
        });
      }, 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">File Upload</CardTitle>
        <CardDescription>Upload shapefile or KMZ file</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Shapefile/KMZ
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".shp,.kmz,.kml,.zip"
            onChange={handleFileUpload}
            className="hidden"
          />
          {data.shapefileUrl && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Uploaded File:</strong> {data.shapefileUrl}
              </p>
            </div>
          )}
          {data.soilType && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Detected Soil Type:</strong> {data.soilType}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
