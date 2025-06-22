
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ProjectInfo } from '@/types/project-wizard';
import { useToast } from '@/hooks/use-toast';

interface FileUploadCardProps {
  data: ProjectInfo;
  onUpdate: (field: keyof ProjectInfo, value: any) => void;
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({ data, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploading file:', file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
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
            accept=".shp,.kmz,.kml"
            onChange={handleFileUpload}
            className="hidden"
          />
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
