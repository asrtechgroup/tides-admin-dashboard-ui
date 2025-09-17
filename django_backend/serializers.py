# Django Serializers for TIDES Project & Scheme API

from rest_framework import serializers
from .models import (
    Project, IrrigationTechnology, ProjectTechnology, Crop, 
    ProjectCropCalendar, WaterRequirement, HydraulicDesign,
    ResourceCategory, ProjectResource, BOQAnalysis, BOQReport
)

class IrrigationTechnologySerializer(serializers.ModelSerializer):
    technology_name_display = serializers.CharField(source='get_technology_name_display', read_only=True)
    maintenance_level_display = serializers.CharField(source='get_maintenance_level_display', read_only=True)
    
    class Meta:
        model = IrrigationTechnology
        fields = '__all__'

class ProjectTechnologySerializer(serializers.ModelSerializer):
    technology_details = IrrigationTechnologySerializer(source='technology', read_only=True)
    
    class Meta:
        model = ProjectTechnology
        fields = '__all__'

class CropSerializer(serializers.ModelSerializer):
    crop_type_display = serializers.CharField(source='get_crop_type_display', read_only=True)
    
    class Meta:
        model = Crop
        fields = '__all__'

class ProjectCropCalendarSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)
    
    class Meta:
        model = ProjectCropCalendar
        fields = '__all__'

class WaterRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterRequirement
        fields = '__all__'

class HydraulicDesignSerializer(serializers.ModelSerializer):
    designed_by_name = serializers.CharField(source='designed_by.get_full_name', read_only=True)
    
    class Meta:
        model = HydraulicDesign
        fields = '__all__'

class ResourceCategorySerializer(serializers.ModelSerializer):
    category_type_display = serializers.CharField(source='get_category_type_display', read_only=True)
    
    class Meta:
        model = ResourceCategory
        fields = '__all__'

class ProjectResourceSerializer(serializers.ModelSerializer):
    resource_category_details = ResourceCategorySerializer(source='resource_category', read_only=True)
    added_by_name = serializers.CharField(source='added_by.get_full_name', read_only=True)
    
    class Meta:
        model = ProjectResource
        fields = '__all__'
        read_only_fields = ('total_cost',)

class BOQAnalysisSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.CharField(source='generated_by.get_full_name', read_only=True)
    
    class Meta:
        model = BOQAnalysis
        fields = '__all__'
        read_only_fields = ('subtotal', 'overhead_cost', 'contingency_cost', 'total_cost', 'cost_per_hectare')

class BOQReportSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.CharField(source='generated_by.get_full_name', read_only=True)
    
    class Meta:
        model = BOQReport
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    """Main project serializer with related data"""
    technology_selection = ProjectTechnologySerializer(read_only=True)
    crop_calendar = ProjectCropCalendarSerializer(many=True, read_only=True)
    water_requirement = WaterRequirementSerializer(read_only=True)
    hydraulic_design = HydraulicDesignSerializer(read_only=True)
    resources = ProjectResourceSerializer(many=True, read_only=True)
    boq_analysis = BOQAnalysisSerializer(read_only=True)
    
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'

class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project listing"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'scheme_name', 'zone', 'region', 'district',
            'total_area', 'potential_area', 'status', 'status_display',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]

# Technology Selection Step
class TechnologySelectionSerializer(serializers.Serializer):
    technology_id = serializers.UUIDField()
    notes = serializers.CharField(max_length=500, required=False, allow_blank=True)

# Crop Calendar Step  
class CropCalendarEntrySerializer(serializers.Serializer):
    crop_id = serializers.UUIDField()
    planting_date = serializers.DateField()
    area_hectares = serializers.DecimalField(max_digits=10, decimal_places=2)
    initial_stage_days = serializers.IntegerField(required=False)
    development_stage_days = serializers.IntegerField(required=False)
    mid_stage_days = serializers.IntegerField(required=False)
    late_stage_days = serializers.IntegerField(required=False)

class CropCalendarSerializer(serializers.Serializer):
    crops = CropCalendarEntrySerializer(many=True)

# Water Requirement Calculation Response
class WaterDemandCurveSerializer(serializers.Serializer):
    date = serializers.DateField()
    daily_demand = serializers.DecimalField(max_digits=12, decimal_places=2)
    crop_breakdown = serializers.DictField()

class WaterRequirementResponseSerializer(serializers.Serializer):
    net_water_requirement = serializers.DecimalField(max_digits=12, decimal_places=2)
    gross_water_requirement = serializers.DecimalField(max_digits=12, decimal_places=2)
    peak_demand = serializers.DecimalField(max_digits=12, decimal_places=2)
    irrigation_efficiency = serializers.DecimalField(max_digits=5, decimal_places=2)
    demand_curve = WaterDemandCurveSerializer(many=True)

# Resource Management
class ResourceEntrySerializer(serializers.Serializer):
    resource_category_id = serializers.IntegerField()
    quantity = serializers.DecimalField(max_digits=12, decimal_places=2)
    unit_cost = serializers.DecimalField(max_digits=12, decimal_places=2)
    specification = serializers.CharField(max_length=500, required=False, allow_blank=True)
    supplier = serializers.CharField(max_length=200, required=False, allow_blank=True)
    region = serializers.CharField(max_length=100, required=False, allow_blank=True)

class ResourcesUpdateSerializer(serializers.Serializer):
    resources = ResourceEntrySerializer(many=True)

# BOQ Generation
class BOQGenerationSerializer(serializers.Serializer):
    overhead_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, default=10.0)
    contingency_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    generate_pdf = serializers.BooleanField(default=True)
    generate_excel = serializers.BooleanField(default=True)