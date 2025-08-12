# Naturelens API Reference

This document provides comprehensive reference for all API endpoints in the Naturelens application.

## Base URL
```
Production: https://api.naturelens.com
Development: http://localhost:8000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "status": "success",
  "data": {},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Paginated Response
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/photos/photo/?limit=30&offset=30",
  "previous": null,
  "results": []
}
```

---

## Authentication Endpoints

### Register User
Creates a new user account.

**Endpoint**: `POST /user/register/`

**Request Body**:
```json
{
  "username": "photographer1",
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "username": "photographer1",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "date_joined": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid data
- `409 Conflict`: Username or email already exists

---

### User Login
Authenticates user and returns JWT tokens.

**Endpoint**: `POST /user/login/`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response**: `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "photographer1",
    "email": "user@example.com",
    "profile": {
      "id": "uuid-string",
      "profile_image": "https://res.cloudinary.com/...",
      "bio": "Nature photographer"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid credentials
- `401 Unauthorized`: Account inactive

---

### Token Refresh
Refreshes access token using refresh token.

**Endpoint**: `POST /user/token/refresh/`

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response**: `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### User Logout
Blacklists refresh token.

**Endpoint**: `POST /user/logout/`

**Headers**: `Authorization: Bearer <access-token>`

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response**: `200 OK`
```json
{
  "message": "Successfully logged out"
}
```

---

## User Profile Endpoints

### Get User Profile
Retrieves authenticated user's profile.

**Endpoint**: `GET /user/profile/`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `200 OK`
```json
{
  "id": "uuid-string",
  "user": {
    "id": 1,
    "username": "photographer1",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "profile_image": "https://res.cloudinary.com/...",
  "bio": "Passionate nature photographer capturing wildlife and landscapes",
  "photos_count": 25,
  "followers_count": 150,
  "following_count": 75
}
```

---

### Create User Profile
Creates profile for authenticated user.

**Endpoint**: `POST /user/profile/`

**Headers**: 
- `Authorization: Bearer <access-token>`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
```
profile_image: <file>
bio: "Nature photographer passionate about wildlife"
```

**Response**: `201 Created`
```json
{
  "id": "uuid-string",
  "profile_image": "https://res.cloudinary.com/...",
  "bio": "Nature photographer passionate about wildlife"
}
```

---

### Update User Profile
Updates existing user profile.

**Endpoint**: `PUT /user/profile/{profile-id}/`

**Headers**: 
- `Authorization: Bearer <access-token>`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
```
profile_image: <file>
bio: "Updated bio description"
```

**Response**: `200 OK`
```json
{
  "id": "uuid-string",
  "profile_image": "https://res.cloudinary.com/...",
  "bio": "Updated bio description"
}
```

---

## Photo Management Endpoints

### Upload Photo
Uploads a new photo.

**Endpoint**: `POST /photos/photo/`

**Headers**: 
- `Authorization: Bearer <access-token>`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
```
title: "Sunset at Malibu Beach"
description: "Beautiful golden hour captured at Malibu"
image: <file>
category: "uuid-of-category"
tags: ["sunset", "beach", "golden-hour"]
location: "Malibu, California"
```

**Response**: `201 Created`
```json
{
  "id": "photo-uuid",
  "title": "Sunset at Malibu Beach",
  "description": "Beautiful golden hour captured at Malibu",
  "image": "https://res.cloudinary.com/...",
  "category": {
    "id": "category-uuid",
    "name": "Landscapes"
  },
  "uploaded_by": {
    "id": 1,
    "username": "photographer1",
    "profile_image": "https://res.cloudinary.com/..."
  },
  "tags": [
    {"id": "tag-uuid-1", "name": "sunset"},
    {"id": "tag-uuid-2", "name": "beach"}
  ],
  "location": "Malibu, California",
  "created_at": "2024-01-15T18:30:00Z",
  "updated_at": "2024-01-15T18:30:00Z"
}
```

---

### Get All Photos
Retrieves paginated list of all photos.

**Endpoint**: `GET /photos/photo/`

**Headers**: `Authorization: Bearer <access-token>`

**Query Parameters**:
- `limit`: Number of photos per page (default: 30)
- `offset`: Starting position for pagination (default: 0)
- `category`: Filter by category ID
- `ordering`: Sort order (-created_at, title, etc.)

**Example**: `GET /photos/photo/?limit=20&offset=40&category=landscape-uuid&ordering=-created_at`

**Response**: `200 OK`
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/photos/photo/?limit=30&offset=30",
  "previous": null,
  "results": [
    {
      "id": "photo-uuid",
      "title": "Mountain Sunrise",
      "description": "Early morning light over the Rockies",
      "image": "https://res.cloudinary.com/...",
      "thumbnail": "https://res.cloudinary.com/.../c_thumb,w_300,h_300/",
      "category": {
        "id": "category-uuid",
        "name": "Landscapes"
      },
      "uploaded_by": {
        "id": 2,
        "username": "mountainphotographer",
        "profile_image": "https://res.cloudinary.com/..."
      },
      "tags": [
        {"name": "sunrise"},
        {"name": "mountains"}
      ],
      "location": "Rocky Mountains, CO",
      "created_at": "2024-01-15T06:00:00Z",
      "likes_count": 42,
      "comments_count": 15,
      "saves_count": 8,
      "is_liked": true,
      "is_saved": false
    }
  ]
}
```

---

### Get User's Photos
Retrieves photos uploaded by authenticated user.

**Endpoint**: `GET /photos/photo/user-photos/`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `200 OK` (Same format as Get All Photos)

---

### Get Single Photo
Retrieves details of a specific photo.

**Endpoint**: `GET /photos/photo/{photo-id}/`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `200 OK`
```json
{
  "id": "photo-uuid",
  "title": "Sunset at Malibu Beach",
  "description": "Beautiful golden hour captured at Malibu",
  "image": "https://res.cloudinary.com/...",
  "category": {
    "id": "category-uuid",
    "name": "Landscapes"
  },
  "uploaded_by": {
    "id": 1,
    "username": "photographer1",
    "profile_image": "https://res.cloudinary.com/...",
    "bio": "Nature photographer"
  },
  "tags": [
    {"id": "tag-uuid-1", "name": "sunset"},
    {"id": "tag-uuid-2", "name": "beach"}
  ],
  "location": "Malibu, California",
  "created_at": "2024-01-15T18:30:00Z",
  "updated_at": "2024-01-15T18:30:00Z",
  "likes_count": 25,
  "comments_count": 8,
  "saves_count": 12,
  "is_liked": true,
  "is_saved": false,
  "metadata": {
    "camera": "Canon EOS R5",
    "lens": "RF 24-70mm f/2.8L",
    "settings": "f/8, 1/125s, ISO 100"
  }
}
```

---

### Update Photo
Updates an existing photo (only by owner).

**Endpoint**: `PUT /photos/photo/{photo-id}/`

**Headers**: 
- `Authorization: Bearer <access-token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "location": "Updated location"
}
```

**Response**: `200 OK` (Updated photo object)

---

### Delete Photo
Deletes a photo (only by owner).

**Endpoint**: `DELETE /photos/photo/{photo-id}/`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `204 No Content`

---

## Categories and Tags

### Get All Categories
Retrieves all photo categories.

**Endpoint**: `GET /photos/category/`

**Response**: `200 OK`
```json
[
  {
    "id": "uuid-1",
    "name": "Landscapes",
    "photo_count": 125
  },
  {
    "id": "uuid-2",
    "name": "Wildlife",
    "photo_count": 89
  },
  {
    "id": "uuid-3",
    "name": "Macro",
    "photo_count": 67
  }
]
```

---

### Get All Tags
Retrieves all available tags.

**Endpoint**: `GET /photos/tag/`

**Response**: `200 OK`
```json
[
  {
    "id": "uuid-1",
    "name": "sunset",
    "usage_count": 45
  },
  {
    "id": "uuid-2",
    "name": "mountains",
    "usage_count": 38
  },
  {
    "id": "uuid-3",
    "name": "wildlife",
    "usage_count": 52
  }
]
```

---

## Social Interaction Endpoints

### Like/Unlike Photo
Toggles like status for a photo.

**Endpoint**: `POST /social/photo-like/`

**Headers**: 
- `Authorization: Bearer <access-token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "photo": "photo-uuid"
}
```

**Response**: `200 OK`
```json
{
  "photo": "photo-uuid",
  "is_liked": true,
  "likes_count": 26
}
```

---

### Get Like Count
Retrieves total likes for a photo.

**Endpoint**: `GET /social/photo-like/like-count/?id={photo-id}`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `200 OK`
```json
{
  "photo_id": "photo-uuid",
  "likes_count": 25
}
```

---

### Check Like Status
Checks if current user has liked a photo.

**Endpoint**: `GET /social/photo-like/is-liked/?id={photo-id}`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `200 OK`
```json
{
  "photo_id": "photo-uuid",
  "is_liked": true
}
```

---

### Add Comment
Adds a comment to a photo.

**Endpoint**: `POST /social/comment/`

**Headers**: 
- `Authorization: Bearer <access-token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "photo": "photo-uuid",
  "comment": "Amazing shot! The lighting is perfect."
}
```

**Response**: `201 Created`
```json
{
  "id": "comment-uuid",
  "photo": "photo-uuid",
  "user": {
    "id": 2,
    "username": "viewer123",
    "profile_image": "https://res.cloudinary.com/..."
  },
  "comment": "Amazing shot! The lighting is perfect.",
  "created_at": "2024-01-15T20:15:00Z",
  "updated_at": "2024-01-15T20:15:00Z"
}
```

---

### Get Photo Comments
Retrieves all comments for a photo.

**Endpoint**: `GET /social/comment/photo-comments/?id={photo-id}`

**Headers**: `Authorization: Bearer <access-token>`

**Query Parameters**:
- `limit`: Number of comments per page (default: 20)
- `offset`: Starting position for pagination

**Response**: `200 OK`
```json
{
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "comment-uuid-1",
      "user": {
        "id": 3,
        "username": "naturelover",
        "profile_image": "https://res.cloudinary.com/..."
      },
      "comment": "Incredible capture! What camera did you use?",
      "created_at": "2024-01-15T19:45:00Z",
      "updated_at": "2024-01-15T19:45:00Z",
      "can_edit": false,
      "can_delete": false
    },
    {
      "id": "comment-uuid-2",
      "user": {
        "id": 1,
        "username": "photographer1",
        "profile_image": "https://res.cloudinary.com/..."
      },
      "comment": "Thank you! Shot with Canon EOS R5",
      "created_at": "2024-01-15T20:00:00Z",
      "updated_at": "2024-01-15T20:00:00Z",
      "can_edit": true,
      "can_delete": true
    }
  ]
}
```

---

### Update Comment
Updates an existing comment (only by author).

**Endpoint**: `PATCH /social/comment/{comment-id}/`

**Headers**: 
- `Authorization: Bearer <access-token>`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
```
comment: "Updated comment text"
```

**Response**: `200 OK`
```json
{
  "id": "comment-uuid",
  "comment": "Updated comment text",
  "updated_at": "2024-01-15T20:30:00Z"
}
```

---

### Delete Comment
Deletes a comment (only by author or photo owner).

**Endpoint**: `DELETE /social/comment/{comment-id}/`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `204 No Content`

---

## Save Photo Endpoints

### Save Photo
Saves a photo to user's collection.

**Endpoint**: `POST /photos/save-photo/`

**Headers**: 
- `Authorization: Bearer <access-token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "photo": "photo-uuid"
}
```

**Response**: `201 Created`
```json
{
  "id": "save-uuid",
  "photo": {
    "id": "photo-uuid",
    "title": "Sunset at Malibu Beach",
    "image": "https://res.cloudinary.com/...",
    "thumbnail": "https://res.cloudinary.com/.../c_thumb,w_300,h_300/"
  },
  "created_at": "2024-01-15T21:00:00Z"
}
```

---

### Get Saved Photos
Retrieves user's saved photos.

**Endpoint**: `GET /photos/save-photo/`

**Headers**: `Authorization: Bearer <access-token>`

**Query Parameters**:
- `limit`: Number of photos per page (default: 30)
- `offset`: Starting position for pagination

**Response**: `200 OK`
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "save-uuid",
      "photo": {
        "id": "photo-uuid",
        "title": "Mountain Reflection",
        "image": "https://res.cloudinary.com/...",
        "thumbnail": "https://res.cloudinary.com/.../c_thumb,w_300,h_300/",
        "uploaded_by": {
          "username": "mountainphotographer",
          "profile_image": "https://res.cloudinary.com/..."
        }
      },
      "created_at": "2024-01-15T21:00:00Z"
    }
  ]
}
```

---

### Remove Saved Photo
Removes a photo from saved collection.

**Endpoint**: `DELETE /photos/save-photo/{save-id}/`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `204 No Content`

---

### Get Save Count
Gets total number of saves for a photo.

**Endpoint**: `GET /photos/save-photo/count/?photoId={photo-id}`

**Headers**: `Authorization: Bearer <access-token>`

**Response**: `200 OK`
```json
{
  "photo_id": "photo-uuid",
  "saves_count": 12
}
```

---

## Search Endpoints

### Search Photos
Searches photos using Elasticsearch.

**Endpoint**: `GET /photos/search-photos/{search-term}/`

**Headers**: `Authorization: Bearer <access-token>`

**Query Parameters**:
- `limit`: Number of results per page (default: 30)
- `offset`: Starting position for pagination
- `category`: Filter by category
- `location`: Filter by location

**Example**: `GET /photos/search-photos/sunset/?limit=20&category=landscapes`

**Response**: `200 OK`
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/photos/search-photos/sunset/?limit=20&offset=20",
  "previous": null,
  "results": [
    {
      "id": "photo-uuid",
      "title": "Golden Sunset Over Ocean",
      "description": "Beautiful sunset captured from the pier",
      "image": "https://res.cloudinary.com/...",
      "thumbnail": "https://res.cloudinary.com/.../c_thumb,w_300,h_300/",
      "score": 0.95,
      "highlight": {
        "title": ["Golden <em>Sunset</em> Over Ocean"],
        "description": ["Beautiful <em>sunset</em> captured from the pier"]
      },
      "uploaded_by": {
        "username": "oceanphotographer"
      },
      "created_at": "2024-01-15T18:30:00Z"
    }
  ]
}
```

---

## Email Endpoints

### Send OTP
Sends OTP to email for verification.

**Endpoint**: `POST /mail/send-otp/?email={email}`

**Request Body**: `{}`

**Response**: `200 OK`
```json
{
  "message": "OTP sent successfully to user@example.com",
  "expires_at": "2024-01-15T21:35:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email format
- `429 Too Many Requests`: Rate limit exceeded

---

### Verify OTP
Verifies OTP code.

**Endpoint**: `POST /mail/verify-otp/`

**Headers**: `Content-Type: application/json`

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**: `200 OK`
```json
{
  "message": "OTP verified successfully",
  "verified": true
}
```

**Error Responses**:
- `400 Bad Request`: Invalid or expired OTP
- `404 Not Found`: No OTP found for email

---

## Health Check Endpoint

### Health Check
Checks application health status.

**Endpoint**: `GET /health/`

**Response**: `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T22:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "elasticsearch": "healthy",
    "cloudinary": "healthy"
  },
  "version": "1.0.0"
}
```

**Error Response**: `500 Internal Server Error`
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T22:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "unhealthy",
    "elasticsearch": "healthy",
    "cloudinary": "healthy"
  },
  "errors": ["Redis connection failed"]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Invalid login credentials |
| `TOKEN_EXPIRED` | JWT token has expired |
| `PERMISSION_DENIED` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `VALIDATION_ERROR` | Request data validation failed |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |
| `FILE_TOO_LARGE` | Uploaded file exceeds size limit |
| `INVALID_FILE_TYPE` | Unsupported file format |
| `DUPLICATE_ENTRY` | Resource already exists |
| `SERVICE_UNAVAILABLE` | External service unavailable |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/user/login/` | 5 requests per minute per IP |
| `/user/register/` | 3 requests per hour per IP |
| `/photos/photo/` (POST) | 10 uploads per hour per user |
| `/social/photo-like/` | 100 requests per hour per user |
| `/social/comment/` | 50 requests per hour per user |
| `/mail/send-otp/` | 3 requests per hour per email |

---

## WebSocket Endpoints (Future Implementation)

### Real-time Notifications
**Endpoint**: `ws://localhost:8000/ws/notifications/{user-id}/`

**Message Types**:
- `photo_liked`: Someone liked your photo
- `photo_commented`: Someone commented on your photo
- `user_followed`: Someone followed you

**Message Format**:
```json
{
  "type": "photo_liked",
  "data": {
    "photo_id": "photo-uuid",
    "liker": {
      "username": "user123",
      "profile_image": "https://..."
    },
    "timestamp": "2024-01-15T22:30:00Z"
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript
```typescript
// Initialize API client
const api = new NaturelensAPI({
  baseURL: 'http://localhost:8000/api',
  token: 'your-jwt-token'
});

// Upload photo
const photo = await api.photos.upload({
  title: 'Sunset Beach',
  description: 'Beautiful sunset',
  image: fileObject,
  category: 'landscape-uuid',
  tags: ['sunset', 'beach'],
  location: 'Malibu, CA'
});

// Get photos with pagination
const photos = await api.photos.list({
  limit: 20,
  offset: 0,
  category: 'landscape-uuid'
});

// Like a photo
await api.social.likePhoto('photo-uuid');
```

### Python
```python
from naturelens_sdk import NaturelensAPI

# Initialize API client
api = NaturelensAPI(
    base_url='http://localhost:8000/api',
    token='your-jwt-token'
)

# Upload photo
photo = api.photos.upload(
    title='Sunset Beach',
    description='Beautiful sunset',
    image=open('photo.jpg', 'rb'),
    category='landscape-uuid',
    tags=['sunset', 'beach'],
    location='Malibu, CA'
)

# Search photos
results = api.photos.search('sunset', limit=20)
```

---

## Postman Collection

A complete Postman collection is available at: `docs/Naturelens.postman_collection.json`

Import this collection to test all endpoints with pre-configured requests and examples.

---

*Last updated: January 15, 2024*