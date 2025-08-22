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
# MISSING RESOURCES & MATERIALS API ENDPOINTS
# ==============================================================================

# resources/views.py - Create this file or add to existing views
class ResourcesViewSet(viewsets.GenericViewSet):
    """
    Resources management viewset
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='materials')
    def materials(self, request):
        """
        Get materials database
        GET /api/resources/materials/
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
        GET /api/resources/equipment/
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
        GET /api/resources/labor/
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
        Get irrigation technologies
        GET /api/resources/technologies/
        """
        # Sample data - replace with your actual Technology model
        technologies = [
            {
                'id': 1,
                'name': 'Drip Irrigation',
                'category': 'Micro Irrigation',
                'efficiency': 90,
                'cost_per_hectare': 1500.00,
                'suitable_crops': ['Vegetables', 'Fruits']
            },
            {
                'id': 2,
                'name': 'Sprinkler Irrigation',
                'category': 'Overhead Irrigation',
                'efficiency': 75,
                'cost_per_hectare': 1200.00,
                'suitable_crops': ['Cereals', 'Forage']
            }
        ]
        return Response(technologies)


# materials/views.py - Create this file or add to existing views
class MaterialsViewSet(viewsets.GenericViewSet):
    """
    Materials management viewset for suitability criteria and costing rules
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
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


# ==============================================================================
# URL PATTERNS - Add these to your urls.py files
# ==============================================================================

# Create resources/urls.py:
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourcesViewSet

router = DefaultRouter()
router.register(r'', ResourcesViewSet, basename='resources')

urlpatterns = [
    path('', include(router.urls)),
]
"""

# Update materials/urls.py (or create if it doesn't exist):
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

# Add to main_project/urls.py:
"""
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/resources/', include('resources.urls')),  # ADD THIS LINE
    path('api/materials/', include('materials.urls')),  # ADD THIS LINE
    # ... other patterns
]
"""