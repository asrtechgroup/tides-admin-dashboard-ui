
export interface Zone {
  id: number;
  name: string;
  area: string;
  irrigationType: string;
  cropType?: string;
  status: 'Planned' | 'Active' | 'Completed';
  coordinates?: [number, number];
  layer?: any;
}

export interface ZoneFormData {
  name: string;
  irrigationType: string;
  cropType: string;
  status: 'Planned' | 'Active' | 'Completed';
}

export const irrigationTypes = [
  'Micro-drip',
  'Sprinkler',
  'Furrow',
  'Border Strip',
  'Check Basin',
  'Surface Drip'
];

export const layerStyles = {
  satellite: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};
