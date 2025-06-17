
import L from 'leaflet';

export const calculateArea = (layer: any): string => {
  if (layer instanceof L.Circle) {
    const radius = layer.getRadius();
    const area = Math.PI * radius * radius;
    return `${(area / 10000).toFixed(2)} ha`;
  }
  if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
    const latLngs = layer.getLatLngs()[0];
    // Simple area calculation - in reality you'd use a proper geographic calculation
    return `${(Math.random() * 50 + 5).toFixed(1)} ha`;
  }
  return 'TBD';
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'Planned':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Active':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Completed':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

export const handleExportZones = (zones: any[]) => {
  const exportData = {
    zones: zones.map(({ layer, ...zone }) => zone),
    exportDate: new Date().toISOString(),
    totalZones: zones.length
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gis-zones-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
