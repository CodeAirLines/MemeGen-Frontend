# Backend API Architecture & Contracts

> **Notice**: Backend development belongs to **Nithish**. The frontend is fully decoupled and ready to connect as soon as the backend API is deployed.

---

## 1. Questions Pending for Nithish

Before connecting live API endpoints in subsequent days, please confirm:

1. **API Base URL & Environments**:
   - What are the base URLs for local development (e.g. `http://localhost:5000/api/v1`), staging, and production?
2. **Authentication Method**:
   - Will authentication use JWT bearer tokens in `Authorization: Bearer <token>`, HttpOnly cookies, or OAuth2 / Supabase / Firebase?
   - How should token refresh and session expiry be communicated to the frontend?
3. **Template API Response Structure**:
   - Does the backend return the envelope structure `{ success: boolean, data: { items: MemeTemplate[], pagination: ... } }`?
   - What image dimensions and CDN domains should be allowed in CSP (Content Security Policy)?
4. **Image Uploads & Generated Meme Downloads**:
   - For custom user images, will the backend use pre-signed S3/Cloudinary URLs or multipart form uploads directly to an endpoint (e.g. `POST /templates/upload`)?
   - Is meme generation executed server-side (Node/Canvas/Sharp/Python) or client-side with a cloud storage backup?
5. **Drafts & Published Memes Storage**:
   - How will user drafts, likes, and published memes be persisted (schema for canvas layers vs flattened raster images)?
6. **Error Response Format**:
   - What is the standardized JSON schema for errors (e.g. `{ success: false, error: { code: string, message: string, details?: Record<string, string[]> } }`) and HTTP status code conventions?

---

## 2. Documented API Endpoints (Planned Contracts)

### Template Management
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/templates` | List paginated meme templates with category & search filter | No |
| `GET` | `/api/v1/templates/:id` | Retrieve detailed template metadata and text slots | No |
| `POST` | `/api/v1/templates/upload` | Upload a user's custom blank meme template | Yes |

### Meme Creation & Publishing
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/memes/generate` | Server-render a meme with customized text layers | Optional |
| `POST` | `/api/v1/memes` | Save a published meme to the public community feed | Yes |
| `GET` | `/api/v1/memes` | Browse community memes (trending, latest, top) | No |
| `GET` | `/api/v1/memes/:id` | View published meme details and like/share counts | No |

### Authentication & User Profile
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new creator account | No |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain token/session | No |
| `POST` | `/api/v1/auth/logout` | Revoke session | Yes |
| `GET` | `/api/v1/auth/me` | Fetch active user profile and created memes count | Yes |

---

## 3. Standard JSON Response Envelope

### Success Response Example
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "drake-hotline-bling",
        "name": "Drake Hotline Bling",
        "imageUrl": "https://cdn.memegen.example.com/templates/drake.jpg",
        "width": 1200,
        "height": 1200,
        "boxCount": 2,
        "category": "classic",
        "tags": ["drake", "approval"],
        "description": "Drake gesturing disapproval and approval",
        "usageCount": 1420500
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 120,
      "totalPages": 6,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Error Response Example
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid template generation parameters provided",
    "details": {
      "templateId": ["Template ID not found or archived"]
    }
  }
}
```
