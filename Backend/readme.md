# Naturelens Backend

This is the backend for the Naturelens project, built with Django and Django REST Framework. It supports user management, photo uploads, social features, email, and integrates with MySQL, Redis, Elasticsearch, and Cloudinary.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Docker Usage](#docker-usage)
- [Running Locally](#running-locally)
- [Useful Commands](#useful-commands)
- [Project Structure](#project-structure)

---

## Features

- User authentication (JWT)
- Photo management (Cloudinary)
- Social features
- Email support
- REST API
- Admin panel
- Elasticsearch integration
- Redis caching

---

## Requirements

- Python 3.11+
- pip
- MySQL 8+
- Redis
- Docker & Docker Compose (optional, recommended)

---

## Setup Instructions

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd Naturelens/Backend
```

### 2. Create and activate a virtual environment

```sh
python3 -m venv env
source env/bin/activate
```

### 3. Install dependencies

```sh
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file in the `Backend` directory (or use `.env.docker` for Docker). See [Environment Variables](#environment-variables) below.

### 5. Run migrations

```sh
python manage.py migrate
```

### 6. Create a superuser

```sh
python manage.py createsuperuser
```

### 7. Start the development server

```sh
python manage.py runserver
```

---

## Environment Variables

Set these variables in your `.env` or `.env.docker` file:

```env
# Django
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=naturelens_db
DB_USER=natureuser
DB_PASSWORD=naturepass
DB_HOST=localhost
DB_PORT=3307

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# Elasticsearch
ELASTIC_PASSWORD=your_elastic_password
DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost:8001,http://localhost:4200
```

---

## Docker Usage

1. Copy or edit `.env.docker` in the project root.
2. Build and start all services:

```sh
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:4200
- MySQL: localhost:3307

---

## Running Locally (without Docker)

1. Ensure MySQL and Redis are running.
2. Set up your `.env` file as above.
3. Follow the [Setup Instructions](#setup-instructions).

---

## Useful Commands

- Run tests: `python manage.py test`
- Collect static files: `python manage.py collectstatic`
- Access Django shell: `python manage.py shell`

---

## Project Structure

```
Backend/
  Apps/
    Mail/
    Photos/
    Social/
    User/
  Backend/
    settings.py
    urls.py
    ...
  manage.py
  requirements.txt
  Dockerfile
  readme.md
```

---

## Notes

- For production, set `DEBUG=False` and use a strong `DJANGO_SECRET_KEY`.
- Update allowed hosts and CORS settings as needed.
- Cloudinary and Elasticsearch credentials are required for full functionality.

---
