# Cadence Architect

Cadence Architect is a chord progression generator built to help spark ideas when writing music. The app lets a user choose the length of a chord progression, sends that request to a Django backend, and returns a generated progression to a React frontend for display.

The goal of the project is pretty simple: make it easier to get unstuck and find a progression to build from.

## Tech stack

- React
- TypeScript
- Vite
- Django
- Django REST Framework
- Markov-based chord generation

## How it works

On the generate page, the user selects the length of the progression they want. The frontend sends that value in a `POST` request to the Django API. The backend takes that length, passes it into `make_markov_sentences`, and sends the generated chord progression back to the frontend to be shown on the page.

## Project structure

```text
Cadence-Architect/
|-- backend/
|-- frontend/
`-- README.md
```

- `backend/` contains the Django API and Markov chord generation logic
- `frontend/` contains the React app

## Running locally

### Backend

From the project root:

```powershell
cd backend
..\.venv\Scripts\python.exe manage.py runserver
```

The backend runs at:

```text
http://127.0.0.1:8000
```

### Frontend

From the project root:

```powershell
cd frontend
npm install
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

## API

### Health check

```text
GET /api/health/
```

### Generate progression

```text
POST /api/generate/
```

Example request body:

```json
{
  "length": 8
}
```

Example response:

```json
{
  "length": 8,
  "progression": "C-G-Am-F",
  "chords": ["C", "G", "Am", "F"]
}
```

## Deploying on Render

This repo now includes a root `render.yaml` so you can deploy it through Render Blueprints instead of setting everything up by hand.

What it creates:

- a Django web service from `backend/`
- a static frontend site from `frontend/`
- a Render Postgres database connection for Django through `DATABASE_URL`

To use it:

1. Push the repo to GitHub.
2. In Render, open `Blueprints`.
3. Click `New Blueprint Instance`.
4. Select this repo and apply the blueprint.
5. When prompted, set `DJANGO_CORS_ALLOWED_ORIGINS` to your frontend URL.

After the services are created, confirm the frontend environment variable points at your live backend URL and update `DJANGO_ALLOWED_HOSTS` if you rename the backend service.

## Why I made it

I wanted to build something that mixes music and software in a way that feels useful. Sometimes the hardest part of writing is just getting a starting point, and this project is meant to help with that by generating progressions you can react to, change, or build on.
