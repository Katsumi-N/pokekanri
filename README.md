# pokekanri
Manage your pokemon card stock!

# Demo
※Design is not fixed!!

https://github.com/user-attachments/assets/9186ab27-400f-4aae-8412-a7817472ec70

# Tech Stack
Frontend
- Next.js
Backend
- Echo(Go): main logic
- Elasticsearch: search
- FastAPI(Python): OCR(TODO)
- supabase: authentication

# How to run in local
Frontend
- `$ cd frontend`
- `$ pnpm dev`

Backend
- `$ docker compose up` to run db & Elasticsearch
- `$ cd api`
- `$ go run cmd/main.go`
