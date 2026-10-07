# CodeFlow Dashboard

An advanced interactive learning and analytics dashboard built with a lightweight Node.js server and a polished frontend.

## Features
- Real-time dashboard overview
- Badge and XP progression panels
- Roadmap tracking
- Quiz challenge panel
- Glossary and search system
- Theme toggle and saved preferences
- CPU/compiler simulation panel
- Heatmap activity visualization
- Autocomplete hints and event-driven UI
- API endpoints for structured data access

## Run locally

```bash
node server.js
```

Then open:

```text
http://localhost:3000
```

## Project structure

```text
.
├── data/
│   └── mockData.json
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Notes
This project is intentionally dependency-light so it runs with just Node.js. A production build can later add Redis, PostgreSQL, or an auth layer if required.
