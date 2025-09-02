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

### Access  Postman Collection
- using link : `https://santosh-287858.postman.co/workspace/Santosh's-Workspace~5202420a-8540-4fab-8cd5-b3f95d1b46d3/collection/45409981-13a3d7f7-6548-4625-9c8b-4e9b97e9c9df?action=share&creator=45409981`
//- using-api : `https://api.postman.com/collections/45409981-13a3d7f7-6548-4625-9c8b-4e9b97e9c9df?access_key=`*/
