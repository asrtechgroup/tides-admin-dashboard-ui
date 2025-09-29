
import { Zone } from '@/types/gis';

// Mock sample zones for testing and development
export const sampleZones: Zone[] = [
  {
    id: 1,
    name: 'Zone A - Vegetable Cultivation',
    area: '25.5',
    cropType: 'vegetable',
    irrigationType: 'Micro-drip',
    status: 'Active',
    coordinates: [77.2090, 28.6139]
  },
  {
    id: 2,
    name: 'Zone B - Cereal Crops',
    area: '45.2',
    cropType: 'cereal',
    irrigationType: 'Border Strip',
    status: 'Planned',
    coordinates: [77.2200, 28.6139]
  },
  {
    id: 3,
    name: 'Zone C - Cash Crops',
    area: '35.8',
    cropType: 'cash_crop',
    irrigationType: 'Sprinkler',
    status: 'Completed',
    coordinates: [77.2100, 28.6050]
  }
];
