# Django Views for TIDES Project & Scheme API

from django.shortcuts import get_object_or_404
from django.db import transaction
from django.http import Http404, HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from decimal import Decimal
import json

from .models import (
    Project, IrrigationTechnology, ProjectTechnology, Crop, 
    ProjectCropCalendar, WaterRequirement, HydraulicDesign,
    ResourceCategory, ProjectResource, BOQAnalysis, BOQReport
)
from .serializers import (
    ProjectSerializer, ProjectListSerializer, IrrigationTechnologySerializer,
    CropSerializer, TechnologySelectionSerializer, CropCalendarSerializer,
    HydraulicDesignSerializer, ResourceCategorySerializer, ProjectResourceSerializer,
    BOQAnalysisSerializer, WaterRequirementResponseSerializer, 
    ResourcesUpdateSerializer, BOQGenerationSerializer
)

class ProjectViewSet(viewsets.ModelViewSet):
    """Main Project ViewSet handling all 6 workflow steps"""
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='technology')
    def technology_selection(self, request, pk=None):
        """Step 2: Technology Selection"""
        project = self.get_object()
        serializer = TechnologySelectionSerializer(data=request.data)
        
        if serializer.is_valid():
            technology_id = serializer.validated_data['technology_id']
            notes = serializer.validated_data.get('notes', '')
            
            try:
                technology = IrrigationTechnology.objects.get(id=technology_id)
                
                # Create or update technology selection
                project_tech, created = ProjectTechnology.objects.update_or_create(
                    project=project,
                    defaults={
                        'technology': technology,
                        'notes': notes
                    }
                )
                
                return Response({
                    'message': 'Technology selection saved successfully',
                    'technology_name': technology.technology_name,
                    'irrigation_type': technology.irrigation_type,
                    'efficiency': technology.efficiency
                }, status=status.HTTP_200_OK)
                
            except IrrigationTechnology.DoesNotExist:
                return Response({
                    'error': 'Technology not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='cwr')
    def crop_water_requirement(self, request, pk=None):
        """Step 3: Crop Calendar & Water Requirement"""
        project = self.get_object()
        serializer = CropCalendarSerializer(data=request.data)
        
        if serializer.is_valid():
            crops_data = serializer.validated_data['crops']
            
            with transaction.atomic():
                # Clear existing crop calendar
                ProjectCropCalendar.objects.filter(project=project).delete()
                
                # Create new crop calendar entries
                for crop_entry in crops_data:
                    try:
                        crop = Crop.objects.get(id=crop_entry['crop_id'])
                        
                        ProjectCropCalendar.objects.create(
                            project=project,
                            crop=crop,
                            planting_date=crop_entry['planting_date'],
                            area_hectares=crop_entry['area_hectares'],
                            initial_stage_days=crop_entry.get('initial_stage_days', crop.initial_stage_days),
                            development_stage_days=crop_entry.get('development_stage_days', crop.development_stage_days),
                            mid_stage_days=crop_entry.get('mid_stage_days', crop.mid_stage_days),
                            late_stage_days=crop_entry.get('late_stage_days', crop.late_stage_days)
                        )
                    except Crop.DoesNotExist:
                        return Response({
                            'error': f'Crop with ID {crop_entry["crop_id"]} not found'
                        }, status=status.HTTP_404_NOT_FOUND)
                
                # Calculate water requirements
                water_requirement_data = self._calculate_water_requirements(project)
                
                return Response(water_requirement_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _calculate_water_requirements(self, project):
        """Calculate water requirements for project crops"""
        crop_calendar = ProjectCropCalendar.objects.filter(project=project)
        
        if not crop_calendar.exists():
            return {'error': 'No crops defined for project'}
        
        # Get technology efficiency
        try:
            technology = project.technology_selection.technology
            irrigation_efficiency = technology.efficiency / 100
        except:
            irrigation_efficiency = 0.75  # Default 75%
        
        # Simple calculation (you can implement more sophisticated algorithms)
        total_net_requirement = Decimal('0')
        demand_curve = []
        
        # Calculate for each crop
        for crop_entry in crop_calendar:
            crop = crop_entry.crop
            area = crop_entry.area_hectares
            
            # Simplified water requirement calculation
            # Daily ET0 assumption: 5mm/day (you should get this from weather data)
            daily_et0 = Decimal('5.0')  # mm/day
            
            # Calculate for different growth stages
            stages = [
                (crop.kc_initial, crop_entry.initial_stage_days),
                (crop.kc_development, crop_entry.development_stage_days),
                (crop.kc_mid, crop_entry.mid_stage_days),
                (crop.kc_late, crop_entry.late_stage_days)
            ]
            
            crop_water_requirement = Decimal('0')
            current_date = crop_entry.planting_date
            
            for kc, days in stages:
                stage_requirement = daily_et0 * kc * days * area * 10  # Convert to cubic meters
                crop_water_requirement += stage_requirement
                
                # Add to demand curve
                for day in range(days):
                    daily_demand = daily_et0 * kc * area * 10  # m3/day
                    demand_curve.append({
                        'date': current_date,
                        'daily_demand': daily_demand,
                        'crop_breakdown': {crop.name: daily_demand}
                    })
                    current_date += timedelta(days=1)
            
            total_net_requirement += crop_water_requirement
        
        # Calculate gross requirement
        gross_requirement = total_net_requirement / Decimal(str(irrigation_efficiency))
        
        # Calculate peak demand
        peak_demand = max([d['daily_demand'] for d in demand_curve]) if demand_curve else Decimal('0')
        
        # Save water requirement
        water_req, created = WaterRequirement.objects.update_or_create(
            project=project,
            defaults={
                'net_water_requirement': total_net_requirement,
                'gross_water_requirement': gross_requirement,
                'peak_demand': peak_demand,
                'irrigation_efficiency': Decimal(str(irrigation_efficiency * 100)),
                'calculation_parameters': {
                    'et0_assumption': float(daily_et0),
                    'calculation_date': datetime.now().isoformat()
                }
            }
        )
        
        return {
            'net_water_requirement': total_net_requirement,
            'gross_water_requirement': gross_requirement,
            'peak_demand': peak_demand,
            'irrigation_efficiency': Decimal(str(irrigation_efficiency * 100)),
            'demand_curve': demand_curve[:30]  # Return first 30 days for chart
        }
    
    @action(detail=True, methods=['get', 'post'], url_path='hydraulic-design')
    def hydraulic_design(self, request, pk=None):
        """Step 4: Hydraulic Design Section"""
        project = self.get_object()
        
        if request.method == 'GET':
            try:
                hydraulic_design = project.hydraulic_design
                serializer = HydraulicDesignSerializer(hydraulic_design)
                return Response(serializer.data)
            except HydraulicDesign.DoesNotExist:
                # Generate default hydraulic design based on water requirements
                default_design = self._generate_hydraulic_design(project)
                return Response(default_design)
        
        elif request.method == 'POST':
            # Update hydraulic design
            hydraulic_design, created = HydraulicDesign.objects.get_or_create(project=project)
            serializer = HydraulicDesignSerializer(hydraulic_design, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save(designed_by=request.user)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _generate_hydraulic_design(self, project):
        """Generate default hydraulic design parameters"""
        try:
            water_req = project.water_requirement
            peak_demand = water_req.peak_demand
            
            # Simple hydraulic calculations (implement proper hydraulic formulas)
            # These are placeholder calculations
            
            # Pipe sizing (based on flow rate)
            flow_rate_lps = float(peak_demand) / 86400  # Convert m3/day to L/s
            
            # Main pipe diameter (assuming 1.5 m/s velocity)
            velocity = 1.5  # m/s
            area = flow_rate_lps / (velocity * 1000)  # m2
            diameter = (4 * area / 3.14159) ** 0.5 * 1000  # Convert to mm
            
            # Pump sizing
            head = 30  # Assumed 30m head
            efficiency = 75  # 75% efficiency
            
            return {
                'main_pipe_diameter': round(diameter, 0),
                'distribution_pipe_diameter': round(diameter * 0.7, 0),
                'pump_head': head,
                'pump_efficiency': efficiency,
                'pump_capacity': flow_rate_lps,
                'operating_pressure': 2.5,
                'flow_velocity': velocity,
                'design_parameters': {
                    'peak_demand_m3_day': float(peak_demand),
                    'calculated_at': datetime.now().isoformat()
                }
            }
        except:
            return {
                'error': 'Cannot generate hydraulic design without water requirement calculation'
            }
    
    @action(detail=True, methods=['get', 'post'], url_path='resources')
    def resources_management(self, request, pk=None):
        """Step 5: Resources Section"""
        project = self.get_object()
        
        if request.method == 'GET':
            resources = ProjectResource.objects.filter(project=project)
            serializer = ProjectResourceSerializer(resources, many=True)
            
            # Group by category type
            grouped_resources = {
                'materials': [],
                'equipment': [],
                'labor': []
            }
            
            for resource in serializer.data:
                category_type = resource['resource_category_details']['category_type']
                grouped_resources[category_type + 's'].append(resource)
            
            return Response(grouped_resources)
        
        elif request.method == 'POST':
            serializer = ResourcesUpdateSerializer(data=request.data)
            
            if serializer.is_valid():
                resources_data = serializer.validated_data['resources']
                
                with transaction.atomic():
                    # Clear existing resources
                    ProjectResource.objects.filter(project=project).delete()
                    
                    # Create new resources
                    for resource_data in resources_data:
                        try:
                            category = ResourceCategory.objects.get(id=resource_data['resource_category_id'])
                            
                            ProjectResource.objects.create(
                                project=project,
                                resource_category=category,
                                quantity=resource_data['quantity'],
                                unit_cost=resource_data['unit_cost'],
                                specification=resource_data.get('specification', ''),
                                supplier=resource_data.get('supplier', ''),
                                region=resource_data.get('region', ''),
                                added_by=request.user
                            )
                        except ResourceCategory.DoesNotExist:
                            return Response({
                                'error': f'Resource category with ID {resource_data["resource_category_id"]} not found'
                            }, status=status.HTTP_404_NOT_FOUND)
                
                return Response({'message': 'Resources updated successfully'})
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='boq')
    def boq_generation(self, request, pk=None):
        """Step 6: BOQ & Costing"""
        project = self.get_object()
        serializer = BOQGenerationSerializer(data=request.data)
        
        if serializer.is_valid():
            overhead_percentage = serializer.validated_data['overhead_percentage']
            contingency_percentage = serializer.validated_data['contingency_percentage']
            generate_pdf = serializer.validated_data['generate_pdf']
            generate_excel = serializer.validated_data['generate_excel']
            
            # Calculate BOQ
            boq_data = self._generate_boq(project, overhead_percentage, contingency_percentage)
            
            # Generate reports if requested
            reports = []
            if generate_pdf:
                pdf_report = self._generate_pdf_report(boq_data)
                reports.append(pdf_report)
            
            if generate_excel:
                excel_report = self._generate_excel_report(boq_data)
                reports.append(excel_report)
            
            return Response({
                'boq_analysis': boq_data,
                'reports': reports
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _generate_boq(self, project, overhead_percentage, contingency_percentage):
        """Generate BOQ analysis for project"""
        resources = ProjectResource.objects.filter(project=project)
        
        # Calculate costs by category
        material_cost = sum(
            r.total_cost for r in resources 
            if r.resource_category.category_type == 'material'
        )
        equipment_cost = sum(
            r.total_cost for r in resources 
            if r.resource_category.category_type == 'equipment'
        )
        labor_cost = sum(
            r.total_cost for r in resources 
            if r.resource_category.category_type == 'labor'
        )
        
        # Create or update BOQ analysis
        boq_analysis, created = BOQAnalysis.objects.update_or_create(
            project=project,
            defaults={
                'material_cost': material_cost,
                'equipment_cost': equipment_cost,
                'labor_cost': labor_cost,
                'overhead_percentage': overhead_percentage,
                'contingency_percentage': contingency_percentage,
                'generated_by': self.request.user,
                'analysis_parameters': {
                    'resource_count': resources.count(),
                    'generated_at': datetime.now().isoformat()
                }
            }
        )
        
        serializer = BOQAnalysisSerializer(boq_analysis)
        return serializer.data
    
    def _generate_pdf_report(self, boq_data):
        """Generate PDF BOQ report (placeholder)"""
        # Implement PDF generation using reportlab or similar
        return {
            'format': 'pdf',
            'file_url': '/api/reports/boq/sample.pdf',
            'generated_at': datetime.now().isoformat()
        }
    
    def _generate_excel_report(self, boq_data):
        """Generate Excel BOQ report (placeholder)"""
        # Implement Excel generation using openpyxl or similar
        return {
            'format': 'excel',
            'file_url': '/api/reports/boq/sample.xlsx',
            'generated_at': datetime.now().isoformat()
        }

class IrrigationTechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    """Technology master data for selection"""
    queryset = IrrigationTechnology.objects.all()
    serializer_class = IrrigationTechnologySerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get technologies grouped by type"""
        technologies = {}
        for tech in self.queryset:
            tech_type = tech.technology_name
            if tech_type not in technologies:
                technologies[tech_type] = []
            technologies[tech_type].append(IrrigationTechnologySerializer(tech).data)
        
        return Response(technologies)

class CropViewSet(viewsets.ReadOnlyModelViewSet):
    """Crop master data for selection"""
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get crops grouped by type"""
        crops = {}
        for crop in self.queryset:
            crop_type = crop.crop_type
            if crop_type not in crops:
                crops[crop_type] = []
            crops[crop_type].append(CropSerializer(crop).data)
        
        return Response(crops)

class ResourceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Resource categories for resource management"""
    queryset = ResourceCategory.objects.all()
    serializer_class = ResourceCategorySerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get resource categories grouped by type"""
        categories = {}
        for category in self.queryset:
            cat_type = category.category_type
            if cat_type not in categories:
                categories[cat_type] = []
            categories[cat_type].append(ResourceCategorySerializer(category).data)
        
        return Response(categories)