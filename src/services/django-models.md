# Django Models for Irrigation Management System

This file contains the Django model definitions required for the frontend functionality.

## Required Django Packages

```python
# requirements.txt
Django>=4.2.0
djangorestframework>=3.14.0
django-cors-headers>=4.0.0
django-storages>=1.13.0
psycopg2-binary>=2.9.0  # for PostgreSQL
Pillow>=9.5.0  # for ImageField
django.contrib.gis  # for GIS features (requires GDAL, GEOS, PROJ)
```

## Models

### 1. User Management Models

```python
# models/users.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Engineer', 'Engineer'),
        ('Planner', 'Planner'),
        ('Viewer', 'Viewer'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Viewer')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    requires_password_change = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### 2. Project Management Models

```python
# models/projects.py
from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Project(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    zone = models.CharField(max_length=100)
    regions = models.JSONField(default=list)
    districts = models.JSONField(default=list)
    scheme_name = models.CharField(max_length=200)
    step = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    project_data = models.JSONField(default=dict)  # Complete wizard data
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-updated_at']

class ProjectWizard(models.Model):
    """Detailed project wizard data"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='wizard_data')
    current_step = models.IntegerField(default=0)
    project_info = models.JSONField(default=dict)
    crop_calendar = models.JSONField(default=list)
    technology_selection = models.JSONField(default=dict)
    crop_water_requirements = models.JSONField(default=list)
    hydraulic_design = models.JSONField(default=dict)
    resource_selection = models.JSONField(default=list)
    boq_items = models.JSONField(default=list)
    comments = models.TextField(blank=True)
```

### 3. Materials & Cost Database Models

```python
# models/materials.py
from django.db import models

class MaterialCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Material Categories"

class Material(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(MaterialCategory, on_delete=models.CASCADE)
    unit = models.CharField(max_length=50)  # e.g., 'meter', 'kg', 'nos'
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    specifications = models.TextField()
    supplier = models.CharField(max_length=200, blank=True)
    region_specific_price = models.JSONField(default=dict)  # Prices by region
    last_updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['category', 'name']

class Technology(models.Model):
    TECHNOLOGY_TYPES = [
        ('surface', 'Surface Irrigation'),
        ('subsurface', 'Subsurface Irrigation'),
        ('pressurized', 'Pressurized Irrigation'),
    ]
    
    name = models.CharField(max_length=200)
    technology_type = models.CharField(max_length=20, choices=TECHNOLOGY_TYPES)
    efficiency = models.FloatField()  # Irrigation efficiency percentage
    specifications = models.JSONField(default=dict)
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    installation_cost = models.DecimalField(max_digits=10, decimal_places=2)
    maintenance_cost = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Technologies"

class Equipment(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    specifications = models.TextField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    rental_rate_daily = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    supplier = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)

class LaborRate(models.Model):
    SKILL_LEVELS = [
        ('unskilled', 'Unskilled'),
        ('semi_skilled', 'Semi-skilled'),
        ('skilled', 'Skilled'),
        ('professional', 'Professional'),
    ]
    
    skill_level = models.CharField(max_length=20, choices=SKILL_LEVELS)
    region = models.CharField(max_length=100)
    daily_rate = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.CharField(max_length=200)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['skill_level', 'region']
```

### 4. BOQ Builder Models

```python
# models/boq.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ExistingProject(models.Model):
    """Existing irrigation projects for BOQ analysis"""
    IRRIGATION_TYPES = [
        ('drip', 'Drip Irrigation'),
        ('sprinkler', 'Sprinkler'),
        ('surface', 'Surface Irrigation'),
    ]
    
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    irrigation_type = models.CharField(max_length=20, choices=IRRIGATION_TYPES)
    area = models.FloatField()  # in hectares
    construction_date = models.DateField()
    materials_used = models.JSONField(default=list)
    technologies_used = models.JSONField(default=list)
    actual_cost = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, default='Completed')
    created_at = models.DateTimeField(auto_now_add=True)

class BOQAnalysis(models.Model):
    """BOQ analysis for existing projects"""
    existing_project = models.ForeignKey(ExistingProject, on_delete=models.CASCADE)
    analyzed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    analysis_date = models.DateTimeField(auto_now_add=True)
    boq_data = models.JSONField(default=list)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2)
    cost_per_hectare = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        ordering = ['-analysis_date']

class BOQTemplate(models.Model):
    """BOQ templates for different irrigation types"""
    name = models.CharField(max_length=200)
    irrigation_type = models.CharField(max_length=50)
    template_data = models.JSONField(default=dict)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
```

### 5. GIS Planning Models

```python
# models/gis.py
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Shapefile(models.Model):
    """Uploaded shapefiles"""
    name = models.CharField(max_length=200)
    file_path = models.FileField(upload_to='shapefiles/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    geometry_type = models.CharField(max_length=50)
    feature_count = models.IntegerField()
    bounding_box = models.JSONField(default=dict)

class Zone(models.Model):
    """Project zones with GIS data"""
    IRRIGATION_TYPES = [
        ('micro_drip', 'Micro-drip'),
        ('sprinkler', 'Sprinkler'),
        ('surface', 'Surface'),
    ]
    
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='zones')
    name = models.CharField(max_length=200)
    geometry = gis_models.PolygonField(srid=4326)
    area = models.FloatField()  # Calculated area in hectares
    irrigation_type = models.CharField(max_length=20, choices=IRRIGATION_TYPES)
    crop_type = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    water_requirement = models.FloatField(null=True, blank=True)
    design_parameters = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

class ProjectGIS(models.Model):
    """GIS data for projects"""
    project = models.OneToOneField('projects.Project', on_delete=models.CASCADE, related_name='gis_data')
    shapefile = models.ForeignKey(Shapefile, on_delete=models.SET_NULL, null=True, blank=True)
    design_data = models.JSONField(default=dict)
    hydraulic_design = models.JSONField(default=dict)
    boq_data = models.JSONField(default=dict)
```

### 6. File Management Models

```python
# models/files.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UploadedFile(models.Model):
    FILE_TYPES = [
        ('shapefile', 'Shapefile'),
        ('document', 'Document'),
        ('image', 'Image'),
        ('boq', 'BOQ Document'),
        ('cross_section', 'Cross Section'),
    ]
    
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='uploads/')
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='files', null=True, blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    file_size = models.BigIntegerField()
    is_active = models.BooleanField(default=True)
```

## Database Configuration

### settings.py

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'irrigation_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# For GIS features
GDAL_LIBRARY_PATH = '/path/to/gdal/library'
GEOS_LIBRARY_PATH = '/path/to/geos/library'

# File upload settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Maximum file size (100MB)
FILE_UPLOAD_MAX_MEMORY_SIZE = 104857600
DATA_UPLOAD_MAX_MEMORY_SIZE = 104857600
```

## Migrations

After creating these models, run:

```bash
python manage.py makemigrations
python manage.py migrate
```

## API ViewSets

Create corresponding Django REST Framework ViewSets for each model to provide the API endpoints referenced in the frontend code.