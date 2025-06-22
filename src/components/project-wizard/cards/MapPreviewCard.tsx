
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Map } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const MapPreviewCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Map className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-lg">Map Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 rounded-lg overflow-hidden border border-stone-200">
          <MapContainer
            center={[21.1458, 79.0882]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPreviewCard;
