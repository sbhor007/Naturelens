# Naturelens - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Setup and Installation](#setup-and-installation)
7. [API Documentation](#api-documentation)
8. [Frontend Components](#frontend-components)
9. [Database Schema](#database-schema)
10. [Deployment](#deployment)
11. [Development Guidelines](#development-guidelines)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

Naturelens is a modern, full-stack web application designed for nature photography enthusiasts. It provides a comprehensive platform for photographers to upload, share, discover, and interact with nature photographs. The application combines social media functionality with specialized features for photography communities.

### Key Objectives
- Create a dedicated platform for nature photography sharing
- Enable social interactions among photography enthusiasts
- Provide advanced search and discovery features
- Maintain high performance and scalability
- Ensure responsive design across all devices

---

## Architecture

Naturelens follows a microservices-oriented architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Frontend    │    │     Backend     │    │    Database     │
│   (Angular)     │◄──►│   (Django)      │◄──►│    (MySQL)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         │              │   (Caching)     │              │
         │              └─────────────────┘              │
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │ Elasticsearch   │              │
         │              │   (Search)      │              │
         │              └─────────────────┘              │
         │                                                │
         └────────────────────────────────────────────────┘
                              │
                    ┌─────────────────┐
                    │   Cloudinary    │
                    │ (File Storage)  │
                    └─────────────────┘
```

### Service Communication
- **Frontend ↔ Backend**: RESTful APIs with JWT authentication
- **Backend ↔ Database**: Django ORM
- **Backend ↔ Redis**: Caching and session management
- **Backend ↔ Elasticsearch**: Advanced search functionality
- **Backend ↔ Cloudinary**: Media file storage and optimization

---

## Technology Stack

### Backend
- **Framework**: Django 5.2.1
- **API**: Django REST Framework 3.16.0
- **Authentication**: JWT (Simple JWT)
- **Database**: MySQL 8.0
- **Caching**: Redis 6.2.0
- **Search Engine**: Elasticsearch 8.18.1
- **File Storage**: Cloudinary
- **Email**: SMTP (Gmail)
- **Documentation**: DRF API Logger

### Frontend
- **Framework**: Angular 19.2.0
- **Language**: TypeScript 5.7.2
- **Styling**: TailwindCSS 4.1.11
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS 7.8.0
- **UI Components**: Angular CDK
- **Animations**: GSAP 3.13.0, AOS 2.3.4
- **Layout**: Masonry Layout 4.2.2

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Process Management**: Gunicorn (implied)
- **Environment Management**: dotenv

### Development Tools
- **Code Quality**: ESLint, Prettier
- **Testing**: Jasmine, Karma
- **IDE Support**: VS Code configurations
- **Version Control**: Git

---

## Project Structure

```
Naturelens/
├── Backend/                    # Django backend application
│   ├── Apps/                   # Django applications
│   │   ├── User/              # User management and authentication
│   │   ├── Photos/            # Photo upload and management
│   │   ├── Social/            # Social features (likes, comments)
│   │   ├── Mail/              # Email services and OTP
│   │   └── Notification/      # User notifications
│   ├── Backend/               # Django project settings
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend container configuration
│   └── .env                  # Environment variables
├── Frontend/                  # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Angular components
│   │   │   ├── services/      # API services
│   │   │   ├── guard/         # Route guards
│   │   │   ├── interceptors/  # HTTP interceptors
│   │   │   └── interface/     # TypeScript interfaces
│   │   ├── assets/           # Static assets
│   │   └── environments/     # Environment configurations
│   ├── angular.json          # Angular CLI configuration
│   ├── package.json         # Node.js dependencies
│   └── Dockerfile           # Frontend container configuration
├── nginx/                    # Nginx configuration
├── mediafiles/              # Uploaded media files
├── data/                    # Data persistence
├── docker-compose.yml       # Multi-container orchestration
└── .gitignore              # Git ignore rules
```

---

## Features

### 1. User Management
- **Registration & Authentication**
  - Email-based registration with OTP verification
  - Secure JWT-based authentication
  - Password validation and security measures
  - Session management with refresh tokens

- **User Profiles**
  - Customizable profile with bio and avatar
  - Profile image upload via Cloudinary
  - User settings and preferences

### 2. Photo Management
- **Upload & Storage**
  - Multi-format image support (JPEG, PNG, WebP)
  - Cloudinary integration for optimized storage
  - Automatic image processing and thumbnails
  - Metadata extraction and storage

- **Organization**
  - Category-based classification
  - Tag system for better discoverability
  - Location-based organization
  - Date-based sorting and filtering

### 3. Social Features
- **Interactions**
  - Like/Unlike functionality with real-time updates
  - Comment system with CRUD operations
  - Save photos to personal collections
  - Share functionality

- **Discovery**
  - Explore feed with trending photos
  - Category-based browsing
  - User-generated content recommendations

### 4. Search & Discovery
- **Advanced Search**
  - Elasticsearch-powered full-text search
  - Search by title, description, tags
  - Location-based search
  - User search functionality

- **Filtering & Sorting**
  - Date range filters
  - Category filters
  - Popularity-based sorting
  - Relevance scoring

### 5. Notifications
- **Real-time Notifications**
  - Like notifications
  - Comment notifications
  - System announcements
  - Email notifications for important events

### 6. Admin Features
- **Content Management**
  - Django admin panel integration
  - User moderation tools
  - Content approval workflow
  - Analytics and reporting

---

## Setup and Installation

### Prerequisites
- **System Requirements**
  - Python 3.8+
  - Node.js 16+
  - Docker & Docker Compose
  - Git

- **External Services**
  - Cloudinary account (for media storage)
  - Gmail account (for email services)

### Method 1: Docker Setup (Recommended)

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Naturelens
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment template
   cp Backend/.env.example Backend/.env
   
   # Edit environment variables
   nano Backend/.env
   ```

3. **Required Environment Variables**
   ```env
   # Django Configuration
   DJANGO_SECRET_KEY=your-secret-key
   DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
   
   # Database Configuration
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=naturelens_db
   DB_USER=root
   DB_PASSWORD=root
   DB_HOST=mysql
   DB_PORT=3306
   
   # Cloudinary Configuration
   CLOUD_NAME=your-cloudinary-name
   API_KEY=your-api-key
   API_SECRET=your-api-secret
   
   # Email Configuration
   EMAIL_HOST_PASSWORD=your-app-password
   
   # Elasticsearch Configuration
   ELASTIC_USERNAME=elastic
   ELASTIC_PASSWORD=elastic_search
   ```

4. **Start Services**
   ```bash
   docker-compose up --build
   ```

5. **Initialize Database**
   ```bash
   # Run migrations
   docker exec django_cont python manage.py migrate
   
   # Create superuser
   docker exec -it django_cont python manage.py createsuperuser
   ```

6. **Access Application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

### Method 2: Manual Setup

#### Backend Setup
1. **Create Virtual Environment**
   ```bash
   cd Backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   # Install MySQL and create database
   mysql -u root -p
   CREATE DATABASE naturelens_db;
   ```

4. **Run Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Development Server**
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup
1. **Install Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Update src/environments/environment.development.ts
   export const environment = {
     production: false,
     baseAPI: 'http://localhost:8000/api/'
   };
   ```

3. **Start Development Server**
   ```bash
   ng serve
   ```

#### Additional Services
1. **Redis Setup**
   ```bash
   # Install Redis
   sudo apt-get install redis-server
   redis-server
   ```

2. **Elasticsearch Setup**
   ```bash
   # Download and start Elasticsearch
   wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.18.1.tar.gz
   tar -xzf elasticsearch-8.18.1.tar.gz
   cd elasticsearch-8.18.1/
   ./bin/elasticsearch
   ```

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/user/register/
Content-Type: application/json

{
  "username": "photographer1",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/user/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "access": "jwt-access-token",
  "refresh": "jwt-refresh-token",
  "user": {
    "id": 1,
    "username": "photographer1",
    "email": "user@example.com"
  }
}
```

#### Token Refresh
```http
POST /api/user/token/refresh/
Content-Type: application/json

{
  "refresh": "jwt-refresh-token"
}
```

### User Profile Endpoints

#### Get User Profile
```http
GET /api/user/profile/
Authorization: Bearer jwt-access-token
```

#### Create/Update Profile
```http
POST /api/user/profile/
Authorization: Bearer jwt-access-token
Content-Type: multipart/form-data

{
  "profile_image": <file>,
  "bio": "Nature photographer passionate about landscapes"
}
```

### Photo Management Endpoints

#### Upload Photo
```http
POST /api/photos/photo/
Authorization: Bearer jwt-access-token
Content-Type: multipart/form-data

{
  "title": "Sunset at the Beach",
  "description": "Beautiful sunset captured at Malibu Beach",
  "image": <file>,
  "category": "category-uuid",
  "tags": ["sunset", "beach", "nature"],
  "location": "Malibu, CA"
}
```

#### Get All Photos
```http
GET /api/photos/photo/
Authorization: Bearer jwt-access-token

Response:
{
  "count": 150,
  "next": "http://localhost:8000/api/photos/photo/?limit=30&offset=30",
  "previous": null,
  "results": [
    {
      "id": "photo-uuid",
      "title": "Sunset at the Beach",
      "description": "Beautiful sunset captured at Malibu Beach",
      "image": "https://res.cloudinary.com/...",
      "category": {
        "id": "category-uuid",
        "name": "Landscapes"
      },
      "uploaded_by": {
        "username": "photographer1",
        "profile_image": "https://res.cloudinary.com/..."
      },
      "tags": [
        {"name": "sunset"},
        {"name": "beach"}
      ],
      "location": "Malibu, CA",
      "created_at": "2024-01-15T10:30:00Z",
      "likes_count": 25,
      "comments_count": 8,
      "is_saved": false,
      "is_liked": true
    }
  ]
}
```

#### Get User Photos
```http
GET /api/photos/photo/user-photos/
Authorization: Bearer jwt-access-token
```

#### Update Photo
```http
PUT /api/photos/photo/{photo-id}/
Authorization: Bearer jwt-access-token
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Photo
```http
DELETE /api/photos/photo/{photo-id}/
Authorization: Bearer jwt-access-token
```

### Social Interaction Endpoints

#### Like/Unlike Photo
```http
POST /api/social/photo-like/
Authorization: Bearer jwt-access-token
Content-Type: application/json

{
  "photo": "photo-uuid"
}
```

#### Get Like Count
```http
GET /api/social/photo-like/like-count/?id={photo-id}
Authorization: Bearer jwt-access-token
```

#### Check if Photo is Liked
```http
GET /api/social/photo-like/is-liked/?id={photo-id}
Authorization: Bearer jwt-access-token
```

#### Add Comment
```http
POST /api/social/comment/
Authorization: Bearer jwt-access-token
Content-Type: application/json

{
  "photo": "photo-uuid",
  "comment": "Amazing shot! Love the colors."
}
```

#### Get Photo Comments
```http
GET /api/social/comment/photo-comments/?id={photo-id}
Authorization: Bearer jwt-access-token
```

### Save Photo Endpoints

#### Save Photo
```http
POST /api/photos/save-photo/
Authorization: Bearer jwt-access-token
Content-Type: application/json

{
  "photo": "photo-uuid"
}
```

#### Get Saved Photos
```http
GET /api/photos/save-photo/
Authorization: Bearer jwt-access-token
```

#### Remove Saved Photo
```http
DELETE /api/photos/save-photo/{save-id}/
Authorization: Bearer jwt-access-token
```

### Search Endpoints

#### Search Photos
```http
GET /api/photos/search-photos/{search-term}/
Authorization: Bearer jwt-access-token
```

### Email Endpoints

#### Send OTP
```http
POST /api/mail/send-otp/?email={email}
Authorization: Bearer jwt-access-token
```

#### Verify OTP
```http
POST /api/mail/verify-otp/
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

---

## Frontend Components

### Core Components

#### 1. HomeLayoutComponent
- **Purpose**: Main layout wrapper for public pages
- **Features**: Navigation, footer, routing outlet
- **Routes**: `/home`, `/login`, `/register`, `/explore`

#### 2. DashboardLayoutComponent
- **Purpose**: Authenticated user dashboard layout
- **Features**: Sidebar navigation, user menu, notifications
- **Routes**: All `/user/*` routes

#### 3. HomeComponent
- **Purpose**: Landing page for visitors
- **Features**: Hero section, featured photos, call-to-action

### Authentication Components

#### 4. LoginComponent
- **Purpose**: User authentication
- **Features**: Form validation, JWT token handling, error messages
- **API Integration**: Login endpoint

#### 5. RegisterComponent
- **Purpose**: New user registration
- **Features**: Multi-step form, email validation, OTP verification
- **API Integration**: Register and OTP endpoints

#### 6. OtpVerificationComponent
- **Purpose**: Email verification via OTP
- **Features**: Code input, resend functionality, timer

### Photo Management Components

#### 7. ExploreComponent
- **Purpose**: Photo discovery and browsing
- **Features**: Masonry layout, infinite scroll, filtering
- **API Integration**: Photo listing with pagination

#### 8. CreatePostComponent
- **Purpose**: Photo upload and editing
- **Features**: File upload, form validation, preview, metadata input
- **API Integration**: Photo creation and update

#### 9. PhotoDetailsComponent
- **Purpose**: Individual photo view
- **Features**: Full-size display, comments, likes, save functionality
- **API Integration**: Photo details, social interactions

### User Management Components

#### 10. ProfileComponent
- **Purpose**: User profile display
- **Features**: Tabbed interface, photo grid, profile information
- **Sub-components**: PostsComponent, SavedComponent

#### 11. EditProfileComponent
- **Purpose**: Profile editing
- **Features**: Avatar upload, bio editing, form validation
- **API Integration**: Profile update endpoint

### Social Components

#### 12. MansoryLayoutComponent
- **Purpose**: Grid layout for photo display
- **Features**: Responsive masonry grid, lazy loading, hover effects
- **Libraries**: Masonry.js, ImagesLoaded

### Search Components

#### 13. SearchComponent
- **Purpose**: Search interface
- **Features**: Search input, suggestions, filters

#### 14. SearchResultComponent
- **Purpose**: Display search results
- **Features**: Result listing, pagination, sorting options
- **API Integration**: Search endpoints

### Service Classes

#### AuthService
```typescript
export class AuthService {
  // JWT token management
  // Login/logout functionality
  // Token refresh mechanism
  // Authentication state management
}
```

#### ApiService
```typescript
export class ApiService {
  // HTTP client wrapper
  // API endpoint methods
  // Error handling
  // Request interceptors
}
```

#### PhotoService
```typescript
export class PhotoService {
  // Photo CRUD operations
  // File upload handling
  // Image optimization
  // Metadata management
}
```

#### SocialService
```typescript
export class SocialService {
  // Like/unlike functionality
  // Comment management
  // Social interaction tracking
}
```

---

## Database Schema

### User Management

#### User Model (Custom User)
```sql
CREATE TABLE User_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    password VARCHAR(128) NOT NULL
);
```

#### UserProfile Model
```sql
CREATE TABLE User_userprofile (
    id CHAR(36) PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    profile_image VARCHAR(255),
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES User_user(id) ON DELETE CASCADE
);
```

### Photo Management

#### Category Model
```sql
CREATE TABLE Photos_category (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
```

#### Tags Model
```sql
CREATE TABLE Photos_tags (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
```

#### Photo Model
```sql
CREATE TABLE Photos_photo (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(100) NOT NULL,
    category_id CHAR(36) NOT NULL,
    uploaded_by_id BIGINT NOT NULL,
    location VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Photos_category(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_id) REFERENCES User_user(id) ON DELETE CASCADE
);
```

#### Photo-Tags Many-to-Many
```sql
CREATE TABLE Photos_photo_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    photo_id CHAR(36) NOT NULL,
    tags_id CHAR(36) NOT NULL,
    FOREIGN KEY (photo_id) REFERENCES Photos_photo(id) ON DELETE CASCADE,
    FOREIGN KEY (tags_id) REFERENCES Photos_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_photo_tag (photo_id, tags_id)
);
```

#### SavePhotos Model
```sql
CREATE TABLE saved_photo (
    id CHAR(36) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    photo_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User_user(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES Photos_photo(id) ON DELETE CASCADE,
    CONSTRAINT unique_save_photo UNIQUE (user_id, photo_id)
);
```

### Social Features

#### PhotoLike Model
```sql
CREATE TABLE Social_photolike (
    id CHAR(36) PRIMARY KEY,
    photo_id CHAR(36) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES Photos_photo(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User_user(id) ON DELETE CASCADE,
    CONSTRAINT unique_photo_user_like UNIQUE (photo_id, user_id)
);
```

#### Comment Model
```sql
CREATE TABLE Social_comment (
    id CHAR(36) PRIMARY KEY,
    photo_id CHAR(36) NOT NULL,
    user_id BIGINT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES Photos_photo(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User_user(id) ON DELETE CASCADE
);
```

### Database Relationships

```
User (1) ←→ (1) UserProfile
User (1) ←→ (N) Photo (uploaded_by)
User (1) ←→ (N) PhotoLike
User (1) ←→ (N) Comment
User (1) ←→ (N) SavePhotos

Photo (1) ←→ (N) PhotoLike
Photo (1) ←→ (N) Comment
Photo (1) ←→ (N) SavePhotos
Photo (N) ←→ (N) Tags
Photo (N) ←→ (1) Category
```

---

## Deployment

### Docker Production Deployment

#### 1. Environment Setup
```bash
# Production environment variables
export DJANGO_SECRET_KEY="production-secret-key"
export DEBUG=False
export DJANGO_ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"
export DB_PASSWORD="secure-db-password"
export CLOUD_NAME="production-cloudinary-name"
export API_KEY="production-api-key"
export API_SECRET="production-api-secret"
export EMAIL_HOST_PASSWORD="production-email-password"
```

#### 2. Production Docker Compose
```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: naturelens_prod
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
    volumes:
      - es_data:/usr/share/elasticsearch/data
    restart: unless-stopped

  django_app:
    build: 
      context: ./Backend
      target: production
    environment:
      - DEBUG=False
      - DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}
      - DJANGO_ALLOWED_HOSTS=${DJANGO_ALLOWED_HOSTS}
    volumes:
      - static_volume:/app/static
      - media_volume:/app/media
    depends_on:
      - db
      - redis
      - elasticsearch
    restart: unless-stopped

  angular_app:
    build:
      context: ./Frontend
      target: production
    restart: unless-stopped

  nginx:
    build: ./nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - static_volume:/app/static
      - media_volume:/app/media
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - django_app
      - angular_app
    restart: unless-stopped

volumes:
  mysql_data:
  es_data:
  static_volume:
  media_volume:
```

#### 3. Production Dockerfile (Backend)
```dockerfile
# Backend/Dockerfile
FROM python:3.11-slim as base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Development stage
FROM base as development
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Production stage
FROM base as production
COPY . .
RUN python manage.py collectstatic --noinput
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "Backend.wsgi:application"]
```

#### 4. Production Dockerfile (Frontend)
```dockerfile
# Frontend/Dockerfile
FROM node:18-alpine as base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Development stage
FROM base as development
COPY . .
EXPOSE 4200
CMD ["npm", "start"]

# Production stage
FROM base as build
COPY . .
RUN npm run build

FROM nginx:alpine as production
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Cloud Deployment Options

#### 1. AWS Deployment
- **ECS/Fargate**: Container orchestration
- **RDS**: Managed MySQL database
- **ElastiCache**: Managed Redis
- **Amazon Elasticsearch**: Managed search service
- **S3**: Static file storage (alternative to Cloudinary)
- **CloudFront**: CDN for static assets
- **Route 53**: DNS management
- **Certificate Manager**: SSL certificates

#### 2. Google Cloud Deployment
- **Cloud Run**: Container hosting
- **Cloud SQL**: Managed database
- **Memorystore**: Managed Redis
- **Elasticsearch Service**: Managed search
- **Cloud Storage**: File storage
- **Cloud CDN**: Content delivery
- **Cloud Load Balancing**: Traffic distribution

#### 3. Digital Ocean Deployment
- **App Platform**: Full-stack hosting
- **Managed Databases**: MySQL and Redis
- **Spaces**: Object storage
- **Load Balancers**: Traffic distribution

### SSL Certificate Setup
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Health Monitoring
```yaml
# Add to docker-compose.prod.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

## Development Guidelines

### Code Style and Standards

#### Python (Django)
- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Write docstrings for all functions and classes
- Use type hints where appropriate
- Keep functions small and focused
- Use Django's built-in features and conventions

```python
# Example: Good Django model
from django.db import models
from typing import Optional

class Photo(models.Model):
    """Model for storing photo information."""
    
    title: str = models.CharField(max_length=100, help_text="Photo title")
    description: Optional[str] = models.TextField(blank=True, null=True)
    
    def __str__(self) -> str:
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Photos'
```

#### TypeScript (Angular)
- Use TypeScript strict mode
- Define interfaces for all data structures
- Use meaningful component and service names
- Follow Angular style guide conventions
- Implement proper error handling
- Use reactive programming patterns with RxJS

```typescript
// Example: Good Angular service
export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(private http: HttpClient) {}

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>('/api/photos/').pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
```

### Git Workflow

#### Branch Strategy
```bash
# Main branches
main          # Production-ready code
develop       # Integration branch for features

# Feature branches
feature/user-authentication
feature/photo-upload
feature/social-interactions

# Release branches
release/v1.0.0

# Hotfix branches
hotfix/critical-bug-fix
```

#### Commit Message Convention
```bash
# Format: type(scope): description

# Examples:
feat(auth): add JWT token refresh mechanism
fix(photos): resolve image upload validation issue
docs(readme): update installation instructions
style(frontend): fix component styling issues
refactor(api): optimize photo query performance
test(social): add unit tests for like functionality
```

### Testing Strategy

#### Backend Testing
```python
# tests/test_models.py
from django.test import TestCase
from Apps.User.models import User, UserProfile

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
    
    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.is_active)
    
    def test_user_profile_creation(self):
        profile = UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )
        self.assertEqual(profile.user, self.user)
        self.assertEqual(profile.bio, 'Test bio')

# tests/test_views.py
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from Apps.User.models import User

class PhotoAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_get_photos(self):
        url = reverse('photo-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_photo_unauthorized(self):
        self.client.force_authenticate(user=None)
        url = reverse('photo-list')
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
```

#### Frontend Testing
```typescript
// photo.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PhotoService]
    });
    service = TestBed.inject(PhotoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch photos', () => {
    const mockPhotos = [
      { id: '1', title: 'Test Photo', description: 'Test Description' }
    ];

    service.getPhotos().subscribe(photos => {
      expect(photos.length).toBe(1);
      expect(photos[0].title).toBe('Test Photo');
    });

    const req = httpMock.expectOne('/api/photos/');
    expect(req.request.method).toBe('GET');
    req.flush(mockPhotos);
  });

  afterEach(() => {
    httpMock.verify();
  });
});

// photo.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoComponent } from './photo.component';
import { PhotoService } from '../services/photo.service';
import { of } from 'rxjs';

describe('PhotoComponent', () => {
  let component: PhotoComponent;
  let fixture: ComponentFixture<PhotoComponent>;
  let photoService: jasmine.SpyObj<PhotoService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('PhotoService', ['getPhotos']);

    TestBed.configureTestingModule({
      declarations: [PhotoComponent],
      providers: [{ provide: PhotoService, useValue: spy }]
    });

    fixture = TestBed.createComponent(PhotoComponent);
    component = fixture.componentInstance;
    photoService = TestBed.inject(PhotoService) as jasmine.SpyObj<PhotoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photos on init', () => {
    const mockPhotos = [{ id: '1', title: 'Test Photo' }];
    photoService.getPhotos.and.returnValue(of(mockPhotos));

    component.ngOnInit();

    expect(photoService.getPhotos).toHaveBeenCalled();
    expect(component.photos).toEqual(mockPhotos);
  });
});
```

### Performance Optimization

#### Backend Optimization
```python
# Use select_related and prefetch_related for database optimization
class PhotoViewSet(ModelViewSet):
    def get_queryset(self):
        return Photo.objects.select_related('category', 'uploaded_by')\
                          .prefetch_related('tags', 'likes')\
                          .annotate(
                              likes_count=Count('likes'),
                              comments_count=Count('comments')
                          )

# Use caching for frequently accessed data
from django.core.cache import cache

def get_popular_photos():
    cache_key = 'popular_photos'
    photos = cache.get(cache_key)
    if not photos:
        photos = Photo.objects.filter(
            likes__gte=10
        ).order_by('-likes_count')[:20]
        cache.set(cache_key, photos, 300)  # Cache for 5 minutes
    return photos
```

#### Frontend Optimization
```typescript
// Use OnPush change detection strategy
@Component({
  selector: 'app-photo-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoListComponent {
  // Implementation
}

// Implement lazy loading for images
@Component({
  template: `
    <img [src]="photo.thumbnailUrl" 
         [attr.data-src]="photo.imageUrl"
         loading="lazy"
         (load)="onImageLoad($event)">
  `
})
export class PhotoComponent {
  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    // Replace with full-size image when needed
  }
}
```

### Security Best Practices

#### Backend Security
```python
# settings.py - Security configurations
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
X_FRAME_OPTIONS = 'DENY'

# Custom permissions
from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return obj.uploaded_by == request.user

# Input validation
from django.core.exceptions import ValidationError

def validate_image_size(image):
    if image.size > 10 * 1024 * 1024:  # 10MB limit
        raise ValidationError('Image size cannot exceed 10MB')
```

#### Frontend Security
```typescript
// HTTP interceptor for security headers
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const secureReq = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return next.handle(secureReq);
  }
}

// Sanitize user input
import { DomSanitizer } from '@angular/platform-browser';

@Component({})
export class CommentComponent {
  constructor(private sanitizer: DomSanitizer) {}

  sanitizeComment(comment: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, comment) || '';
  }
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues
**Problem**: `django.db.utils.OperationalError: (2002, "Can't connect to MySQL server")`

**Solutions**:
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Check Docker container status
docker ps
docker logs mysql

# Verify environment variables
echo $DB_HOST $DB_PORT $DB_NAME $DB_USER

# Test database connection
mysql -h localhost -P 3306 -u root -p naturelens_db
```

#### 2. Redis Connection Issues
**Problem**: `redis.exceptions.ConnectionError: Error connecting to Redis`

**Solutions**:
```bash
# Check Redis status
docker logs redis
redis-cli ping

# Check Redis configuration in settings.py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",  # Use service name in Docker
    }
}
```

#### 3. Elasticsearch Issues
**Problem**: `elasticsearch.exceptions.ConnectionError`

**Solutions**:
```bash
# Check Elasticsearch status
curl -X GET "localhost:9200/_cluster/health?pretty"

# Check authentication
curl -u elastic:elastic_search -X GET "https://localhost:9200/_cluster/health?pretty" -k

# Rebuild search index
docker exec django_cont python manage.py search_index --rebuild
```

#### 4. Cloudinary Upload Issues
**Problem**: `CloudinaryException: Must supply api_key`

**Solutions**:
```bash
# Verify environment variables
echo $CLOUD_NAME $API_KEY $API_SECRET

# Test Cloudinary configuration
python manage.py shell
>>> import cloudinary
>>> cloudinary.config()
>>> print(cloudinary.config().cloud_name)
```

#### 5. Frontend Build Issues
**Problem**: `Error: Cannot resolve module`

**Solutions**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Angular version compatibility
ng version

# Update dependencies
npm update
```

#### 6. CORS Issues
**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
```python
# Update Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

CORS_ALLOW_CREDENTIALS = True
```

#### 7. JWT Token Issues
**Problem**: `Token is invalid or expired`

**Solutions**:
```typescript
// Implement token refresh mechanism
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => next.handle(this.addToken(req)))
          );
        }
        return throwError(error);
      })
    );
  }
}
```

### Performance Issues

#### 1. Slow Database Queries
**Diagnosis**:
```python
# Enable query logging
LOGGING = {
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
        }
    }
}
```

**Solutions**:
```python
# Add database indexes
class Photo(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['created_at', 'category']),
        ]
```

#### 2. Large Image Loading
**Solutions**:
```typescript
// Implement progressive loading
@Component({
  template: `
    <img [src]="thumbnailUrl" 
         [class.loaded]="imageLoaded"
         (load)="onImageLoad()">
  `
})
export class PhotoComponent {
  onImageLoad() {
    this.imageLoaded = true;
  }
}
```

### Debugging Tools

#### 1. Backend Debugging
```python
# Django Debug Toolbar configuration
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1']

# Use Django shell for testing
python manage.py shell_plus
>>> from Apps.Photos.models import Photo
>>> Photo.objects.all().explain()
```

#### 2. Frontend Debugging
```typescript
// Enable Angular DevTools
import { environment } from '../environments/environment';

if (!environment.production) {
  console.log('Development mode enabled');
}

// Use Angular Augury browser extension
// Use Redux DevTools for state management
```

---

## API Rate Limiting

### Django Rate Limiting
```python
# Install django-ratelimit
pip install django-ratelimit

# Apply rate limiting to views
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='100/h', method='POST')
def upload_photo(request):
    # Photo upload logic
    pass

# Global rate limiting in settings.py
RATELIMIT_ENABLE = True
RATELIMIT_USE_CACHE = 'default'
```

---

## Monitoring and Logging

### Application Monitoring
```python
# settings.py - Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/naturelens.log',
            'maxBytes': 1024*1024*15,  # 15MB
            'backupCount': 10,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
        'Apps': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

### Health Check Endpoints
```python
# Add health check view
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Check Redis connection
        from django.core.cache import cache
        cache.set('health_check', 'ok', 30)
        
        return JsonResponse({'status': 'healthy'})
    except Exception as e:
        return JsonResponse({'status': 'unhealthy', 'error': str(e)}, status=500)
```

---

## Backup and Recovery

### Database Backup
```bash
# Create backup script
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
DB_NAME="naturelens_db"

# Create MySQL backup
docker exec mysql mysqldump -u root -proot $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
```

### Media Files Backup
```bash
# Backup media files (if not using Cloudinary)
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
tar -czf /backups/media_backup_$DATE.tar.gz ./mediafiles/
```

---

## Scaling Considerations

### Horizontal Scaling
```yaml
# docker-compose.scale.yml
version: "3.8"

services:
  django_app:
    deploy:
      replicas: 3
    depends_on:
      - db
      - redis
      - elasticsearch

  nginx:
    depends_on:
      - django_app
    volumes:
      - ./nginx/load_balancer.conf:/etc/nginx/nginx.conf
```

### Load Balancer Configuration
```nginx
# nginx/load_balancer.conf
upstream django_backend {
    server django_app_1:8000;
    server django_app_2:8000;
    server django_app_3:8000;
}

server {
    listen 80;
    
    location /api/ {
        proxy_pass http://django_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Contributing Guidelines

### Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Write tests for your changes
5. Ensure all tests pass: `python manage.py test` and `ng test`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Create a Pull Request with detailed description

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Database migrations are reversible

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact and Support

### Project Maintainer
- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [your-github-username]

### Getting Help
1. Check this documentation first
2. Search existing [GitHub Issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed description
4. Join our community discussions

### Reporting Bugs
When reporting bugs, please include:
- Operating system and version
- Python and Node.js versions
- Steps to reproduce the issue
- Expected vs actual behavior
- Error logs and screenshots

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- User authentication and profiles
- Photo upload and management
- Social interactions (likes, comments)
- Search functionality
- Docker deployment support

### Planned Features (v1.1.0)
- Real-time notifications
- Advanced photo editing
- Mobile app development
- AI-powered photo tagging
- Enhanced search filters
- User following system

---

*This documentation is continuously updated. Last updated: [Current Date]*