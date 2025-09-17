# TIDES Django Backend - Project & Scheme System

Complete Django REST API backend for the 6-step Project & Scheme workflow.

## Features

### 6-Step Workflow Implementation:
1. **Project Basic Information** - Project creation with GIS file uploads
2. **Technology Selection** - Choose irrigation technology and methods
3. **Crop Calendar & Water Requirement** - Crop planning with automated water calculations
4. **Hydraulic Design** - System design parameters and calculations
5. **Resources Management** - Materials, equipment, and labor planning
6. **BOQ & Costing** - Bill of quantities generation with PDF/Excel reports

## Quick Setup

### 1. Environment Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Configuration
Create `.env` file:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_ENGINE=django.db.backends.postgresql
DB_NAME=tides_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOW_ALL_ORIGINS=True
```

### 3. Database Migration
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data
python manage.py loaddata sample_data
```

### 4. Run Server
```bash
python manage.py runserver
```

## API Endpoints

### Authentication
```
POST /api/auth/token/          - Get JWT tokens
POST /api/auth/refresh/        - Refresh token
GET  /api/auth/profile/        - Get user profile
```

### Project Workflow
```
# Step 1: Project Basic Information
POST /api/projects/                    - Create project
GET  /api/projects/{id}/               - Get project details
PUT  /api/projects/{id}/               - Update project

# Step 2: Technology Selection
POST /api/projects/{id}/technology/    - Save technology selection
GET  /api/irrigation-technologies/     - Get available technologies

# Step 3: Crop Calendar & Water Requirement
POST /api/projects/{id}/cwr/           - Save crops & calculate water
GET  /api/crops/                       - Get available crops

# Step 4: Hydraulic Design
GET  /api/projects/{id}/hydraulic-design/ - Get design parameters
POST /api/projects/{id}/hydraulic-design/ - Update design

# Step 5: Resources Management
GET  /api/projects/{id}/resources/     - Get project resources
POST /api/projects/{id}/resources/     - Update resources
GET  /api/resource-categories/         - Get resource categories

# Step 6: BOQ Generation
POST /api/projects/{id}/boq/           - Generate BOQ & reports
```

## API Usage Examples

### 1. Create Project
```json
POST /api/projects/
{
    "name": "Irrigation Project Alpha",
    "description": "Sample irrigation project",
    "zone": "Zone A",
    "region": "Central Region",
    "district": "Sample District",
    "scheme_name": "Alpha Scheme",
    "total_area": 1000.00,
    "potential_area": 800.00
}
```

### 2. Select Technology
```json
POST /api/projects/{id}/technology/
{
    "technology_id": "uuid-of-technology",
    "notes": "Selected drip irrigation for high efficiency"
}
```

### 3. Setup Crop Calendar
```json
POST /api/projects/{id}/cwr/
{
    "crops": [
        {
            "crop_id": "uuid-of-rice",
            "planting_date": "2024-01-15",
            "area_hectares": 300.00
        },
        {
            "crop_id": "uuid-of-wheat",
            "planting_date": "2024-02-01",
            "area_hectares": 500.00
        }
    ]
}
```

### 4. Update Resources
```json
POST /api/projects/{id}/resources/
{
    "resources": [
        {
            "resource_category_id": 1,
            "quantity": 1000.00,
            "unit_cost": 50.00,
            "specification": "PVC pipes 110mm diameter",
            "supplier": "ABC Supplies",
            "region": "Central Region"
        }
    ]
}
```

### 5. Generate BOQ
```json
POST /api/projects/{id}/boq/
{
    "overhead_percentage": 10.0,
    "contingency_percentage": 5.0,
    "generate_pdf": true,
    "generate_excel": true
}
```

## Database Models

### Core Models:
- **Project** - Main project information
- **IrrigationTechnology** - Technology master data
- **Crop** - Crop master data with coefficients
- **ProjectCropCalendar** - Project crop planning
- **WaterRequirement** - Calculated water needs
- **HydraulicDesign** - System design parameters
- **ResourceCategory** - Resource classification
- **ProjectResource** - Project resource requirements
- **BOQAnalysis** - Cost analysis and totals

## Key Features

### Water Requirement Calculation
- Automated calculation based on crop coefficients
- ET0-based water demand estimation
- Irrigation efficiency consideration
- Peak demand calculation
- Water demand curve generation

### Hydraulic Design
- Automated pipe sizing calculations
- Pump sizing based on flow and head
- System pressure calculations
- Velocity optimization

### BOQ Generation
- Material cost aggregation
- Equipment cost calculation
- Labor cost estimation
- Overhead and contingency application
- Cost per hectare calculation
- PDF and Excel report generation

### Security Features
- JWT-based authentication
- Role-based access control
- CORS configuration
- Input validation
- SQL injection protection

## Development

### Running Tests
```bash
python manage.py test
```

### API Documentation
```bash
# Visit after starting server
http://localhost:8000/api/schema/swagger-ui/
```

### Django Admin
```bash
# Visit after creating superuser
http://localhost:8000/admin/
```

## Production Deployment

### Environment Variables
```env
SECRET_KEY=production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=tides_production
DB_USER=postgres
DB_PASSWORD=secure-password
DB_HOST=db-host
DB_PORT=5432
CORS_ALLOW_ALL_ORIGINS=False
```

### Static Files
```bash
python manage.py collectstatic
```

### WSGI Server
```bash
gunicorn tides.wsgi:application
```

## File Structure
```
django_backend/
├── models.py           # Database models
├── serializers.py      # API serializers
├── views.py           # API views and logic
├── urls.py            # URL routing
├── admin.py           # Django admin config
├── sample_data.py     # Sample data loader
├── requirements.txt   # Python dependencies
├── settings.py        # Django settings
└── README.md         # This file
```

## Support

For issues and questions:
1. Check Django documentation
2. Review API endpoint documentation
3. Examine sample data structure
4. Test with provided examples

---

**Note**: This backend provides complete functionality for the 6-step Project & Scheme workflow. Customize calculations, validations, and business logic according to your specific requirements.