import http from 'http';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'octocat';

async function fetchGitHubRepos(username) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'VibeShowcase'
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  let allRepos = [];
  let page = 1;

  try {
    while (true) {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&page=${page}`, { headers });
      if (!response.ok) {
        console.error(`GitHub API error: ${response.status} ${response.statusText}`);
        break;
      }
      const repos = await response.json();
      if (repos.length === 0) break;
      allRepos = allRepos.concat(repos);
      if (repos.length < 100) break;
      page++;
    }
  } catch (e) {
    console.error('Failed to fetch GitHub repos:', e.message);
  }

  return allRepos;
}

function categorizeRepos(repos) {
  const categories = {
    'Web Apps': [],
    'Libraries': [],
    'CLI Tools': [],
    'AI/ML': [],
    'Other': []
  };

  for (const repo of repos) {
    const name = (repo.name || '').toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    const lang = (repo.language || '').toLowerCase();
    const topics = repo.topics || [];

    let category = 'Other';

    if (topics.includes('cli') || name.includes('cli') || desc.includes('command line')) {
      category = 'CLI Tools';
    } else if (topics.includes('library') || topics.includes('package') || name.includes('lib') || desc.includes('library')) {
      category = 'Libraries';
    } else if (topics.includes('ai') || topics.includes('ml') || topics.includes('machine-learning') || desc.includes('ai') || desc.includes('machine learning')) {
      category = 'AI/ML';
    } else if (topics.includes('web') || topics.includes('webapp') || name.includes('app') || desc.includes('web app') || lang === 'typescript' || lang === 'javascript') {
      category = 'Web Apps';
    }

    categories[category].push({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description',
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated: repo.updated_at,
      topics: repo.topics || []
    });
  }

  return categories;
}

function generateHTML(categories, username) {
  const projectCards = Object.entries(categories).map(([cat, repos]) => {
    if (repos.length === 0) return '';
    const cards = repos.map(r => `
      <div class="card">
        <div class="card-header">
          <span class="status-dot"></span>
          <h3>${escapeHtml(r.name)}</h3>
        </div>
        <p class="desc">${escapeHtml(r.description)}</p>
        <div class="meta">
          <span class="lang">${escapeHtml(r.language || 'Unknown')}</span>
          <span class="stars">★ ${r.stars}</span>
        </div>
        <a href="${sanitizeUrl(r.url)}" target="_blank" class="link">View Repository →</a>
      </div>
    `).join('');
    return `<section class="category"><h2>${cat}</h2><div class="grid">${cards}</div></section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibe Coding Showcase - ${escapeHtml(username)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #0a0a0f;
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }
    #canvas-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 0;
    }
    canvas { display: block; }
    .content {
      position: relative;
      z-index: 1;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      padding: 4rem 0;
      background: linear-gradient(180deg, transparent, rgba(0,255,255,0.05));
    }
    h1 {
      font-size: 3rem;
      background: linear-gradient(135deg, #00ffff, #ff00ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    .subtitle { color: #888; font-size: 1.2rem; }
    .category { margin: 3rem 0; }
    .category h2 {
      color: #00ffff;
      border-left: 4px solid #00ffff;
      padding-left: 1rem;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background: rgba(20, 20, 30, 0.8);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    .card:hover {
      border-color: #00ffff;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
      transform: translateY(-5px);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      background: #00ff88;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .card h3 { font-size: 1.2rem; color: #fff; }
    .desc {
      color: #999;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }
    .lang {
      background: rgba(255, 0, 255, 0.2);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      color: #ff88ff;
    }
    .stars { color: #ffcc00; }
    .link {
      color: #00ffff;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .link:hover { color: #88ffff; }
  </style>
</head>
<body>
  <div id="canvas-container"></div>
  <div class="content">
    <header>
      <h1>⚡ Vibe Coding Showcase</h1>
      <p class="subtitle">Projects by ${escapeHtml(username)} | Powered by Cyber Pulse Core</p>
    </header>
    ${projectCards || '<p style="text-align:center;color:#666;">No projects found</p>'}
  </div>
  <script>
    const canvas = document.createElement('canvas');
    const container = document.getElementById('canvas-container');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let width, height, particles = [], mouseX = 0, mouseY = 0;
    
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        const angle = Math.random() * Math.PI * 2;
        const radius = 150 + Math.random() * 100;
        this.baseX = width / 2 + Math.cos(angle) * radius;
        this.baseY = height / 2 + Math.sin(angle) * radius;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.02 + 0.01;
        this.angle = angle;
        this.radius = radius;
        this.hue = Math.random() * 60 + 160;
      }
      update(time) {
        this.angle += this.speed;
        const distX = mouseX - width / 2;
        const distY = mouseY - height / 2;
        const dist = Math.sqrt(distX * distX + distY * distY);
        const influence = Math.max(0, 1 - dist / 400) * 50;
        
        this.x = width / 2 + Math.cos(this.angle) * (this.radius + Math.sin(time * 0.001 + this.angle) * 20);
        this.y = height / 2 + Math.sin(this.angle) * (this.radius + Math.cos(time * 0.001 + this.angle) * 20);
        
        if (dist > 0 && dist < 300) {
          this.x += (distX / dist) * influence * Math.sin(time * 0.005);
          this.y += (distY / dist) * influence * Math.cos(time * 0.005);
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 70%, 0.8)';
        ctx.fill();
      }
    }
    
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animate(time) {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update(time);
        p.draw();
      });
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 50) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0, 255, 255, ' + (1 - dist / 50) * 0.2 + ')';
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    animate(0);
  </script>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrl(url) {
  if (!url) return '#';
  const escaped = escapeHtml(url);
  if (/^https?:\/\//i.test(url)) return escaped;
  return '#';
}

function handleRequest(req, res, state) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/projects') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(state.categories));
    return;
  }

  if (url.pathname === '/api/refresh') {
    fetchGitHubRepos(state.username).then(repos => {
      state.categories = categorizeRepos(repos);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', message: `Refreshed ${repos.length} repos` }));
    }).catch(err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: err.message }));
    });
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(generateHTML(state.categories, state.username));
}

export default async function runApp({ port }) {
  const actualPort = port || process.env.PORT || 3000;
  const username = GITHUB_USERNAME;

  console.log(`Fetching repos for ${username}...`);
  const repos = await fetchGitHubRepos(username);
  const state = { categories: categorizeRepos(repos), username };
  console.log(`Found ${repos.length} repos`);

  const server = http.createServer((req, res) => {
    handleRequest(req, res, state);
  });

  server.listen(actualPort, '0.0.0.0', () => {
    console.log(`Vibe Showcase running at http://0.0.0.0:${actualPort}`);
  });

  const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
}