# Django REST Framework ViewSets
# Create these viewsets in respective app views.py files

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_gis.filters import InBBoxFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import authenticate, login
from django.db.models import Q, Sum, Avg
from .models import *
from .serializers import *

# Authentication Views
class AuthViewSet(viewsets.GenericViewSet):
    """
    Authentication viewset for login, logout, and user management
    Frontend Integration: AuthContext.tsx, Login.tsx
    """
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        User login endpoint
        POST /api/auth/login/
        Expected payload: {username: string, password: string}
        Returns: {user: UserData, token: string}
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                # Create or get auth token
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'user': UserSerializer(user).data,
                    'token': token.key,
                    'message': 'Login successful'
                })
            else:
                return Response(
                    {'error': 'Invalid credentials'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """
        User logout endpoint
        POST /api/auth/logout/
        """
        try:
            request.user.auth_token.delete()
        except:
            pass
        return Response({'message': 'Logout successful'})
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """
        Get current user profile
        GET /api/auth/profile/
        """
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

# Project Management Views
class ProjectViewSet(viewsets.ModelViewSet):
    """
    Project management viewset
    Frontend Integration: Projects.tsx, ProjectWizard.tsx
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'zone', 'created_by']
    search_fields = ['name', 'description', 'scheme_name']
    
    def perform_create(self, serializer):
        """Auto-assign current user as creator"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get', 'put'])
    def wizard(self, request, pk=None):
        """
        Project wizard data management
        GET/PUT /api/projects/{id}/wizard/
        Frontend Integration: ProjectWizard.tsx
        """
        project = self.get_object()
        wizard_data, created = ProjectWizard.objects.get_or_create(project=project)
        
        if request.method == 'GET':
            return Response(ProjectWizardSerializer(wizard_data).data)
        
        elif request.method == 'PUT':
            serializer = ProjectWizardSerializer(wizard_data, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """
        Submit project for approval
        POST /api/projects/{id}/submit/
        """
        project = self.get_object()
        project.status = 'submitted'
        project.submitted_at = timezone.now()
        project.save()
        return Response({'message': 'Project submitted successfully'})
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Get dashboard statistics
        GET /api/projects/dashboard_stats/
        Frontend Integration: Dashboard components
        """
        user_projects = Project.objects.filter(created_by=request.user)
        stats = {
            'total_projects': user_projects.count(),
            'draft_projects': user_projects.filter(status='draft').count(),
            'submitted_projects': user_projects.filter(status='submitted').count(),
            'approved_projects': user_projects.filter(status='approved').count(),
        }
        return Response(stats)

# Materials & Cost Database Views
class MaterialViewSet(viewsets.ModelViewSet):
    """
    Materials database viewset
    Frontend Integration: MaterialsTable.tsx, MaterialForm.tsx
    """
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'specifications', 'supplier']
    
    @action(detail=False, methods=['get'])
    def by_region(self, request):
        """
        Get materials with region-specific pricing
        GET /api/materials/by_region/?region=<region_name>
        Frontend Integration: Cost calculation components
        """
        region = request.query_params.get('region', 'default')
        materials = self.get_queryset()
        
        # Add region-specific pricing to response
        response_data = []
        for material in materials:
            data = MaterialSerializer(material).data
            region_price = material.region_specific_price.get(region, material.current_price)
            data['regional_price'] = region_price
            response_data.append(data)
        
        return Response(response_data)

class TechnologyViewSet(viewsets.ModelViewSet):
    """
    Irrigation technologies viewset
    Frontend Integration: TechnologiesTable.tsx, TechnologyForm.tsx
    """
    queryset = Technology.objects.filter(is_active=True)
    serializer_class = TechnologySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['technology_type']
    search_fields = ['name']

# BOQ Builder Views
class ExistingProjectViewSet(viewsets.ModelViewSet):
    """
    Existing projects viewset for BOQ analysis
    Frontend Integration: BOQBuilder.tsx
    """
    queryset = ExistingProject.objects.all()
    serializer_class = ExistingProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['irrigation_type', 'status']
    search_fields = ['name', 'location']
    
    @action(detail=False, methods=['get'])
    def cost_analysis(self, request):
        """
        Get cost analysis data for existing projects
        GET /api/boq/existing-projects/cost_analysis/
        Frontend Integration: BOQ analysis components
        """
        projects = self.get_queryset()
        analysis = {
            'average_cost_per_hectare': projects.aggregate(
                avg_cost=Avg('actual_cost')
            )['avg_cost'],
            'cost_by_irrigation_type': {}
        }
        
        for irrigation_type, _ in ExistingProject.IRRIGATION_TYPES:
            type_projects = projects.filter(irrigation_type=irrigation_type)
            if type_projects.exists():
                analysis['cost_by_irrigation_type'][irrigation_type] = {
                    'average_cost': type_projects.aggregate(avg=Avg('actual_cost'))['avg'],
                    'count': type_projects.count()
                }
        
        return Response(analysis)

class BOQAnalysisViewSet(viewsets.ModelViewSet):
    """
    BOQ analysis viewset
    Frontend Integration: BOQBuilder.tsx
    """
    queryset = BOQAnalysis.objects.all()
    serializer_class = BOQAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """Auto-assign current user as analyzer"""
        serializer.save(analyzed_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def export_boq(self, request, pk=None):
        """
        Export BOQ analysis as PDF/Excel
        GET /api/boq/analyses/{id}/export_boq/?format=pdf|excel
        Frontend Integration: BOQ export functionality
        """
        analysis = self.get_object()
        export_format = request.query_params.get('format', 'pdf')
        
        # TODO: Implement PDF/Excel export logic
        # This would typically use libraries like reportlab or openpyxl
        
        return Response({
            'message': f'BOQ export in {export_format} format',
            'download_url': f'/media/exports/boq_{analysis.id}.{export_format}'
        })

# GIS Planning Views
class ShapefileViewSet(viewsets.ModelViewSet):
    """
    Shapefile upload and management viewset
    Frontend Integration: GISPlanning.tsx
    """
    queryset = Shapefile.objects.all()
    serializer_class = ShapefileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        """Auto-assign current user as uploader"""
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Download shapefile
        GET /api/gis/shapefiles/{id}/download/
        Frontend Integration: Shapefile download functionality
        """
        shapefile = self.get_object()
        # Return file download response
        return Response({
            'download_url': shapefile.file_path.url,
            'filename': shapefile.name
        })

class ZoneViewSet(viewsets.ModelViewSet):
    """
    GIS zones viewset with spatial filtering
    Frontend Integration: GISPlanning.tsx, ZonesList.tsx
    """
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, InBBoxFilter]
    filterset_fields = ['project', 'irrigation_type', 'status']
    bbox_filter_field = 'geometry'
    
    @action(detail=False, methods=['get'])
    def by_project(self, request):
        """
        Get zones by project with geometry
        GET /api/gis/zones/by_project/?project_id=<uuid>
        Frontend Integration: Map display components
        """
        project_id = request.query_params.get('project_id')
        if project_id:
            zones = self.get_queryset().filter(project_id=project_id)
            return Response(ZoneSerializer(zones, many=True).data)
        return Response({'error': 'project_id parameter required'}, status=400)

# File Management Views
class UploadedFileViewSet(viewsets.ModelViewSet):
    """
    File upload and management viewset
    Frontend Integration: FileUploadCard.tsx, file upload components
    """
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['file_type', 'project']
    
    def perform_create(self, serializer):
        """Auto-assign current user as uploader"""
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Download uploaded file
        GET /api/files/uploads/{id}/download/
        Frontend Integration: File download functionality
        """
        uploaded_file = self.get_object()
        return Response({
            'download_url': uploaded_file.file.url,
            'filename': uploaded_file.name,
            'file_type': uploaded_file.file_type
        })