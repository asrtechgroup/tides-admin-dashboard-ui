# Django URLs for TIDES Project & Scheme API

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, 
    IrrigationTechnologyViewSet, 
    CropViewSet, 
    ResourceCategoryViewSet
)

# Create router for ViewSets
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'irrigation-technologies', IrrigationTechnologyViewSet, basename='irrigation-technologies')
router.register(r'crops', CropViewSet, basename='crops')
router.register(r'resource-categories', ResourceCategoryViewSet, basename='resource-categories')

# URL patterns
urlpatterns = [
    # ViewSet routes
    path('api/', include(router.urls)),
    
    # Custom endpoints for the 6-step workflow
    # Step 1: Project Basic Information - handled by ProjectViewSet create/update
    # Step 2: Technology Selection - projects/{id}/technology/
    # Step 3: Crop Calendar & Water Requirement - projects/{id}/cwr/
    # Step 4: Hydraulic Design - projects/{id}/hydraulic-design/
    # Step 5: Resources Management - projects/{id}/resources/
    # Step 6: BOQ Generation - projects/{id}/boq/
]

"""
API Endpoints Summary:

1. PROJECT BASIC INFORMATION
   POST /api/projects/                    - Create new project
   GET  /api/projects/{id}/               - Get project details
   PUT  /api/projects/{id}/               - Update project
   
2. TECHNOLOGY SELECTION
   POST /api/projects/{id}/technology/    - Save technology selection
   GET  /api/irrigation-technologies/     - Get available technologies
   GET  /api/irrigation-technologies/by_type/ - Get technologies grouped by type
   
3. CROP CALENDAR & WATER REQUIREMENT
   POST /api/projects/{id}/cwr/           - Save crop calendar & calculate water requirements
   GET  /api/crops/                       - Get available crops
   GET  /api/crops/by_type/               - Get crops grouped by type
   
4. HYDRAULIC DESIGN
   GET  /api/projects/{id}/hydraulic-design/ - Get hydraulic design parameters
   POST /api/projects/{id}/hydraulic-design/ - Update hydraulic design
   
5. RESOURCES MANAGEMENT
   GET  /api/projects/{id}/resources/     - Get project resources
   POST /api/projects/{id}/resources/     - Update project resources
   GET  /api/resource-categories/         - Get resource categories
   GET  /api/resource-categories/by_type/ - Get categories grouped by type
   
6. BOQ & COSTING
   POST /api/projects/{id}/boq/           - Generate BOQ analysis and reports

MASTER DATA ENDPOINTS:
   GET  /api/irrigation-technologies/     - All irrigation technologies
   GET  /api/crops/                       - All crops with coefficients
   GET  /api/resource-categories/         - All resource categories
"""