# Individual App URL Configurations
# Create these in each Django app's urls.py file

# authentication/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet

router = DefaultRouter()
router.register(r'', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]

# projects/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet

router = DefaultRouter()
router.register(r'', ProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# materials/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialViewSet, TechnologyViewSet, MaterialCategoryViewSet

router = DefaultRouter()
router.register(r'materials', MaterialViewSet)
router.register(r'technologies', TechnologyViewSet)
router.register(r'categories', MaterialCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# boq/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExistingProjectViewSet, BOQAnalysisViewSet, BOQTemplateViewSet

router = DefaultRouter()
router.register(r'existing-projects', ExistingProjectViewSet)
router.register(r'analyses', BOQAnalysisViewSet)
router.register(r'templates', BOQTemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# gis/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShapefileViewSet, ZoneViewSet, ProjectGISViewSet

router = DefaultRouter()
router.register(r'shapefiles', ShapefileViewSet)
router.register(r'zones', ZoneViewSet)
router.register(r'project-gis', ProjectGISViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# files/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UploadedFileViewSet

router = DefaultRouter()
router.register(r'uploads', UploadedFileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# resources/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentViewSet, LaborRateViewSet

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet)
router.register(r'labor', LaborRateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]