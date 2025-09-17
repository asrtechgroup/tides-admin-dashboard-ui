# Django Admin Configuration for TIDES Project & Scheme

from django.contrib import admin
from .models import (
    Project, IrrigationTechnology, ProjectTechnology, Crop,
    ProjectCropCalendar, WaterRequirement, HydraulicDesign,
    ResourceCategory, ProjectResource, BOQAnalysis, BOQReport
)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'scheme_name', 'zone', 'region', 'district', 'status', 'created_by', 'created_at']
    list_filter = ['status', 'zone', 'region', 'created_at']
    search_fields = ['name', 'scheme_name', 'zone', 'region', 'district']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'scheme_name')
        }),
        ('Location', {
            'fields': ('zone', 'region', 'district')
        }),
        ('Area Information', {
            'fields': ('total_area', 'potential_area')
        }),
        ('GIS Files', {
            'fields': ('shapefile', 'kmz_file')
        }),
        ('Status & Metadata', {
            'fields': ('status', 'created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(IrrigationTechnology)
class IrrigationTechnologyAdmin(admin.ModelAdmin):
    list_display = ['technology_name', 'irrigation_type', 'efficiency', 'maintenance_level', 'cost_per_hectare']
    list_filter = ['technology_name', 'maintenance_level']
    search_fields = ['irrigation_type', 'description']
    
    fieldsets = (
        ('Technology Details', {
            'fields': ('technology_name', 'irrigation_type', 'description')
        }),
        ('Performance', {
            'fields': ('efficiency', 'maintenance_level')
        }),
        ('Costing', {
            'fields': ('cost_per_hectare',)
        })
    )

@admin.register(ProjectTechnology)
class ProjectTechnologyAdmin(admin.ModelAdmin):
    list_display = ['project', 'technology', 'selected_at']
    list_filter = ['technology__technology_name', 'selected_at']
    search_fields = ['project__name', 'technology__irrigation_type']

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ['name', 'crop_type', 'growth_duration', 'kc_initial', 'kc_mid']
    list_filter = ['crop_type']
    search_fields = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'crop_type', 'growth_duration')
        }),
        ('Crop Coefficients', {
            'fields': ('kc_initial', 'kc_development', 'kc_mid', 'kc_late')
        }),
        ('Growth Stages (Days)', {
            'fields': ('initial_stage_days', 'development_stage_days', 'mid_stage_days', 'late_stage_days')
        })
    )

@admin.register(ProjectCropCalendar)
class ProjectCropCalendarAdmin(admin.ModelAdmin):
    list_display = ['project', 'crop', 'planting_date', 'area_hectares']
    list_filter = ['crop', 'planting_date']
    search_fields = ['project__name', 'crop__name']

@admin.register(WaterRequirement)
class WaterRequirementAdmin(admin.ModelAdmin):
    list_display = ['project', 'net_water_requirement', 'gross_water_requirement', 'peak_demand', 'calculated_at']
    search_fields = ['project__name']
    readonly_fields = ['calculated_at']

@admin.register(HydraulicDesign)
class HydraulicDesignAdmin(admin.ModelAdmin):
    list_display = ['project', 'main_pipe_diameter', 'pump_capacity', 'pump_head', 'designed_by', 'designed_at']
    search_fields = ['project__name']
    readonly_fields = ['designed_at']
    
    fieldsets = (
        ('Canal Design', {
            'fields': ('main_canal_width', 'main_canal_depth', 'secondary_canal_width', 'secondary_canal_depth')
        }),
        ('Pipe Design', {
            'fields': ('main_pipe_diameter', 'distribution_pipe_diameter')
        }),
        ('Pump Design', {
            'fields': ('pump_head', 'pump_efficiency', 'pump_capacity')
        }),
        ('System Parameters', {
            'fields': ('operating_pressure', 'flow_velocity')
        }),
        ('Design Metadata', {
            'fields': ('designed_by', 'designed_at', 'design_parameters'),
            'classes': ('collapse',)
        })
    )

@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_type', 'unit']
    list_filter = ['category_type']
    search_fields = ['name']

@admin.register(ProjectResource)
class ProjectResourceAdmin(admin.ModelAdmin):
    list_display = ['project', 'resource_category', 'quantity', 'unit_cost', 'total_cost', 'added_by']
    list_filter = ['resource_category__category_type', 'region']
    search_fields = ['project__name', 'resource_category__name', 'supplier']
    readonly_fields = ['total_cost']

@admin.register(BOQAnalysis)
class BOQAnalysisAdmin(admin.ModelAdmin):
    list_display = ['project', 'total_cost', 'cost_per_hectare', 'generated_by', 'generated_at']
    search_fields = ['project__name']
    readonly_fields = ['subtotal', 'overhead_cost', 'contingency_cost', 'total_cost', 'cost_per_hectare', 'generated_at']
    
    fieldsets = (
        ('Cost Breakdown', {
            'fields': ('material_cost', 'equipment_cost', 'labor_cost', 'subtotal')
        }),
        ('Additional Costs', {
            'fields': ('overhead_percentage', 'overhead_cost', 'contingency_percentage', 'contingency_cost')
        }),
        ('Totals', {
            'fields': ('total_cost', 'cost_per_hectare')
        }),
        ('Metadata', {
            'fields': ('generated_by', 'generated_at', 'analysis_parameters'),
            'classes': ('collapse',)
        })
    )

@admin.register(BOQReport)
class BOQReportAdmin(admin.ModelAdmin):
    list_display = ['boq_analysis', 'format', 'generated_by', 'generated_at', 'file_size']
    list_filter = ['format', 'generated_at']
    search_fields = ['boq_analysis__project__name']
    readonly_fields = ['generated_at', 'file_size']