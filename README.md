# pokekanri
Manage your pokemon card stock!

# Demo
※Design is not fixed!!

https://github.com/user-attachments/assets/6a7186b5-5c35-442a-93fb-3745f096efeb

# Tech Stack
## Frontend
- Next.js

## Backend
- Echo(Go): main logic
- Elasticsearch: search
- FastAPI(Python): OCR(TODO)

## Authentication
- supabase

# How to run in local
Frontend
- `$ cd frontend`
- `$ pnpm dev`

Backend
- `$ docker compose up` to run db & Elasticsearch
- `$ cd api`
- `$ go run cmd/main.go`
