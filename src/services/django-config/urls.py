# Django URL Configuration for Irrigation Management System
# Place this in your Django project's main urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication endpoints
    path('api/auth/', include('authentication.urls')),
    
    # Project management endpoints
    path('api/projects/', include('projects.urls')),
    
    # Materials and cost database endpoints
    path('api/materials/', include('materials.urls')),
    
    # BOQ builder endpoints
    path('api/boq/', include('boq.urls')),
    
    # GIS planning endpoints
    path('api/gis/', include('gis.urls')),
    
    # File management endpoints
    path('api/files/', include('files.urls')),
    
    # Resources management endpoints
    path('api/resources/', include('resources.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)