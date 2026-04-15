# Vibe Coding Showcase

A modern portfolio website built with Next.js to showcase all your creative coding projects and websites.

## Description

This is a personal portfolio and project showcase platform designed to display your vibe coding creations. The site features a clean, modern interface that highlights your projects, skills, and creativity in web development.

## Features

- **Project Showcase**: Display all your vibe coding projects with descriptions, images, and links
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Fast Performance**: Built with Next.js for optimal speed and SEO
- **Easy to Customize**: Simple configuration to add or update your projects
- **Modern UI**: Clean and contemporary design with smooth interactions
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── projects/
│       ├── page.tsx        # Projects listing page
│       └── [id]/
│           └── page.tsx    # Individual project detail page
├── lib/
│   ├── projects.ts         # Project data and utilities
│   └── utils.ts            # Helper functions
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── ProjectCard.tsx     # Project card component
│   ├── Footer.tsx          # Footer component
│   └── ThemeToggle.tsx     # Theme switcher
├── styles/
│   └── globals.css         # Global styles
├── public/
│   └── projects/           # Project images and assets
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vibe-showcase
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file if needed for environment variables:
```bash
cp .env.example .env.local
```

4. Update project data in `lib/projects.ts` with your own projects

## Usage

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Adding Projects

Edit `lib/projects.ts` and add your project information:
```typescript
export const projects = [
  {
    id: 1,
    title: "Your Project Name",
    description: "Project description",
    image: "/projects/project-image.jpg",
    link: "https://project-url.com",
    tags: ["Next.js", "React", "Tailwind CSS"]
  }
  // Add more projects...
];
```

### Build

Build for production:
```bash
npm run build
npm start
```

## Deployment to Railway

### Steps

1. Push your project to GitHub (if not already done)

2. Go to [Railway.app](https://railway.app) and sign in with GitHub

3. Create a new project:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

4. Configure environment variables (if needed):
   -
