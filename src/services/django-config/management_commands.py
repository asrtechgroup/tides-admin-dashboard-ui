# Django Management Commands for Data Import/Export
# Place these in your Django app's management/commands/ directory

# irrigation_system/management/commands/import_materials.py
from django.core.management.base import BaseCommand
from django.db import transaction
import json
import csv
from materials.models import Material, MaterialCategory

class Command(BaseCommand):
    """
    Import materials from CSV/JSON file
    Usage: python manage.py import_materials --file materials.csv --format csv
    """
    help = 'Import materials data from CSV or JSON file'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, required=True, help='File path to import from')
        parser.add_argument('--format', choices=['csv', 'json'], default='csv', help='File format')

    def handle(self, *args, **options):
        file_path = options['file']
        file_format = options['format']
        
        try:
            if file_format == 'csv':
                self.import_from_csv(file_path)
            else:
                self.import_from_json(file_path)
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully imported materials from {file_path}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error importing materials: {str(e)}')
            )

    @transaction.atomic
    def import_from_csv(self, file_path):
        """
        Import materials from CSV file
        Expected CSV columns: name, category, unit, current_price, specifications, supplier
        """
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                category, created = MaterialCategory.objects.get_or_create(
                    name=row['category']
                )
                
                Material.objects.update_or_create(
                    name=row['name'],
                    defaults={
                        'category': category,
                        'unit': row['unit'],
                        'current_price': float(row['current_price']),
                        'specifications': row.get('specifications', ''),
                        'supplier': row.get('supplier', ''),
                    }
                )

    @transaction.atomic
    def import_from_json(self, file_path):
        """Import materials from JSON file"""
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            
            for item in data:
                category, created = MaterialCategory.objects.get_or_create(
                    name=item['category']
                )
                
                Material.objects.update_or_create(
                    name=item['name'],
                    defaults={
                        'category': category,
                        'unit': item['unit'],
                        'current_price': float(item['current_price']),
                        'specifications': item.get('specifications', ''),
                        'supplier': item.get('supplier', ''),
                        'region_specific_price': item.get('region_specific_price', {}),
                    }
                )

# irrigation_system/management/commands/export_boq.py
from django.core.management.base import BaseCommand
from django.http import HttpResponse
from django.template.loader import get_template
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from boq.models import BOQAnalysis
import json

class Command(BaseCommand):
    """
    Export BOQ analysis to PDF
    Usage: python manage.py export_boq --analysis_id 123 --output /path/to/output.pdf
    """
    help = 'Export BOQ analysis to PDF file'

    def add_arguments(self, parser):
        parser.add_argument('--analysis_id', type=int, required=True, help='BOQ Analysis ID')
        parser.add_argument('--output', type=str, required=True, help='Output file path')

    def handle(self, *args, **options):
        analysis_id = options['analysis_id']
        output_path = options['output']
        
        try:
            analysis = BOQAnalysis.objects.get(id=analysis_id)
            self.generate_pdf(analysis, output_path)
            
            self.stdout.write(
                self.style.SUCCESS(f'BOQ exported to {output_path}')
            )
        except BOQAnalysis.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'BOQ Analysis with ID {analysis_id} not found')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error exporting BOQ: {str(e)}')
            )

    def generate_pdf(self, analysis, output_path):
        """Generate PDF from BOQ analysis data"""
        c = canvas.Canvas(output_path, pagesize=letter)
        width, height = letter
        
        # Title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, f"BOQ Analysis Report")
        
        # Project details
        c.setFont("Helvetica", 12)
        y_position = height - 100
        c.drawString(50, y_position, f"Project: {analysis.existing_project.name}")
        y_position -= 20
        c.drawString(50, y_position, f"Location: {analysis.existing_project.location}")
        y_position -= 20
        c.drawString(50, y_position, f"Analysis Date: {analysis.analysis_date.strftime('%Y-%m-%d')}")
        y_position -= 20
        c.drawString(50, y_position, f"Total Cost: TSh {analysis.total_cost:,.2f}")
        y_position -= 20
        c.drawString(50, y_position, f"Cost per Hectare: TSh {analysis.cost_per_hectare:,.2f}")
        
        # BOQ Items
        y_position -= 40
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_position, "BOQ Items:")
        
        y_position -= 30
        c.setFont("Helvetica", 10)
        
        for item in analysis.boq_data:
            if y_position < 100:  # Start new page if needed
                c.showPage()
                y_position = height - 50
            
            c.drawString(50, y_position, f"• {item.get('description', 'N/A')}")
            y_position -= 15
            c.drawString(70, y_position, f"Quantity: {item.get('quantity', 0)} {item.get('unit', '')}")
            y_position -= 15
            c.drawString(70, y_position, f"Rate: TSh {item.get('rate', 0):,.2f}")
            y_position -= 15
            c.drawString(70, y_position, f"Amount: TSh {item.get('amount', 0):,.2f}")
            y_position -= 25
        
        c.save()

# irrigation_system/management/commands/setup_initial_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from materials.models import MaterialCategory, Technology
from boq.models import BOQTemplate

User = get_user_model()

class Command(BaseCommand):
    """
    Setup initial data for the irrigation system
    Usage: python manage.py setup_initial_data
    """
    help = 'Setup initial data including admin user, categories, and templates'

    def handle(self, *args, **options):
        self.stdout.write('Setting up initial data...')
        
        # Create admin user
        self.create_admin_user()
        
        # Create material categories
        self.create_material_categories()
        
        # Create irrigation technologies
        self.create_technologies()
        
        # Create BOQ templates
        self.create_boq_templates()
        
        self.stdout.write(
            self.style.SUCCESS('Initial data setup completed successfully!')
        )

    def create_admin_user(self):
        """Create initial admin user"""
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@irrigation.system',
                password='admin123',
                role='Admin',
                first_name='System',
                last_name='Administrator'
            )
            self.stdout.write('Created admin user (username: admin, password: admin123)')

    def create_material_categories(self):
        """Create initial material categories"""
        categories = [
            'Pipes and Fittings',
            'Pumps and Motors',
            'Valves and Controls',
            'Filtration Systems',
            'Emitters and Sprinklers',
            'Concrete and Masonry',
            'Steel and Metal Work',
            'Electrical Components',
            'Tools and Equipment',
            'Chemicals and Fertilizers'
        ]
        
        for category_name in categories:
            MaterialCategory.objects.get_or_create(name=category_name)
        
        self.stdout.write(f'Created {len(categories)} material categories')

    def create_technologies(self):
        """Create initial irrigation technologies"""
        technologies = [
            {
                'name': 'Drip Irrigation System',
                'technology_type': 'pressurized',
                'efficiency': 85.0,
                'cost_per_unit': 50000.00,
                'installation_cost': 100000.00,
                'maintenance_cost': 5000.00,
                'specifications': {
                    'pressure_requirement': '1-2 bar',
                    'flow_rate': '2-4 L/hr per emitter',
                    'suitable_crops': ['vegetables', 'fruits', 'flowers']
                }
            },
            {
                'name': 'Sprinkler Irrigation System',
                'technology_type': 'pressurized',
                'efficiency': 75.0,
                'cost_per_unit': 30000.00,
                'installation_cost': 80000.00,
                'maintenance_cost': 7000.00,
                'specifications': {
                    'pressure_requirement': '2-3 bar',
                    'coverage_area': '10-15 meters radius',
                    'suitable_crops': ['cereals', 'legumes', 'fodder']
                }
            },
            {
                'name': 'Surface Irrigation System',
                'technology_type': 'surface',
                'efficiency': 60.0,
                'cost_per_unit': 10000.00,
                'installation_cost': 30000.00,
                'maintenance_cost': 2000.00,
                'specifications': {
                    'slope_requirement': '0.5-2%',
                    'suitable_crops': ['rice', 'maize', 'sugarcane']
                }
            }
        ]
        
        for tech_data in technologies:
            Technology.objects.get_or_create(
                name=tech_data['name'],
                defaults=tech_data
            )
        
        self.stdout.write(f'Created {len(technologies)} irrigation technologies')

    def create_boq_templates(self):
        """Create BOQ templates"""
        admin_user = User.objects.filter(role='Admin').first()
        if not admin_user:
            return
        
        templates = [
            {
                'name': 'Standard Drip Irrigation BOQ',
                'irrigation_type': 'drip',
                'template_data': {
                    'items': [
                        {'description': 'Main pipeline', 'unit': 'meter', 'rate': 500},
                        {'description': 'Lateral pipes', 'unit': 'meter', 'rate': 200},
                        {'description': 'Drip emitters', 'unit': 'nos', 'rate': 50},
                        {'description': 'Control valves', 'unit': 'nos', 'rate': 5000},
                        {'description': 'Filtration system', 'unit': 'set', 'rate': 25000}
                    ]
                },
                'created_by': admin_user
            },
            {
                'name': 'Basic Sprinkler System BOQ',
                'irrigation_type': 'sprinkler',
                'template_data': {
                    'items': [
                        {'description': 'Main pipeline', 'unit': 'meter', 'rate': 400},
                        {'description': 'Sprinkler heads', 'unit': 'nos', 'rate': 2000},
                        {'description': 'Riser pipes', 'unit': 'meter', 'rate': 300},
                        {'description': 'Control system', 'unit': 'set', 'rate': 30000}
                    ]
                },
                'created_by': admin_user
            }
        ]
        
        for template_data in templates:
            BOQTemplate.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
        
        self.stdout.write(f'Created {len(templates)} BOQ templates')