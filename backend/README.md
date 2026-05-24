# Django API backend

This is a minimal Django backend template for a React frontend.

## Included

- Django project config
- Django REST Framework for JSON APIs
- `django-cors-headers` for local React dev
- Example health endpoint at `/api/health/`
- No HTML template rendering

## Setup

1. Create a virtual environment.
2. Install dependencies:
   `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and update values if needed.
4. Run migrations:
   `python manage.py migrate`
5. Start the server:
   `python manage.py runserver`

Your React app can call `http://localhost:8000/api/health/`.
