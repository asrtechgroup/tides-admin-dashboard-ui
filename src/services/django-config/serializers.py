# Django REST Framework Serializers
# Create these serializers in respective app serializers.py files

from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.auth import get_user_model
from .models import *

User = get_user_model()

# Authentication Serializers
class UserSerializer(serializers.ModelSerializer):
    """
    User serializer for authentication and profile management
    API Endpoint: /api/auth/users/
    Used by: AuthContext.tsx
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'avatar', 'created_at']
        read_only_fields = ['id', 'created_at']

class LoginSerializer(serializers.Serializer):
    """
    Login serializer for user authentication
    API Endpoint: /api/auth/login/
    Used by: Login.tsx
    """
    username = serializers.CharField()
    password = serializers.CharField()

# Project Management Serializers
class ProjectSerializer(serializers.ModelSerializer):
    """
    Project serializer for project CRUD operations
    API Endpoint: /api/projects/
    Used by: Projects.tsx, ProjectWizard.tsx
    """
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    zones_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_zones_count(self, obj):
        return obj.zones.count()

class ProjectWizardSerializer(serializers.ModelSerializer):
    """
    Project wizard serializer for step-by-step project creation
    API Endpoint: /api/projects/{id}/wizard/
    Used by: ProjectWizard.tsx, various wizard step components
    """
    class Meta:
        model = ProjectWizard
        fields = '__all__'

# Materials & Cost Database Serializers
class MaterialCategorySerializer(serializers.ModelSerializer):
    """
    Material category serializer
    API Endpoint: /api/materials/categories/
    Used by: MaterialsTable.tsx, MaterialForm.tsx
    """
    materials_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MaterialCategory
        fields = '__all__'
    
    def get_materials_count(self, obj):
        return obj.material_set.count()

class MaterialSerializer(serializers.ModelSerializer):
    """
    Material serializer for materials database
    API Endpoint: /api/materials/
    Used by: MaterialsTable.tsx, MaterialForm.tsx, BOQBuilder.tsx
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Material
        fields = '__all__'

class TechnologySerializer(serializers.ModelSerializer):
    """
    Irrigation technology serializer
    API Endpoint: /api/materials/technologies/
    Used by: TechnologiesTable.tsx, TechnologyForm.tsx
    """
    class Meta:
        model = Technology
        fields = '__all__'

class EquipmentSerializer(serializers.ModelSerializer):
    """
    Equipment serializer
    API Endpoint: /api/resources/equipment/
    Used by: EquipmentTable.tsx, EquipmentForm.tsx
    """
    class Meta:
        model = Equipment
        fields = '__all__'

class LaborRateSerializer(serializers.ModelSerializer):
    """
    Labor rate serializer
    API Endpoint: /api/resources/labor/
    Used by: LaborTable.tsx, LaborForm.tsx
    """
    class Meta:
        model = LaborRate
        fields = '__all__'

# BOQ Builder Serializers
class ExistingProjectSerializer(serializers.ModelSerializer):
    """
    Existing project serializer for BOQ analysis
    API Endpoint: /api/boq/existing-projects/
    Used by: BOQBuilder.tsx
    """
    cost_per_hectare = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = ExistingProject
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.area > 0:
            data['cost_per_hectare'] = instance.actual_cost / instance.area
        return data

class BOQAnalysisSerializer(serializers.ModelSerializer):
    """
    BOQ analysis serializer
    API Endpoint: /api/boq/analyses/
    Used by: BOQBuilder.tsx
    """
    existing_project_name = serializers.CharField(source='existing_project.name', read_only=True)
    analyzed_by_name = serializers.CharField(source='analyzed_by.get_full_name', read_only=True)
    
    class Meta:
        model = BOQAnalysis
        fields = '__all__'
        read_only_fields = ['analyzed_by', 'analysis_date']

class BOQTemplateSerializer(serializers.ModelSerializer):
    """
    BOQ template serializer
    API Endpoint: /api/boq/templates/
    Used by: BOQBuilder.tsx
    """
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = BOQTemplate
        fields = '__all__'
        read_only_fields = ['created_by']

# GIS Planning Serializers
class ShapefileSerializer(serializers.ModelSerializer):
    """
    Shapefile serializer for GIS file uploads
    API Endpoint: /api/gis/shapefiles/
    Used by: GISPlanning.tsx
    """
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    
    class Meta:
        model = Shapefile
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'upload_date']

class ZoneSerializer(GeoFeatureModelSerializer):
    """
    Zone serializer with GIS geometry support
    API Endpoint: /api/gis/zones/
    Used by: GISPlanning.tsx, ZonesList.tsx, ZonePropertiesPanel.tsx
    """
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = Zone
        geo_field = 'geometry'
        fields = '__all__'

class ProjectGISSerializer(serializers.ModelSerializer):
    """
    Project GIS data serializer
    API Endpoint: /api/gis/project-gis/
    Used by: GISPlanning.tsx
    """
    shapefile_name = serializers.CharField(source='shapefile.name', read_only=True)
    
    class Meta:
        model = ProjectGIS
        fields = '__all__'

# File Management Serializers
class UploadedFileSerializer(serializers.ModelSerializer):
    """
    File upload serializer
    API Endpoint: /api/files/uploads/
    Used by: FileUploadCard.tsx, various file upload components
    """
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = UploadedFile
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'upload_date', 'file_size']
    
    def create(self, validated_data):
        # Auto-set file size and uploaded_by
        file_obj = validated_data['file']
        validated_data['file_size'] = file_obj.size
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)