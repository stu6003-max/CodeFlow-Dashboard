const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_FILE = path.join(ROOT, 'data', 'mockData.json');

let dataCache = null;

function loadData() {
  if (!dataCache) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    dataCache = JSON.parse(raw);
  }
  return dataCache;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString();
      if (!raw) return resolve({});

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', reject);
  });
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
  };

  return map[ext] || 'application/octet-stream';
}

function serveStaticFile(req, res, reqPath) {
  const safePath = reqPath === '/' ? '/index.html' : reqPath;
  const candidate = path.join(PUBLIC_DIR, safePath);

  if (!candidate.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(candidate, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': getMimeType(candidate) });
    res.end(data);
  });
}

function buildResponsePayload() {
  const data = loadData();
  return {
    dashboard: data.dashboard,
    badges: data.badges,
    roadmap: data.roadmap,
    language: data.language,
    quiz: data.quiz,
    glossary: data.glossary,
    searchIndex: data.searchIndex,
    autocomplete: data.autocomplete,
    heatmap: data.heatmap,
    xp: 24800,
    streak: 18,
    activeMissionCount: 12
  };
}

async function handleApi(req, res, pathname, url) {
  if (pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, status: 'online', service: 'CodeFlow Dashboard' });
  }

  if (pathname === '/api/dashboard') {
    return sendJson(res, 200, buildResponsePayload());
  }

  if (pathname === '/api/badges') {
    return sendJson(res, 200, { badges: loadData().badges });
  }

  if (pathname === '/api/roadmap') {
    return sendJson(res, 200, { roadmap: loadData().roadmap });
  }

  if (pathname === '/api/quiz') {
    const quiz = loadData().quiz;
    return sendJson(res, 200, { quiz });
  }

  if (pathname === '/api/glossary') {
    const glossary = loadData().glossary;
    return sendJson(res, 200, { glossary });
  }

  if (pathname === '/api/search') {
    const query = (url.searchParams.get('q') || '').trim().toLowerCase();
    const items = loadData().searchIndex.filter((item) => item.toLowerCase().includes(query));
    return sendJson(res, 200, { query, items });
  }

  if (pathname === '/api/compile') {
    const name = url.searchParams.get('name') || 'sum';
    const compiledOutput = [
      'LOAD_CONST 0',
      'STORE_NAME sum',
      'LOAD_NAME sum',
      'BINARY_ADD',
      'RETURN_VALUE',
      'COMPILATION_OK'
    ];

    return sendJson(res, 200, {
      program: name,
      status: 'compiled',
      output: compiledOutput,
      log: `Program ${name} compiled successfully with 0 syntax errors.`,
      xp: 240
    });
  }

  if (pathname === '/api/theme') {
    if (req.method === 'POST') {
      const body = await readBody(req);
      return sendJson(res, 200, {
        ok: true,
        theme: body.theme || 'dark',
        message: 'Theme preference saved.'
      });
    }

    return sendJson(res, 200, { theme: 'dark' });
  }

  if (pathname === '/api/quiz/submit') {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    const body = await readBody(req);
    const answer = body.answer || '';
    const quiz = loadData().quiz;
    const correct = answer.toLowerCase() === quiz.answer.toLowerCase();

    return sendJson(res, 200, {
      correct,
      explanation: quiz.explanation,
      rewardXp: correct ? 250 : 0,
      message: correct ? 'Correct answer. Great work.' : 'Not quite. Review the glossary and try again.'
    });
  }

  return sendJson(res, 404, { error: 'API route not found' });
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (pathname.startsWith('/api/')) {
    try {
      await handleApi(req, res, pathname, url);
    } catch (error) {
      sendJson(res, 500, { error: error.message || 'Unexpected server error' });
    }
    return;
  }

  serveStaticFile(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`CodeFlow Dashboard server running at http://localhost:${PORT}`);
});
