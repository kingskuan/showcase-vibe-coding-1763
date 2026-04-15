# Vibe Coding Showcase

A portfolio website to showcase all your vibe coding projects, powered by the GitHub API.

## Description

This is a personal portfolio and project showcase that automatically fetches your public GitHub repositories, categorizes them, and displays them in a modern cyberpunk-themed UI with interactive particle animations.

## Features

- **Auto-fetched Projects**: Pulls all your public repos from GitHub automatically
- **Smart Categorization**: Sorts projects into Web Apps, Libraries, CLI Tools, AI/ML, and Other
- **Interactive Background**: Particle animation that responds to mouse movement
- **Responsive Design**: Works on desktop, tablet, and mobile
- **REST API**: Endpoints to fetch project data and refresh the cache

## Project Structure

```
.
├── index.js            # Entry point
├── lib/
│   └── core.js         # Server, GitHub API, HTML generation
├── package.json
├── railway.json        # Railway deployment config
├── .env.example        # Environment variable template
└── README.md
```

## Setup

### Prerequisites
- Node.js 20+
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd showcase-vibe-coding-1763
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the template:
```bash
cp .env.example .env
```

4. Edit `.env` with your values:
```
PORT=3000
GITHUB_USERNAME=your_github_username
GITHUB_TOKEN=your_github_personal_access_token
```

`GITHUB_TOKEN` is optional but recommended to avoid API rate limits (60 req/hr without, 5000 req/hr with).

### Running

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## API Endpoints

- `GET /` — Main showcase page (HTML)
- `GET /api/projects` — All categorized projects (JSON)
- `GET /api/refresh` — Re-fetch repos from GitHub and update the cache

## Deployment to Railway

1. Push your project to GitHub
2. Go to [Railway.app](https://railway.app) and sign in with GitHub
3. Create a new project → Deploy from GitHub repo → Choose your repository
4. Add environment variables: `GITHUB_USERNAME` and optionally `GITHUB_TOKEN`
5. Railway will auto-detect the start command from `railway.json`
