# Django Models for TIDES Project & Scheme System

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from decimal import Decimal

class Project(models.Model):
    """Main project model for Project & Scheme workflow"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('in_progress', 'In Progress'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    zone = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    scheme_name = models.CharField(max_length=200)
    total_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total area in hectares")
    potential_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Potential irrigable area in hectares")
    
    # GIS Files
    shapefile = models.FileField(upload_to='gis_files/shapefiles/', null=True, blank=True)
    kmz_file = models.FileField(upload_to='gis_files/kmz/', null=True, blank=True)
    
    # Project status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.scheme_name}"

class IrrigationTechnology(models.Model):
    """Irrigation technology master data"""
    TECHNOLOGY_TYPES = [
        ('surface', 'Surface Irrigation'),
        ('subsurface', 'Subsurface Irrigation'),
        ('pressurized', 'Pressurized Irrigation'),
    ]
    
    MAINTENANCE_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    technology_name = models.CharField(max_length=20, choices=TECHNOLOGY_TYPES)
    irrigation_type = models.CharField(max_length=100)
    efficiency = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)])
    maintenance_level = models.CharField(max_length=20, choices=MAINTENANCE_LEVELS)
    description = models.TextField(blank=True)
    cost_per_hectare = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['technology_name', 'irrigation_type']
    
    def __str__(self):
        return f"{self.get_technology_name_display()} - {self.irrigation_type}"

class ProjectTechnology(models.Model):
    """Selected technology for a project"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='technology_selection')
    technology = models.ForeignKey(IrrigationTechnology, on_delete=models.CASCADE)
    selected_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.project.name} - {self.technology}"

class Crop(models.Model):
    """Crop master data"""
    CROP_TYPES = [
        ('cereal', 'Cereal'),
        ('legume', 'Legume'),
        ('vegetable', 'Vegetable'),
        ('fruit', 'Fruit'),
        ('cash_crop', 'Cash Crop'),
        ('fodder', 'Fodder'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    crop_type = models.CharField(max_length=20, choices=CROP_TYPES)
    growth_duration = models.IntegerField(help_text="Total growth duration in days")
    kc_initial = models.DecimalField(max_digits=4, decimal_places=3, help_text="Crop coefficient - Initial stage")
    kc_development = models.DecimalField(max_digits=4, decimal_places=3, help_text="Crop coefficient - Development stage")
    kc_mid = models.DecimalField(max_digits=4, decimal_places=3, help_text="Crop coefficient - Mid stage")
    kc_late = models.DecimalField(max_digits=4, decimal_places=3, help_text="Crop coefficient - Late stage")
    
    # Growth stage durations (days)
    initial_stage_days = models.IntegerField()
    development_stage_days = models.IntegerField()
    mid_stage_days = models.IntegerField()
    late_stage_days = models.IntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class ProjectCropCalendar(models.Model):
    """Crop calendar for a project"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='crop_calendar')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    
    # Planting details
    planting_date = models.DateField()
    area_hectares = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Custom growth stage durations (can override crop defaults)
    initial_stage_days = models.IntegerField(null=True, blank=True)
    development_stage_days = models.IntegerField(null=True, blank=True)
    mid_stage_days = models.IntegerField(null=True, blank=True)
    late_stage_days = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['project', 'crop', 'planting_date']
    
    def __str__(self):
        return f"{self.project.name} - {self.crop.name} ({self.planting_date})"

class WaterRequirement(models.Model):
    """Calculated water requirements for project"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='water_requirement')
    
    # Calculated values
    net_water_requirement = models.DecimalField(max_digits=12, decimal_places=2, help_text="Net water requirement in cubic meters")
    gross_water_requirement = models.DecimalField(max_digits=12, decimal_places=2, help_text="Gross water requirement in cubic meters")
    peak_demand = models.DecimalField(max_digits=12, decimal_places=2, help_text="Peak daily demand in cubic meters")
    irrigation_efficiency = models.DecimalField(max_digits=5, decimal_places=2, default=75.0)
    
    # Calculation metadata
    calculated_at = models.DateTimeField(auto_now=True)
    calculation_parameters = models.JSONField(default=dict, help_text="Parameters used in calculation")
    
    def __str__(self):
        return f"Water Requirement - {self.project.name}"

class HydraulicDesign(models.Model):
    """Hydraulic design parameters for project"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='hydraulic_design')
    
    # Canal design
    main_canal_width = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="Width in meters")
    main_canal_depth = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="Depth in meters")
    secondary_canal_width = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    secondary_canal_depth = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Pipe design
    main_pipe_diameter = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="Diameter in mm")
    distribution_pipe_diameter = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Pump design
    pump_head = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="Total head in meters")
    pump_efficiency = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Efficiency percentage")
    pump_capacity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Capacity in liters per second")
    
    # System parameters
    operating_pressure = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="Operating pressure in bar")
    flow_velocity = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Flow velocity in m/s")
    
    # Design metadata
    designed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    designed_at = models.DateTimeField(auto_now=True)
    design_parameters = models.JSONField(default=dict)
    
    def __str__(self):
        return f"Hydraulic Design - {self.project.name}"

class ResourceCategory(models.Model):
    """Resource categories (Materials, Equipment, Labor)"""
    CATEGORY_TYPES = [
        ('material', 'Material'),
        ('equipment', 'Equipment'),
        ('labor', 'Labor'),
    ]
    
    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES)
    unit = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Resource Categories"
        unique_together = ['name', 'category_type']
    
    def __str__(self):
        return f"{self.get_category_type_display()} - {self.name}"

class ProjectResource(models.Model):
    """Resources required for a project"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='resources')
    resource_category = models.ForeignKey(ResourceCategory, on_delete=models.CASCADE)
    
    # Quantity and cost
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)
    total_cost = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Additional details
    specification = models.TextField(blank=True)
    supplier = models.CharField(max_length=200, blank=True)
    region = models.CharField(max_length=100, blank=True)
    
    # Metadata
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        self.total_cost = self.quantity * self.unit_cost
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.project.name} - {self.resource_category.name}"

class BOQAnalysis(models.Model):
    """Bill of Quantities analysis for project"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='boq_analysis')
    
    # Cost breakdown
    material_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    equipment_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    labor_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Additional costs
    overhead_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=10.0)
    overhead_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    contingency_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    contingency_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Totals
    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    cost_per_hectare = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Analysis metadata
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    generated_at = models.DateTimeField(auto_now=True)
    analysis_parameters = models.JSONField(default=dict)
    
    def calculate_totals(self):
        """Calculate all totals and costs"""
        self.subtotal = self.material_cost + self.equipment_cost + self.labor_cost
        self.overhead_cost = (self.subtotal * self.overhead_percentage) / 100
        self.contingency_cost = (self.subtotal * self.contingency_percentage) / 100
        self.total_cost = self.subtotal + self.overhead_cost + self.contingency_cost
        
        if self.project.potential_area > 0:
            self.cost_per_hectare = self.total_cost / self.project.potential_area
    
    def save(self, *args, **kwargs):
        self.calculate_totals()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"BOQ Analysis - {self.project.name}"

class BOQReport(models.Model):
    """Generated BOQ reports"""
    REPORT_FORMATS = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    boq_analysis = models.ForeignKey(BOQAnalysis, on_delete=models.CASCADE, related_name='reports')
    format = models.CharField(max_length=10, choices=REPORT_FORMATS)
    file = models.FileField(upload_to='boq_reports/')
    
    # Report metadata
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"BOQ Report - {self.boq_analysis.project.name} ({self.format.upper()})"