# CORRECTED views.py
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_gis.filters import InBBoxFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import authenticate
from django.db.models import Q, Sum, Avg
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import *
from .serializers import *
from .serializers import UserRegistrationSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = getattr(user, 'role', 'Viewer')
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Authentication Views
class AuthViewSet(viewsets.GenericViewSet):
    """
    Authentication viewset for login, logout, and user management
    """
    authentication_classes = [JWTAuthentication]
    
    def get_permissions(self):
        """
        Set permissions per action
        """
        if self.action in ['login']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['register', 'users']:
            permission_classes = [IsAuthenticated, IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        User login endpoint - Use JWT tokens
        POST /api/auth/login/
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            if user and user.is_active:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                
                # Add custom claims
                access_token['email'] = user.email
                access_token['role'] = getattr(user, 'role', 'Viewer')
                
                return Response({
                    'access': str(access_token),
                    'refresh': str(refresh),
                    'user': UserSerializer(user).data,
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
            # For JWT, we can't really "logout" server-side, but we can blacklist the token
            # if using django-rest-framework-simplejwt with blacklist app
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception as e:
            pass  # Token might already be invalid
        
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """
        Get current user profile
        GET /api/auth/profile/
        """
        return Response(UserSerializer(request.user).data)
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Admin-only endpoint to register a new user
        POST /api/auth/register/
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data, 
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def users(self, request):
        """
        Get all users (Admin only)
        GET /api/auth/users/
        """
        users = User.objects.all().order_by('-created_at')
        return Response({
            'results': UserSerializer(users, many=True).data,
            'count': users.count()
        })

# CORRECTED serializers.py additions
class LoginSerializer(serializers.Serializer):
    """
    Login serializer for user authentication
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for admin user registration
    """
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'password']
    
    def validate_role(self, value):
        """Validate role is one of the allowed choices"""
        allowed_roles = ['Admin', 'Engineer', 'Planner', 'Viewer']
        if value not in allowed_roles:
            raise serializers.ValidationError(f"Role must be one of: {', '.join(allowed_roles)}")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

# REQUIRED settings.py configuration
"""
# Add to your Django settings.py:

INSTALLED_APPS = [
    # ... other apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',  # For token blacklisting
    # ... your apps
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# CORS settings if frontend is on different port
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
"""

# ==============================================================================
# MATERIALS APP - ALL RESOURCES CONSOLIDATED
# ==============================================================================

# =================
# TECHNOLOGY ENTRY MODEL FOR MATERIALS APP
# =================

class TechnologyEntry(models.Model):
    """
    Represents a technology entry with irrigation type and all suitability criteria.
    Example: Pressurized Irrigation Technology -> Drip Irrigation.
    Frontend Integration: TechnologySelectionStep.tsx, useTechnologySelection.ts
    """

    TECHNOLOGY_CHOICES = [
        ('surface', 'Surface Irrigation Technology'),
        ('subsurface', 'Subsurface Irrigation Technology'),
        ('pressurized', 'Pressurized Irrigation Technology'),
    ]

    MAINTENANCE_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    # Core fields
    technology_name = models.CharField(max_length=50, choices=TECHNOLOGY_CHOICES)
    irrigation_type = models.CharField(max_length=100)  # validated on frontend
    description = models.TextField(blank=True, null=True)

    efficiency = models.DecimalField(max_digits=5, decimal_places=2, help_text="Efficiency in %")
    water_requirement = models.DecimalField(max_digits=6, decimal_places=2, help_text="Liters/m²/day")
    lifespan = models.PositiveIntegerField(help_text="Lifespan in years")
    maintenance_level = models.CharField(max_length=10, choices=MAINTENANCE_LEVELS)

    # Suitability criteria
    suitable_soil_types = models.JSONField(default=list)  
    suitable_crop_types = models.JSONField(default=list)  
    suitable_farm_sizes = models.JSONField(default=list)  
    water_quality_requirements = models.JSONField(default=list)  
    suitable_topography = models.JSONField(default=list)  
    climate_zones = models.JSONField(default=list)  

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_technology_name_display()} - {self.irrigation_type}"

    class Meta:
        db_table = 'materials_technologyentry'
        verbose_name_plural = "Technology Entries"
        unique_together = ['technology_name', 'irrigation_type']

# =================

# materials/views.py - Add to existing views or create
class MaterialsViewSet(viewsets.GenericViewSet):
    """
    Materials management viewset for all resources, suitability criteria and costing rules
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    # RESOURCES ENDPOINTS
    @action(detail=False, methods=['get'], url_path='materials')
    def materials(self, request):
        """
        Get materials database
        GET /api/materials/materials/
        """
        # Sample data - replace with your actual Material model
        materials = [
            {
                'id': 1,
                'name': 'PVC Pipe 4"',
                'category': 'Pipes',
                'unit': 'meter',
                'cost_per_unit': 25.50,
                'supplier': 'Local Supplier A'
            },
            {
                'id': 2,
                'name': 'Drip Emitter',
                'category': 'Irrigation Components',
                'unit': 'piece',
                'cost_per_unit': 0.75,
                'supplier': 'Irrigation Co.'
            }
        ]
        return Response(materials)
    
    @action(detail=False, methods=['get'], url_path='equipment')
    def equipment(self, request):
        """
        Get equipment database
        GET /api/materials/equipment/
        """
        # Sample data - replace with your actual Equipment model
        equipment = [
            {
                'id': 1,
                'name': 'Excavator Small',
                'category': 'Heavy Machinery',
                'unit': 'hour',
                'cost_per_unit': 150.00,
                'supplier': 'Equipment Rental Co.'
            },
            {
                'id': 2,
                'name': 'Water Pump 5HP',
                'category': 'Pumps',
                'unit': 'piece',
                'cost_per_unit': 850.00,
                'supplier': 'Pump Solutions Ltd'
            }
        ]
        return Response(equipment)
    
    @action(detail=False, methods=['get'], url_path='labor')
    def labor(self, request):
        """
        Get labor rates
        GET /api/materials/labor/
        """
        # Sample data - replace with your actual Labor model
        labor = [
            {
                'id': 1,
                'category': 'Skilled Technician',
                'hourly_rate': 25.00,
                'region': 'Urban',
                'currency': 'USD'
            },
            {
                'id': 2,
                'category': 'General Labor',
                'hourly_rate': 15.00,
                'region': 'Rural',
                'currency': 'USD'
            }
        ]
        return Response(labor)
    
    @action(detail=False, methods=['get'], url_path='technologies')
    def technologies(self, request):
        """
        Get irrigation technologies with comprehensive data
        GET /api/materials/technologies/
        Frontend Integration: useTechnologySelection.ts, TechnologySelectionStep.tsx
        """
        # Sample data that matches TechnologyEntry model - replace with actual queryset
        technologies = [
            {
                'id': 1,
                'technology_name': 'surface',
                'irrigation_type': 'Basin Irrigation',
                'description': 'Traditional surface irrigation method suitable for rice and wheat',
                'efficiency': 60.0,
                'water_requirement': 1200.0,
                'lifespan': 15,
                'maintenance_level': 'low',
                'suitable_soil_types': ['Clay', 'Loam'],
                'suitable_crop_types': ['Rice', 'Wheat', 'Maize'],
                'suitable_farm_sizes': ['Small (< 2 ha)', 'Medium (2-10 ha)'],
                'water_quality_requirements': ['Fresh Water', 'Groundwater'],
                'suitable_topography': ['Flat'],
                'climate_zones': ['Tropical', 'Temperate']
            },
            {
                'id': 2,
                'technology_name': 'surface',
                'irrigation_type': 'Furrow Irrigation',
                'description': 'Row crop irrigation using furrows between crop rows',
                'efficiency': 65.0,
                'water_requirement': 1100.0,
                'lifespan': 12,
                'maintenance_level': 'low',
                'suitable_soil_types': ['Sandy', 'Loam'],
                'suitable_crop_types': ['Vegetables', 'Cotton', 'Maize'],
                'suitable_farm_sizes': ['Medium (2-10 ha)', 'Large (> 10 ha)'],
                'water_quality_requirements': ['Fresh Water', 'Groundwater'],
                'suitable_topography': ['Gentle Slope'],
                'climate_zones': ['Arid', 'Semi-Arid', 'Temperate']
            },
            {
                'id': 3,
                'technology_name': 'pressurized',
                'irrigation_type': 'Drip Irrigation',
                'description': 'High-efficiency micro-irrigation delivering water directly to root zone',
                'efficiency': 90.0,
                'water_requirement': 650.0,
                'lifespan': 8,
                'maintenance_level': 'medium',
                'suitable_soil_types': ['Sandy', 'Loam', 'Clay'],
                'suitable_crop_types': ['Vegetables', 'Fruits', 'Cotton'],
                'suitable_farm_sizes': ['Small (< 2 ha)', 'Medium (2-10 ha)', 'Large (> 10 ha)'],
                'water_quality_requirements': ['Fresh Water', 'Treated Wastewater'],
                'suitable_topography': ['Flat', 'Gentle Slope', 'Steep Slope'],
                'climate_zones': ['Arid', 'Semi-Arid', 'Tropical']
            },
            {
                'id': 4,
                'technology_name': 'pressurized',
                'irrigation_type': 'Sprinkler Systems',
                'description': 'Overhead irrigation simulating natural rainfall',
                'efficiency': 75.0,
                'water_requirement': 850.0,
                'lifespan': 12,
                'maintenance_level': 'medium',
                'suitable_soil_types': ['Sandy', 'Loam', 'Silt'],
                'suitable_crop_types': ['Rice', 'Wheat', 'Vegetables', 'Fruits'],
                'suitable_farm_sizes': ['Medium (2-10 ha)', 'Large (> 10 ha)'],
                'water_quality_requirements': ['Fresh Water', 'Groundwater'],
                'suitable_topography': ['Flat', 'Gentle Slope'],
                'climate_zones': ['Temperate', 'Humid', 'Semi-Arid']
            },
            {
                'id': 5,
                'technology_name': 'subsurface',
                'irrigation_type': 'Subsurface Drip',
                'description': 'Underground drip irrigation for maximum water efficiency',
                'efficiency': 95.0,
                'water_requirement': 600.0,
                'lifespan': 10,
                'maintenance_level': 'high',
                'suitable_soil_types': ['Sandy', 'Loam'],
                'suitable_crop_types': ['Vegetables', 'Fruits', 'Cotton'],
                'suitable_farm_sizes': ['Small (< 2 ha)', 'Medium (2-10 ha)'],
                'water_quality_requirements': ['Fresh Water', 'Treated Wastewater'],
                'suitable_topography': ['Flat', 'Gentle Slope'],
                'climate_zones': ['Arid', 'Semi-Arid']
            }
        ]
        return Response(technologies)
    
    # EXISTING ENDPOINTS
    @action(detail=False, methods=['get', 'post'], url_path='costing-rules')
    def costing_rules(self, request):
        """
        Costing Rules CRUD
        GET/POST /api/materials/costing-rules/
        """
        if request.method == 'GET':
            # Sample data - replace with your actual CostingRule model
            rules = [
                {
                    'id': 1,
                    'rule_name': 'Material Cost Adjustment',
                    'rule_type': 'percentage',
                    'value': 15.0,
                    'applies_to': 'materials',
                    'region': 'remote_areas'
                },
                {
                    'id': 2,
                    'rule_name': 'Labor Cost Premium',
                    'rule_type': 'multiplier',
                    'value': 1.25,
                    'applies_to': 'labor',
                    'region': 'urban'
                }
            ]
            return Response(rules)
        
        elif request.method == 'POST':
            # Handle creation - implement your creation logic here
            return Response({
                'id': 3,
                'message': 'Costing rule created successfully'
            }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get', 'post'], url_path='suitability-criteria')
    def suitability_criteria(self, request):
        """
        Suitability Criteria CRUD
        GET/POST /api/materials/suitability-criteria/
        """
        if request.method == 'GET':
            # This endpoint seems to be working based on the logs
            criteria = [
                {
                    'id': 1,
                    'name': 'Soil Type Compatibility',
                    'parameter': 'soil_type',
                    'suitable_values': ['clay', 'loam', 'sandy_loam'],
                    'technology': 'drip_irrigation'
                },
                {
                    'id': 2,
                    'name': 'Water Quality Requirements',
                    'parameter': 'water_salinity',
                    'max_value': 2000,
                    'unit': 'ppm',
                    'technology': 'sprinkler_irrigation'
                }
            ]
            return Response(criteria)
        
        elif request.method == 'POST':
            # Handle creation - implement your creation logic here
            return Response({
                'id': 3,
                'message': 'Suitability criterion created successfully'
            }, status=status.HTTP_201_CREATED)


# ==============================================================================
# URL PATTERNS - Update your urls.py files
# ==============================================================================

# materials/urls.py - Update your existing materials URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialsViewSet

router = DefaultRouter()
router.register(r'', MaterialsViewSet, basename='materials')

urlpatterns = [
    path('', include(router.urls)),
]
"""

# main_project/urls.py - Only need materials app, no separate resources app
"""
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/materials/', include('materials.urls')),  # All resources go through materials
    # ... other patterns
]
"""