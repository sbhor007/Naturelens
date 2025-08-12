# Naturelens Deployment Guide

This comprehensive guide covers deploying Naturelens in various environments, from development to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Development Deployment](#development-deployment)
4. [Production Deployment](#production-deployment)
5. [Cloud Deployment](#cloud-deployment)
6. [Docker Deployment](#docker-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- Network: 1 Gbps

**Recommended for Production:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 100GB+ SSD
- Network: 1 Gbps+

### Software Dependencies

**Required:**
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+

**Optional (for manual deployment):**
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Redis 6.2+
- Elasticsearch 8.0+
- Nginx 1.20+

### External Services

**Required:**
- Cloudinary account (for media storage)
- Email provider (Gmail or SMTP server)

**Optional:**
- SSL certificate provider (Let's Encrypt recommended)
- CDN service (CloudFlare, AWS CloudFront)
- Monitoring service (New Relic, DataDog)

---

## Environment Variables

### Backend Environment Variables

Create `Backend/.env` file with the following variables:

```env
# Django Configuration
DJANGO_SECRET_KEY=your-super-secret-key-change-in-production
DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,localhost,127.0.0.1
DJANGO_CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database Configuration
DB_ENGINE=django.db.backends.mysql
DB_NAME=naturelens_prod
DB_USER=naturelens_user
DB_PASSWORD=secure-database-password
DB_HOST=mysql
DB_PORT=3306

# Redis Configuration
REDIS_URL=redis://redis:6379/1

# Elasticsearch Configuration
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your-elasticsearch-password
ELASTICSEARCH_HOST=elasticsearch:9200

# Cloudinary Configuration (Media Storage)
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Security
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Logging
LOG_LEVEL=INFO
LOG_FILE_MAX_SIZE=50MB
LOG_BACKUP_COUNT=5
```

### Frontend Environment Variables

Create `Frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  baseAPI: 'https://api.yourdomain.com/api/',
  websocketURL: 'wss://api.yourdomain.com/ws/',
  cloudinaryCloudName: 'your-cloudinary-cloud-name',
  googleAnalyticsId: 'GA-XXXXXXXX-X'
};
```

---

## Development Deployment

### Quick Start with Docker

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-repo/naturelens.git
   cd naturelens
   ```

2. **Setup Environment**
   ```bash
   cp Backend/.env.example Backend/.env
   # Edit Backend/.env with your configuration
   ```

3. **Start Development Stack**
   ```bash
   docker-compose up --build
   ```

4. **Initialize Database**
   ```bash
   # Wait for services to be healthy, then:
   docker exec django_cont python manage.py migrate
   docker exec django_cont python manage.py createsuperuser
   docker exec django_cont python manage.py collectstatic --noinput
   ```

5. **Access Application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

### Manual Development Setup

#### Backend Setup

```bash
cd Backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py migrate
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

#### Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
ng serve --host 0.0.0.0 --port 4200
```

---

## Production Deployment

### Production Docker Setup

1. **Create Production Environment**
   ```bash
   # Create production directory
   mkdir /opt/naturelens
   cd /opt/naturelens

   # Clone repository
   git clone https://github.com/your-repo/naturelens.git .
   ```

2. **Configure Production Environment**
   ```bash
   # Copy and edit production environment
   cp Backend/.env.example Backend/.env.prod
   
   # Edit with production values
   nano Backend/.env.prod
   ```

3. **Create Production Docker Compose**
   ```yaml
   # docker-compose.prod.yml
   version: "3.8"

   services:
     mysql:
       image: mysql:8.0
       container_name: naturelens_mysql
       environment:
         MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
         MYSQL_DATABASE: ${DB_NAME}
         MYSQL_USER: ${DB_USER}
         MYSQL_PASSWORD: ${DB_PASSWORD}
       volumes:
         - mysql_data:/var/lib/mysql
         - ./mysql/my.cnf:/etc/mysql/conf.d/custom.cnf
       ports:
         - "3306:3306"
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${DB_PASSWORD}"]
         interval: 30s
         timeout: 10s
         retries: 3

     redis:
       image: redis:7-alpine
       container_name: naturelens_redis
       volumes:
         - redis_data:/data
         - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
       command: redis-server /usr/local/etc/redis/redis.conf
       ports:
         - "6379:6379"
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "redis-cli", "ping"]
         interval: 30s
         timeout: 10s
         retries: 3

     elasticsearch:
       image: elasticsearch:8.11.0
       container_name: naturelens_elasticsearch
       environment:
         - discovery.type=single-node
         - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
         - xpack.security.enabled=true
         - xpack.security.http.ssl.enabled=false
       volumes:
         - elasticsearch_data:/usr/share/elasticsearch/data
       ports:
         - "9200:9200"
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-u", "elastic:${ELASTIC_PASSWORD}", "-f", "http://localhost:9200/_cluster/health"]
         interval: 30s
         timeout: 10s
         retries: 3

     django:
       build:
         context: ./Backend
         dockerfile: Dockerfile.prod
       container_name: naturelens_django
       env_file:
         - ./Backend/.env.prod
       volumes:
         - static_volume:/app/static
         - media_volume:/app/media
         - ./logs:/app/logs
       depends_on:
         mysql:
           condition: service_healthy
         redis:
           condition: service_healthy
         elasticsearch:
           condition: service_healthy
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:8000/api/health/"]
         interval: 30s
         timeout: 10s
         retries: 3

     angular:
       build:
         context: ./Frontend
         dockerfile: Dockerfile.prod
       container_name: naturelens_angular
       restart: unless-stopped

     nginx:
       build:
         context: ./nginx
         dockerfile: Dockerfile.prod
       container_name: naturelens_nginx
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - static_volume:/var/www/static
         - media_volume:/var/www/media
         - ./nginx/ssl:/etc/nginx/ssl
         - ./nginx/logs:/var/log/nginx
       depends_on:
         django:
           condition: service_healthy
         angular:
           condition: service_started
       restart: unless-stopped

   volumes:
     mysql_data:
     redis_data:
     elasticsearch_data:
     static_volume:
     media_volume:

   networks:
     default:
       name: naturelens_network
   ```

4. **Production Dockerfiles**

   **Backend Production Dockerfile:**
   ```dockerfile
   # Backend/Dockerfile.prod
   FROM python:3.11-slim as base

   # Set environment variables
   ENV PYTHONDONTWRITEBYTECODE=1
   ENV PYTHONUNBUFFERED=1
   ENV DEBIAN_FRONTEND=noninteractive

   # Install system dependencies
   RUN apt-get update \
       && apt-get install -y --no-install-recommends \
           build-essential \
           default-libmysqlclient-dev \
           pkg-config \
           curl \
       && rm -rf /var/lib/apt/lists/*

   # Create app user
   RUN groupadd -r app && useradd -r -g app app

   # Set work directory
   WORKDIR /app

   # Install Python dependencies
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   # Copy project
   COPY . .

   # Create necessary directories
   RUN mkdir -p /app/static /app/media /app/logs
   RUN chown -R app:app /app

   # Collect static files
   RUN python manage.py collectstatic --noinput

   # Switch to app user
   USER app

   # Expose port
   EXPOSE 8000

   # Health check
   HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
     CMD curl -f http://localhost:8000/api/health/ || exit 1

   # Run gunicorn
   CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120", "Backend.wsgi:application"]
   ```

   **Frontend Production Dockerfile:**
   ```dockerfile
   # Frontend/Dockerfile.prod
   FROM node:18-alpine as builder

   WORKDIR /app

   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production

   # Copy source code
   COPY . .

   # Build application
   RUN npm run build --prod

   # Production stage
   FROM nginx:alpine as production

   # Copy custom nginx config
   COPY nginx.conf /etc/nginx/conf.d/default.conf

   # Copy built application
   COPY --from=builder /app/dist/frontend /usr/share/nginx/html

   # Add health check
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD curl -f http://localhost:80 || exit 1

   # Expose port
   EXPOSE 80

   # Start nginx
   CMD ["nginx", "-g", "daemon off;"]
   ```

5. **Deploy Production Stack**
   ```bash
   # Build and start production stack
   docker-compose -f docker-compose.prod.yml up --build -d

   # Initialize database
   docker exec naturelens_django python manage.py migrate
   docker exec naturelens_django python manage.py createsuperuser

   # Create search index
   docker exec naturelens_django python manage.py search_index --rebuild
   ```

### Nginx Configuration

Create `nginx/nginx.prod.conf`:

```nginx
upstream django_backend {
    server django:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Client max body size (for file uploads)
    client_max_body_size 50M;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://django_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Admin routes
    location /admin/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://django_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /var/www/media/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Frontend application
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Health check endpoint
    location /health/ {
        access_log off;
        proxy_pass http://django_backend;
    }
}
```

### SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot certonly --webroot -w /var/www/html -d yourdomain.com -d www.yourdomain.com

# Copy certificates to nginx volume
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet --post-hook "docker restart naturelens_nginx"
```

---

## Cloud Deployment

### AWS Deployment

#### Using ECS with Fargate

1. **Create ECR Repositories**
   ```bash
   aws ecr create-repository --repository-name naturelens/backend
   aws ecr create-repository --repository-name naturelens/frontend
   aws ecr create-repository --repository-name naturelens/nginx
   ```

2. **Build and Push Images**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Build and push backend
   docker build -t naturelens/backend -f Backend/Dockerfile.prod Backend/
   docker tag naturelens/backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/naturelens/backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/naturelens/backend:latest

   # Build and push frontend
   docker build -t naturelens/frontend -f Frontend/Dockerfile.prod Frontend/
   docker tag naturelens/frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/naturelens/frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/naturelens/frontend:latest
   ```

3. **Create ECS Task Definition**
   ```json
   {
     "family": "naturelens",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "1024",
     "memory": "2048",
     "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "django",
         "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/naturelens/backend:latest",
         "portMappings": [
           {
             "containerPort": 8000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "DEBUG",
             "value": "False"
           }
         ],
         "secrets": [
           {
             "name": "DJANGO_SECRET_KEY",
             "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:naturelens/django-secret"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/naturelens",
             "awslogs-region": "us-east-1",
             "awslogs-stream-prefix": "django"
           }
         }
       }
     ]
   }
   ```

4. **Create RDS Database**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier naturelens-mysql \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --master-username naturelens \
     --master-user-password YourSecurePassword \
     --allocated-storage 20 \
     --vpc-security-group-ids sg-xxxxxxxx
   ```

5. **Create ElastiCache Redis**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id naturelens-redis \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --num-cache-nodes 1
   ```

### Google Cloud Platform Deployment

#### Using Cloud Run

1. **Enable Required APIs**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable sql-component.googleapis.com
   gcloud services enable redis.googleapis.com
   ```

2. **Create Cloud SQL Instance**
   ```bash
   gcloud sql instances create naturelens-mysql \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

3. **Build and Deploy Backend**
   ```bash
   # Build image
   gcloud builds submit --tag gcr.io/PROJECT-ID/naturelens-backend Backend/

   # Deploy to Cloud Run
   gcloud run deploy naturelens-backend \
     --image gcr.io/PROJECT-ID/naturelens-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars DEBUG=False
   ```

### Digital Ocean Deployment

#### Using App Platform

1. **Create App Specification**
   ```yaml
   # .do/app.yaml
   name: naturelens
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/naturelens
       branch: main
     run_command: gunicorn --bind 0.0.0.0:8000 Backend.wsgi:application
     environment_slug: python
     instance_count: 1
     instance_size_slug: basic-xxs
     routes:
     - path: /api
     - path: /admin
     envs:
     - key: DEBUG
       value: "False"
     - key: DJANGO_SECRET_KEY
       value: your-secret-key
       type: SECRET
   
   databases:
   - name: db
     engine: MYSQL
     version: "8"
     size: basic-xs

   static_sites:
   - name: frontend
     source_dir: /Frontend
     github:
       repo: your-username/naturelens
       branch: main
     build_command: npm install && npm run build
     output_dir: /dist/frontend
   ```

2. **Deploy to App Platform**
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_naturelens
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
      
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: --health-cmd="redis-cli ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'

    - name: Install dependencies
      run: |
        cd Backend
        python -m pip install --upgrade pip
        pip install -r requirements.txt

    - name: Run tests
      run: |
        cd Backend
        python manage.py test
      env:
        DB_NAME: test_naturelens
        DB_USER: root
        DB_PASSWORD: root
        DB_HOST: localhost
        DB_PORT: 3306

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: Frontend/package-lock.json

    - name: Install frontend dependencies
      run: |
        cd Frontend
        npm ci

    - name: Run frontend tests
      run: |
        cd Frontend
        npm run test:ci

    - name: Build frontend
      run: |
        cd Frontend
        npm run build --prod

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta-backend
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/backend

    - name: Build and push Backend image
      uses: docker/build-push-action@v4
      with:
        context: ./Backend
        file: ./Backend/Dockerfile.prod
        push: true
        tags: ${{ steps.meta-backend.outputs.tags }}
        labels: ${{ steps.meta-backend.outputs.labels }}

    - name: Extract metadata for Frontend
      id: meta-frontend
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend

    - name: Build and push Frontend image
      uses: docker/build-push-action@v4
      with:
        context: ./Frontend
        file: ./Frontend/Dockerfile.prod
        push: true
        tags: ${{ steps.meta-frontend.outputs.tags }}
        labels: ${{ steps.meta-frontend.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to production server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.PROD_HOST }}
        username: ${{ secrets.PROD_USER }}
        key: ${{ secrets.PROD_SSH_KEY }}
        script: |
          cd /opt/naturelens
          docker-compose -f docker-compose.prod.yml pull
          docker-compose -f docker-compose.prod.yml up -d
          docker system prune -f
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_REGISTRY: $CI_REGISTRY
  DOCKER_IMAGE_BACKEND: $CI_REGISTRY_IMAGE/backend
  DOCKER_IMAGE_FRONTEND: $CI_REGISTRY_IMAGE/frontend

test:
  stage: test
  image: python:3.11
  services:
    - mysql:8.0
    - redis:7
  variables:
    MYSQL_ROOT_PASSWORD: root
    MYSQL_DATABASE: test_naturelens
    DB_NAME: test_naturelens
    DB_USER: root
    DB_PASSWORD: root
    DB_HOST: mysql
  script:
    - cd Backend
    - pip install -r requirements.txt
    - python manage.py test
  coverage: '/TOTAL.+ ([0-9]{1,3}%)/'

test_frontend:
  stage: test
  image: node:18
  script:
    - cd Frontend
    - npm ci
    - npm run test:ci
    - npm run build --prod

build_backend:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $DOCKER_IMAGE_BACKEND:$CI_COMMIT_SHA -f Backend/Dockerfile.prod Backend/
    - docker push $DOCKER_IMAGE_BACKEND:$CI_COMMIT_SHA
  only:
    - main

build_frontend:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $DOCKER_IMAGE_FRONTEND:$CI_COMMIT_SHA -f Frontend/Dockerfile.prod Frontend/
    - docker push $DOCKER_IMAGE_FRONTEND:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $PROD_HOST >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
  script:
    - ssh $PROD_USER@$PROD_HOST "cd /opt/naturelens && docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d"
  only:
    - main
  when: manual
```

---

## Monitoring and Logging

### Application Monitoring

#### Prometheus + Grafana Setup

1. **Add monitoring to docker-compose.prod.yml**
   ```yaml
   services:
     prometheus:
       image: prom/prometheus:latest
       container_name: naturelens_prometheus
       volumes:
         - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
         - prometheus_data:/prometheus
       ports:
         - "9090:9090"
       restart: unless-stopped

     grafana:
       image: grafana/grafana:latest
       container_name: naturelens_grafana
       environment:
         - GF_SECURITY_ADMIN_PASSWORD=admin
       volumes:
         - grafana_data:/var/lib/grafana
         - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
         - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
       ports:
         - "3000:3000"
       restart: unless-stopped

   volumes:
     prometheus_data:
     grafana_data:
   ```

2. **Configure Prometheus**
   ```yaml
   # monitoring/prometheus.yml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'django'
       static_configs:
         - targets: ['django:8000']
       metrics_path: /metrics/

     - job_name: 'nginx'
       static_configs:
         - targets: ['nginx:80']

     - job_name: 'mysql'
       static_configs:
         - targets: ['mysql:9104']

     - job_name: 'redis'
       static_configs:
         - targets: ['redis:9121']
   ```

### Log Management

#### ELK Stack Setup

1. **Add ELK to docker-compose.prod.yml**
   ```yaml
   services:
     elasticsearch:
       # Already configured above for search
       
     logstash:
       image: logstash:8.11.0
       container_name: naturelens_logstash
       volumes:
         - ./monitoring/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
       depends_on:
         - elasticsearch
       restart: unless-stopped

     kibana:
       image: kibana:8.11.0
       container_name: naturelens_kibana
       environment:
         - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
       ports:
         - "5601:5601"
       depends_on:
         - elasticsearch
       restart: unless-stopped
   ```

2. **Configure Logstash**
   ```ruby
   # monitoring/logstash/logstash.conf
   input {
     file {
       path => "/app/logs/*.log"
       start_position => "beginning"
       codec => json
     }
   }

   filter {
     if [logger] {
       mutate {
         add_field => { "log_level" => "%{level}" }
       }
     }
   }

   output {
     elasticsearch {
       hosts => ["elasticsearch:9200"]
       index => "naturelens-logs-%{+YYYY.MM.dd}"
     }
   }
   ```

### Health Check Script

Create `scripts/health_check.sh`:

```bash
#!/bin/bash

# Naturelens Health Check Script

echo "Checking Naturelens services..."

# Check Django backend
echo -n "Django API: "
if curl -sf http://localhost:8000/api/health/ > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    exit 1
fi

# Check Angular frontend
echo -n "Angular Frontend: "
if curl -sf http://localhost:4200 > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    exit 1
fi

# Check MySQL database
echo -n "MySQL Database: "
if docker exec naturelens_mysql mysqladmin ping -h localhost --silent; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    exit 1
fi

# Check Redis cache
echo -n "Redis Cache: "
if docker exec naturelens_redis redis-cli ping | grep -q PONG; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    exit 1
fi

# Check Elasticsearch
echo -n "Elasticsearch: "
if curl -sf http://localhost:9200/_cluster/health > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    exit 1
fi

echo "All services are healthy! ✅"
```

---

## Backup and Recovery

### Automated Backup Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash

# Naturelens Backup Script

BACKUP_DIR="/backups/naturelens"
DATE=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="naturelens_mysql"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "Starting backup process..."

# Backup MySQL database
echo "Backing up MySQL database..."
docker exec $DB_CONTAINER mysqldump -u root -p$MYSQL_ROOT_PASSWORD naturelens_prod > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Backup media files (if using local storage)
echo "Backing up media files..."
if [ -d "./mediafiles" ]; then
    tar -czf $BACKUP_DIR/media_backup_$DATE.tar.gz ./mediafiles/
fi

# Backup application configuration
echo "Backing up configuration..."
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz ./Backend/.env.prod ./nginx/ ./monitoring/

# Upload to S3 (optional)
if [ -n "$AWS_S3_BUCKET" ]; then
    echo "Uploading backups to S3..."
    aws s3 sync $BACKUP_DIR s3://$AWS_S3_BUCKET/backups/
fi

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed successfully!"
```

### Recovery Procedures

1. **Database Recovery**
   ```bash
   # Stop the application
   docker-compose -f docker-compose.prod.yml down
   
   # Start only the database
   docker-compose -f docker-compose.prod.yml up -d mysql
   
   # Restore database
   gunzip < /backups/naturelens/db_backup_YYYYMMDD_HHMMSS.sql.gz | \
   docker exec -i naturelens_mysql mysql -u root -p$MYSQL_ROOT_PASSWORD naturelens_prod
   
   # Start all services
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Full System Recovery**
   ```bash
   # Clone repository
   git clone https://github.com/your-repo/naturelens.git /opt/naturelens
   cd /opt/naturelens
   
   # Restore configuration
   tar -xzf /backups/naturelens/config_backup_YYYYMMDD_HHMMSS.tar.gz
   
   # Restore media files
   tar -xzf /backups/naturelens/media_backup_YYYYMMDD_HHMMSS.tar.gz
   
   # Start services
   docker-compose -f docker-compose.prod.yml up -d
   
   # Restore database (as above)
   ```

---

## Performance Optimization

### Database Optimization

1. **MySQL Configuration**
   ```ini
   # mysql/my.cnf
   [mysqld]
   # InnoDB settings
   innodb_buffer_pool_size = 1G
   innodb_log_file_size = 256M
   innodb_flush_log_at_trx_commit = 2
   innodb_flush_method = O_DIRECT
   
   # Query cache
   query_cache_type = 1
   query_cache_size = 128M
   
   # Connection settings
   max_connections = 200
   max_connect_errors = 1000000
   
   # Slow query log
   slow_query_log = 1
   slow_query_log_file = /var/log/mysql/mysql-slow.log
   long_query_time = 2
   ```

2. **Database Indexing**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_photo_created_at ON Photos_photo(created_at);
   CREATE INDEX idx_photo_category ON Photos_photo(category_id);
   CREATE INDEX idx_photolike_photo ON Social_photolike(photo_id);
   CREATE INDEX idx_comment_photo ON Social_comment(photo_id);
   ```

### Redis Configuration

```conf
# redis/redis.conf
# Memory management
maxmemory 512mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Network
timeout 300
tcp-keepalive 300

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
```

### Application Performance

1. **Django Settings Optimization**
   ```python
   # Backend/Backend/settings_prod.py
   
   # Database connection pooling
   DATABASES['default']['OPTIONS']['init_command'] = "SET sql_mode='STRICT_TRANS_TABLES'"
   DATABASES['default']['CONN_MAX_AGE'] = 60
   
   # Cache configuration
   CACHES = {
       'default': {
           'BACKEND': 'django_redis.cache.RedisCache',
           'LOCATION': 'redis://redis:6379/1',
           'OPTIONS': {
               'CLIENT_CLASS': 'django_redis.client.DefaultClient',
               'CONNECTION_POOL_KWARGS': {
                   'max_connections': 50,
                   'retry_on_timeout': True,
               }
           }
       }
   }
   
   # Session configuration
   SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
   SESSION_CACHE_ALIAS = 'default'
   ```

2. **Gunicorn Configuration**
   ```python
   # Backend/gunicorn.conf.py
   bind = "0.0.0.0:8000"
   workers = 4
   worker_class = "sync"
   worker_connections = 1000
   max_requests = 1000
   max_requests_jitter = 100
   timeout = 120
   keepalive = 5
   preload_app = True
   ```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
**Symptoms**: `OperationalError: (2002, "Can't connect to MySQL server")`

**Solutions**:
```bash
# Check MySQL container status
docker logs naturelens_mysql

# Verify network connectivity
docker exec naturelens_django ping mysql

# Check environment variables
docker exec naturelens_django env | grep DB_

# Restart MySQL with health check
docker-compose -f docker-compose.prod.yml restart mysql
```

#### 2. Redis Connection Issues
**Symptoms**: `ConnectionError: Error connecting to Redis`

**Solutions**:
```bash
# Check Redis container
docker logs naturelens_redis

# Test Redis connectivity
docker exec naturelens_redis redis-cli ping

# Check Redis configuration
docker exec naturelens_redis cat /usr/local/etc/redis/redis.conf
```

#### 3. High Memory Usage
**Symptoms**: Container killed due to OOM

**Solutions**:
```bash
# Monitor memory usage
docker stats

# Check Django memory usage
docker exec naturelens_django python manage.py shell -c "
import psutil
print(f'Memory usage: {psutil.virtual_memory().percent}%')
"

# Optimize Docker memory limits
docker-compose -f docker-compose.prod.yml up -d --memory=2g
```

#### 4. SSL Certificate Issues
**Symptoms**: SSL certificate errors or expired certificates

**Solutions**:
```bash
# Check certificate expiration
openssl x509 -in ./nginx/ssl/fullchain.pem -text -noout | grep "Not After"

# Renew Let's Encrypt certificates
certbot renew --dry-run
certbot renew

# Restart nginx with new certificates
docker restart naturelens_nginx
```

### Log Analysis

1. **Application Logs**
   ```bash
   # Django application logs
   docker logs naturelens_django --tail=100 -f
   
   # Nginx access logs
   docker exec naturelens_nginx tail -f /var/log/nginx/access.log
   
   # Nginx error logs
   docker exec naturelens_nginx tail -f /var/log/nginx/error.log
   ```

2. **System Monitoring**
   ```bash
   # Check disk usage
   df -h
   
   # Check memory usage
   free -h
   
   # Check CPU usage
   top
   
   # Check Docker system usage
   docker system df
   ```

### Performance Debugging

1. **Database Query Analysis**
   ```bash
   # Enable slow query log in MySQL
   docker exec naturelens_mysql mysql -u root -p -e "
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 1;
   "
   
   # Analyze slow queries
   docker exec naturelens_mysql mysqldumpslow /var/log/mysql/mysql-slow.log
   ```

2. **Redis Performance**
   ```bash
   # Monitor Redis performance
   docker exec naturelens_redis redis-cli --latency-history
   
   # Check Redis memory usage
   docker exec naturelens_redis redis-cli info memory
   ```

---

## Security Hardening

### Server Security

1. **Firewall Configuration**
   ```bash
   # Configure UFW firewall
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Docker Security**
   ```yaml
   # Security-focused docker-compose additions
   services:
     django:
       security_opt:
         - no-new-privileges:true
       cap_drop:
         - ALL
       cap_add:
         - CHOWN
         - SETGID
         - SETUID
       read_only: true
       tmpfs:
         - /tmp:rw,noexec,nosuid,size=100m
   ```

3. **SSL/TLS Configuration**
   ```nginx
   # Enhanced SSL configuration
   ssl_protocols TLSv1.3 TLSv1.2;
   ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
   ssl_prefer_server_ciphers off;
   ssl_session_timeout 10m;
   ssl_session_cache shared:SSL:10m;
   ssl_stapling on;
   ssl_stapling_verify on;
   
   # Security headers
   add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header X-Frame-Options "DENY" always;
   add_header X-XSS-Protection "1; mode=block" always;
   add_header Referrer-Policy "strict-origin-when-cross-origin" always;
   ```

### Application Security

1. **Django Security Settings**
   ```python
   # Backend/Backend/settings_prod.py
   
   # Security settings
   SECURE_BROWSER_XSS_FILTER = True
   SECURE_CONTENT_TYPE_NOSNIFF = True
   SECURE_HSTS_SECONDS = 31536000
   SECURE_HSTS_INCLUDE_SUBDOMAINS = True
   SECURE_HSTS_PRELOAD = True
   X_FRAME_OPTIONS = 'DENY'
   
   # CSRF protection
   CSRF_COOKIE_SECURE = True
   CSRF_COOKIE_HTTPONLY = True
   CSRF_TRUSTED_ORIGINS = ['https://yourdomain.com']
   
   # Session security
   SESSION_COOKIE_SECURE = True
   SESSION_COOKIE_HTTPONLY = True
   SESSION_COOKIE_AGE = 3600
   ```

---

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancer Configuration**
   ```nginx
   upstream django_backend {
       least_conn;
       server django_1:8000 weight=3;
       server django_2:8000 weight=3;
       server django_3:8000 weight=2;
   }
   
   # Health checks
   upstream django_backend {
       server django_1:8000 max_fails=3 fail_timeout=30s;
       server django_2:8000 max_fails=3 fail_timeout=30s;
   }
   ```

2. **Database Scaling**
   ```yaml
   # Master-slave MySQL setup
   services:
     mysql_master:
       image: mysql:8.0
       environment:
         MYSQL_REPLICATION_MODE: master
       
     mysql_slave:
       image: mysql:8.0
       environment:
         MYSQL_REPLICATION_MODE: slave
         MYSQL_MASTER_HOST: mysql_master
   ```

### Vertical Scaling

```yaml
# Resource allocation for production
services:
  django:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```

---

## Maintenance Procedures

### Regular Maintenance Tasks

1. **Weekly Maintenance Script**
   ```bash
   #!/bin/bash
   # weekly_maintenance.sh
   
   echo "Starting weekly maintenance..."
   
   # Update Docker images
   docker-compose -f docker-compose.prod.yml pull
   
   # Clean up Docker system
   docker system prune -f
   
   # Backup database
   ./scripts/backup.sh
   
   # Update SSL certificates
   certbot renew --quiet
   
   # Restart services with new images
   docker-compose -f docker-compose.prod.yml up -d
   
   echo "Weekly maintenance completed!"
   ```

2. **Database Maintenance**
   ```sql
   -- Monthly database optimization
   OPTIMIZE TABLE Photos_photo;
   OPTIMIZE TABLE Social_photolike;
   OPTIMIZE TABLE Social_comment;
   
   -- Update table statistics
   ANALYZE TABLE Photos_photo;
   ANALYZE TABLE User_user;
   ```

### Update Procedures

1. **Application Updates**
   ```bash
   # Update deployment script
   #!/bin/bash
   
   # Backup current version
   ./scripts/backup.sh
   
   # Pull latest changes
   git pull origin main
   
   # Build new images
   docker-compose -f docker-compose.prod.yml build
   
   # Rolling update
   docker-compose -f docker-compose.prod.yml up -d
   
   # Run migrations
   docker exec naturelens_django python manage.py migrate
   
   # Collect static files
   docker exec naturelens_django python manage.py collectstatic --noinput
   
   # Health check
   ./scripts/health_check.sh
   ```

---

## Contact and Support

For deployment support and questions:

- **Technical Issues**: Create an issue on GitHub
- **Security Concerns**: Email security@yourdomain.com
- **Documentation**: Check the main [DOCUMENTATION.md](DOCUMENTATION.md)

---

*Last updated: January 15, 2024*