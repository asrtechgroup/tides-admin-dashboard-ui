
import { Zone } from '@/types/gis';

export const sampleZones: Zone[] = [
  {
    id: 1,
    name: 'Zone A - Wheat Fields',
    area: '25.4 ha',
    irrigationType: 'Micro-drip',
    cropType: 'Wheat',
    status: 'Planned',
    coordinates: [21.1458, 79.0882]
  },
  {
    id: 2,
    name: 'Zone B - Cotton Fields',
    area: '18.7 ha',
    irrigationType: 'Sprinkler',
    cropType: 'Cotton',
    status: 'Active',
    coordinates: [21.1558, 79.0982]
  },
  {
    id: 3,
    name: 'Zone C - Vegetable Crops',
    area: '12.3 ha',
    irrigationType: 'Surface Drip',
    cropType: 'Vegetables',
    status: 'Completed',
    coordinates: [21.1358, 79.0782]
  }
];
