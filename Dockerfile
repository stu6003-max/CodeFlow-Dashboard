# CodeFlow Dashboard

A full-stack engineering learning dashboard built with Express, SQLite, JWT auth, Socket.IO, and a rich frontend.

## Features

- Secure authentication and registration
- Persistent SQLite database for users, badges, roadmap progress, and quiz history
- JWT-protected dashboard API
- Realtime activity broadcasts through Socket.IO
- Dark/light theme persistence
- Roadmap, dashboard metrics, compiler simulation, glossary, heatmap, and quiz modules
- Responsive admin-ready frontend shell
- Docker support for local deployment

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the app:

```text
http://localhost:3000
```

Default demo accounts:

- admin / admin123
- demo / demo123

## Project structure

```text
.
├── data/
│   └── codeflow.db
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
├── server.js
└── .gitignore
```

## Docker

```bash
docker-compose up --build
```

The service will be exposed on port 3000.

## Environment variables

```bash
PORT=3000
JWT_SECRET=change-this-secret
```
