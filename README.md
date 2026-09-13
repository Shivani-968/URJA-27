# URJA 2026 🏃

Official website for URJA'26 — the Annual Sports Festival of NIT Jamshedpur.

## Project Structure

```
URJA-2026/
├── frontend/        ← React + Vite app (deployed on GitHub Pages)
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
├── backend/         ← Express + MongoDB API (deployed on Render)
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── routes/
│   └── package.json
└── README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev        # starts at http://localhost:5173
```

### Backend

```bash
cd backend
cp .env.example .env   # then fill in your MongoDB URI & JWT secret
npm install
npm run seed           # creates the 2 admin accounts (edit seed.js first)
npm run dev            # starts at http://localhost:5000
```

## Deployment

- **Frontend** → GitHub Pages (`cd frontend && npm run deploy`)
- **Backend** → Render (connect the repo, set root directory to `backend/`, start command: `npm start`)

## Live Site

🌐 [www.urja-nitjsr.com](https://www.urja-nitjsr.com)
