# Naturelens Project

Naturelens is a full-stack web application designed for nature photography enthusiasts. It allows users to upload, share, and interact with nature photos, providing a social platform with modern features and a responsive design.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Key Components](#key-components)
- [Development Notes](#development-notes)
- [Contact](#contact)

---

## Project Structure

```
Naturelens/
├── Backend/         # Django backend (APIs, business logic)
│   ├── Apps/       # Django apps (Mail, Notification, Photos, etc.)
│   ├── Backend/    # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── Frontend/        # Angular frontend (UI, SPA)
│   ├── src/
│   ├── angular.json
│   └── package.json
├── mediafiles/      # Uploaded media files
├── .env             # Environment variables
├── .gitignore
└── Readme.md        # Project documentation
```

---

## Features

- **User Authentication:** Secure registration, login, and JWT-based authentication.
- **Photo Upload & Gallery:** Upload images/videos, view in a responsive masonry grid.
- **Social Interactions:** Like, comment, and save photos; follow other users.
- **Profile Management:** Edit profile, upload avatar, view personal and saved posts.
- **Admin Panel:** Django admin for backend management.
- **Notifications & Email:** Real-time notifications and email support.
- **Search:** Elasticsearch integration for fast photo/user search.
- **Performance:** Redis caching and Docker support for scalable deployment.

---

## Tech Stack

- **Backend:** Django, Django REST Framework, PostgreSQL, Redis, Elasticsearch, Cloudinary
- **Frontend:** Angular, TypeScript, RxJS, SCSS
- **DevOps:** Docker, Docker Compose, Nginx (optional)
- **Other:** JWT, REST API, Responsive Design

---

## Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- Docker & Docker Compose (optional, for containerized setup)
- PostgreSQL, Redis, Elasticsearch (if running locally)

### Backend

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your settings
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd Frontend
npm install
ng serve
```

### Docker (Full Stack)

```bash
docker-compose up --build
```

---

## Usage

- Access the frontend at `http://localhost:4200`
- API endpoints available at `http://localhost:8000/api/`
- Admin panel at `http://localhost:8000/admin/`

---

## Key Components

- **Backend/Apps/Photos:** Handles photo uploads, storage, and retrieval.
- **Backend/Apps/Notification:** Manages user notifications.
- **Frontend/src/app/components:** Angular components for dashboard, posts, explore, etc.
- **Frontend/src/app/services:** API integration and state management.

---

## Development Notes

- Environment variables are managed via `.env` files in both backend and frontend.
- Media files are stored in `mediafiles/` or via Cloudinary (configurable).
- The project is modular and can be extended with new features easily.
- For demo data, see `Frontend/src/app/inserDomyData.ts`.

---

## Contact

For questions or contributions, please contact the project maintainer.

---
