# Sample Data for TIDES Project & Scheme System
# Run this script to populate your database with sample data

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from decimal import Decimal
from datetime import date
from ..models import (
    IrrigationTechnology, Crop, ResourceCategory
)

class Command(BaseCommand):
    help = 'Load sample data for TIDES system'
    
    def handle(self, *args, **options):
        self.stdout.write('Loading sample data...')
        
        # Create sample irrigation technologies
        self.create_irrigation_technologies()
        
        # Create sample crops
        self.create_crops()
        
        # Create resource categories
        self.create_resource_categories()
        
        self.stdout.write(self.style.SUCCESS('Sample data loaded successfully!'))
    
    def create_irrigation_technologies(self):
        """Create sample irrigation technologies"""
        technologies = [
            # Surface Irrigation
            {
                'technology_name': 'surface',
                'irrigation_type': 'basin_irrigation',
                'efficiency': Decimal('65.00'),
                'maintenance_level': 'low',
                'description': 'Traditional basin irrigation method',
                'cost_per_hectare': Decimal('25000.00')
            },
            {
                'technology_name': 'surface',
                'irrigation_type': 'furrow_irrigation',
                'efficiency': Decimal('70.00'),
                'maintenance_level': 'low',
                'description': 'Furrow irrigation for row crops',
                'cost_per_hectare': Decimal('30000.00')
            },
            {
                'technology_name': 'surface',
                'irrigation_type': 'border_irrigation',
                'efficiency': Decimal('75.00'),
                'maintenance_level': 'medium',
                'description': 'Border irrigation for field crops',
                'cost_per_hectare': Decimal('35000.00')
            },
            
            # Subsurface Irrigation
            {
                'technology_name': 'subsurface',
                'irrigation_type': 'subsurface_drip',
                'efficiency': Decimal('90.00'),
                'maintenance_level': 'high',
                'description': 'Subsurface drip irrigation system',
                'cost_per_hectare': Decimal('125000.00')
            },
            {
                'technology_name': 'subsurface',
                'irrigation_type': 'capillary_irrigation',
                'efficiency': Decimal('85.00'),
                'maintenance_level': 'medium',
                'description': 'Capillary irrigation system',
                'cost_per_hectare': Decimal('80000.00')
            },
            
            # Pressurized Irrigation
            {
                'technology_name': 'pressurized',
                'irrigation_type': 'drip_irrigation',
                'efficiency': Decimal('90.00'),
                'maintenance_level': 'high',
                'description': 'Drip irrigation system',
                'cost_per_hectare': Decimal('100000.00')
            },
            {
                'technology_name': 'pressurized',
                'irrigation_type': 'micro_sprinkler',
                'efficiency': Decimal('85.00'),
                'maintenance_level': 'medium',
                'description': 'Micro sprinkler irrigation',
                'cost_per_hectare': Decimal('75000.00')
            },
            {
                'technology_name': 'pressurized',
                'irrigation_type': 'center_pivot',
                'efficiency': Decimal('80.00'),
                'maintenance_level': 'high',
                'description': 'Center pivot irrigation system',
                'cost_per_hectare': Decimal('150000.00')
            },
        ]
        
        for tech_data in technologies:
            IrrigationTechnology.objects.get_or_create(
                technology_name=tech_data['technology_name'],
                irrigation_type=tech_data['irrigation_type'],
                defaults=tech_data
            )
        
        self.stdout.write('Created irrigation technologies')
    
    def create_crops(self):
        """Create sample crops with coefficients"""
        crops = [
            # Cereals
            {
                'name': 'Rice',
                'crop_type': 'cereal',
                'growth_duration': 120,
                'kc_initial': Decimal('1.000'),
                'kc_development': Decimal('1.200'),
                'kc_mid': Decimal('1.200'),
                'kc_late': Decimal('0.600'),
                'initial_stage_days': 30,
                'development_stage_days': 30,
                'mid_stage_days': 40,
                'late_stage_days': 20
            },
            {
                'name': 'Wheat',
                'crop_type': 'cereal',
                'growth_duration': 150,
                'kc_initial': Decimal('0.400'),
                'kc_development': Decimal('0.700'),
                'kc_mid': Decimal('1.150'),
                'kc_late': Decimal('0.400'),
                'initial_stage_days': 20,
                'development_stage_days': 60,
                'mid_stage_days': 50,
                'late_stage_days': 20
            },
            {
                'name': 'Maize',
                'crop_type': 'cereal',
                'growth_duration': 125,
                'kc_initial': Decimal('0.300'),
                'kc_development': Decimal('0.700'),
                'kc_mid': Decimal('1.200'),
                'kc_late': Decimal('0.600'),
                'initial_stage_days': 20,
                'development_stage_days': 35,
                'mid_stage_days': 40,
                'late_stage_days': 30
            },
            
            # Legumes
            {
                'name': 'Groundnut',
                'crop_type': 'legume',
                'growth_duration': 130,
                'kc_initial': Decimal('0.400'),
                'kc_development': Decimal('0.800'),
                'kc_mid': Decimal('1.150'),
                'kc_late': Decimal('0.600'),
                'initial_stage_days': 25,
                'development_stage_days': 35,
                'mid_stage_days': 45,
                'late_stage_days': 25
            },
            {
                'name': 'Soybean',
                'crop_type': 'legume',
                'growth_duration': 135,
                'kc_initial': Decimal('0.400'),
                'kc_development': Decimal('0.800'),
                'kc_mid': Decimal('1.150'),
                'kc_late': Decimal('0.500'),
                'initial_stage_days': 20,
                'development_stage_days': 30,
                'mid_stage_days': 60,
                'late_stage_days': 25
            },
            
            # Vegetables
            {
                'name': 'Tomato',
                'crop_type': 'vegetable',
                'growth_duration': 135,
                'kc_initial': Decimal('0.600'),
                'kc_development': Decimal('1.150'),
                'kc_mid': Decimal('1.150'),
                'kc_late': Decimal('0.800'),
                'initial_stage_days': 30,
                'development_stage_days': 40,
                'mid_stage_days': 40,
                'late_stage_days': 25
            },
            {
                'name': 'Onion',
                'crop_type': 'vegetable',
                'growth_duration': 210,
                'kc_initial': Decimal('0.700'),
                'kc_development': Decimal('1.050'),
                'kc_mid': Decimal('1.050'),
                'kc_late': Decimal('0.750'),
                'initial_stage_days': 15,
                'development_stage_days': 25,
                'mid_stage_days': 110,
                'late_stage_days': 60
            },
            
            # Cash Crops
            {
                'name': 'Cotton',
                'crop_type': 'cash_crop',
                'growth_duration': 180,
                'kc_initial': Decimal('0.350'),
                'kc_development': Decimal('0.800'),
                'kc_mid': Decimal('1.200'),
                'kc_late': Decimal('0.700'),
                'initial_stage_days': 30,
                'development_stage_days': 50,
                'mid_stage_days': 60,
                'late_stage_days': 40
            },
            {
                'name': 'Sugarcane',
                'crop_type': 'cash_crop',
                'growth_duration': 365,
                'kc_initial': Decimal('0.400'),
                'kc_development': Decimal('0.800'),
                'kc_mid': Decimal('1.250'),
                'kc_late': Decimal('0.750'),
                'initial_stage_days': 35,
                'development_stage_days': 60,
                'mid_stage_days': 180,
                'late_stage_days': 90
            }
        ]
        
        for crop_data in crops:
            Crop.objects.get_or_create(
                name=crop_data['name'],
                defaults=crop_data
            )
        
        self.stdout.write('Created crops')
    
    def create_resource_categories(self):
        """Create resource categories"""
        categories = [
            # Materials
            {'name': 'PVC Pipes', 'category_type': 'material', 'unit': 'meter', 'description': 'PVC pipes for irrigation'},
            {'name': 'HDPE Pipes', 'category_type': 'material', 'unit': 'meter', 'description': 'HDPE pipes for irrigation'},
            {'name': 'Drip Emitters', 'category_type': 'material', 'unit': 'piece', 'description': 'Drip irrigation emitters'},
            {'name': 'Sprinklers', 'category_type': 'material', 'unit': 'piece', 'description': 'Sprinkler heads'},
            {'name': 'Valves', 'category_type': 'material', 'unit': 'piece', 'description': 'Control valves'},
            {'name': 'Fittings', 'category_type': 'material', 'unit': 'piece', 'description': 'Pipe fittings and connectors'},
            {'name': 'Filters', 'category_type': 'material', 'unit': 'piece', 'description': 'Water filtration systems'},
            {'name': 'Concrete', 'category_type': 'material', 'unit': 'cubic_meter', 'description': 'Concrete for structures'},
            {'name': 'Steel Reinforcement', 'category_type': 'material', 'unit': 'kilogram', 'description': 'Steel bars for reinforcement'},
            
            # Equipment
            {'name': 'Excavator', 'category_type': 'equipment', 'unit': 'hour', 'description': 'Excavator rental'},
            {'name': 'Trenching Machine', 'category_type': 'equipment', 'unit': 'hour', 'description': 'Trenching machine rental'},
            {'name': 'Water Pump', 'category_type': 'equipment', 'unit': 'piece', 'description': 'Water pumps'},
            {'name': 'Generator', 'category_type': 'equipment', 'unit': 'hour', 'description': 'Generator rental'},
            {'name': 'Compactor', 'category_type': 'equipment', 'unit': 'hour', 'description': 'Soil compactor rental'},
            {'name': 'Transport Vehicle', 'category_type': 'equipment', 'unit': 'day', 'description': 'Vehicle for material transport'},
            
            # Labor
            {'name': 'Skilled Technician', 'category_type': 'labor', 'unit': 'day', 'description': 'Skilled irrigation technician'},
            {'name': 'Semi-skilled Worker', 'category_type': 'labor', 'unit': 'day', 'description': 'Semi-skilled construction worker'},
            {'name': 'Unskilled Labor', 'category_type': 'labor', 'unit': 'day', 'description': 'General unskilled labor'},
            {'name': 'Engineer/Supervisor', 'category_type': 'labor', 'unit': 'day', 'description': 'Project engineer or supervisor'},
            {'name': 'Equipment Operator', 'category_type': 'labor', 'unit': 'day', 'description': 'Heavy equipment operator'},
        ]
        
        for category_data in categories:
            ResourceCategory.objects.get_or_create(
                name=category_data['name'],
                category_type=category_data['category_type'],
                defaults=category_data
            )
        
        self.stdout.write('Created resource categories')