const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'codeflow-secret-dev';
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'codeflow.db');

fs.mkdirSync(DATA_DIR, { recursive: true });

function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);

      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            xp INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            theme TEXT DEFAULT 'dark',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            tier TEXT NOT NULL,
            icon TEXT NOT NULL,
            description TEXT NOT NULL,
            earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
          );
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS roadmap_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            detail TEXT NOT NULL,
            order_index INTEGER NOT NULL
          );
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS quiz_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            correct INTEGER DEFAULT 0,
            xp_awarded INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
          );
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS compile_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            program_name TEXT NOT NULL,
            status TEXT NOT NULL,
            output TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
          );
        `);

        db.get('SELECT COUNT(*) AS count FROM users', (error, row) => {
          if (error) return reject(error);
          if (row.count > 0) return resolve(db);

          const passwordHash = bcrypt.hashSync('admin123', 10);
          db.run(
            `INSERT INTO users (username, password, role, xp, streak, theme) VALUES (?, ?, ?, ?, ?, ?)`,
            ['admin', passwordHash, 'admin', 24800, 18, 'dark'],
            (insertErr) => {
              if (insertErr) return reject(insertErr);

              db.run(
                `INSERT INTO users (username, password, role, xp, streak, theme) VALUES (?, ?, ?, ?, ?, ?)`,
                ['demo', bcrypt.hashSync('demo123', 10), 'user', 12600, 9, 'dark'],
                (seedErr) => {
                  if (seedErr) return reject(seedErr);

                  const badgeRows = [
                    [1, 'Compiler Wizard', 'Legendary', '⚙️', 'Completed 30 compile challenges'],
                    [1, 'Pipeline Hero', 'Epic', '🚀', 'Built 10 optimized execution paths'],
                    [2, 'Research Monk', 'Rare', '🧠', 'Solved 5 advanced reasoning tasks'],
                    [2, 'Debug Ranger', 'Rare', '🔎', 'Fixed 20 critical issues']
                  ];

                  const stmt = db.prepare(`INSERT INTO badges (user_id, name, tier, icon, description) VALUES (?, ?, ?, ?, ?)`);
                  badgeRows.forEach(([userId, name, tier, icon, desc]) => stmt.run(userId, name, tier, icon, desc));
                  stmt.finalize(() => {
                    const roadmap = [
                      ['Phase 1: Foundations', 'completed', 'Variables, loops, recursion, I/O', 1],
                      ['Phase 2: Memory & CPU', 'active', 'Execution model, stack, heap', 2],
                      ['Phase 3: Compilers', 'pending', 'Tokenization and code generation', 3],
                      ['Phase 4: Systems', 'pending', 'Concurrency and memory safety', 4]
                    ];

                    const roadmapStmt = db.prepare(`INSERT INTO roadmap_items (title, status, detail, order_index) VALUES (?, ?, ?, ?)`);
                    roadmap.forEach(([title, status, detail, orderIndex]) => roadmapStmt.run(title, status, detail, orderIndex));
                    roadmapStmt.finalize(() => resolve(db));
                  });
                }
              );
            }
          );
        });
      });
    });
  });
}

function mapUserRow(row) {
  return row ? {
    id: row.id,
    username: row.username,
    role: row.role,
    xp: row.xp,
    streak: row.streak,
    theme: row.theme,
    createdAt: row.created_at
  } : null;
}

function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

const fallbackData = {
  dashboard: {
    title: 'CodeFlow Command Center',
    subtitle: 'AI-powered engineering academy',
    stats: [
      { label: 'Active Missions', value: '12', delta: '+3 this week' },
      { label: 'XP Earned', value: '24.8k', delta: '+1.2k today' },
      { label: 'Streak', value: '18 days', delta: 'best streak' },
      { label: 'Accuracy', value: '91%', delta: '+8%' }
    ],
    activity: [
      { label: 'Data structures', value: 84 },
      { label: 'Algorithms', value: 68 },
      { label: 'System design', value: 76 },
      { label: 'Compiler logic', value: 90 }
    ]
  },
  badges: [
    { name: 'Compiler Wizard', tier: 'Legendary', icon: '⚙️', desc: 'Completed 30 compile challenges' },
    { name: 'Pipeline Hero', tier: 'Epic', icon: '🚀', desc: 'Built 10 optimized execution paths' },
    { name: 'Research Monk', tier: 'Rare', icon: '🧠', desc: 'Solved 5 advanced reasoning tasks' },
    { name: 'Debug Ranger', tier: 'Rare', icon: '🔎', desc: 'Fixed 20 critical issues' }
  ],
  roadmap: [
    { title: 'Phase 1: Foundations', status: 'completed', detail: 'Variables, loops, recursion, I/O' },
    { title: 'Phase 2: Memory & CPU', status: 'active', detail: 'Execution model, stack, heap' },
    { title: 'Phase 3: Compilers', status: 'pending', detail: 'Tokenization and code generation' },
    { title: 'Phase 4: Systems', status: 'pending', detail: 'Concurrency and memory safety' }
  ],
  quiz: {
    question: 'Which instruction best describes a pipeline stage that transforms tokens into executable operations?',
    choices: ['Lexing', 'Scheduling', 'Rendering', 'Cache warming'],
    answer: 'Lexing',
    explanation: 'Lexing converts source text into recognizable tokens before parsing and code generation.'
  },
  language: {
    name: 'Python',
    focus: 'Algorithmic thinking',
    skills: ['Arrays', 'Graphs', 'Dynamic programming', 'Concurrency'],
    progress: 82
  },
  glossary: [
    { term: 'AST', definition: 'Abstract syntax tree; a structured representation of source code.' },
    { term: 'JIT', definition: 'Just-in-time compilation for dynamic execution optimization.' },
    { term: 'Cache hit', definition: 'A memory access served from a cache instead of slower memory.' },
    { term: 'Thread', definition: 'A logical execution path inside a process.' }
  ],
  searchIndex: [
    'Compiler pipeline',
    'Badges system',
    'Roadmap planning',
    'Search indexing',
    'XP progression',
    'Heatmap analysis',
    'Opcode editor',
    'API performance'
  ],
  autocomplete: ['dashboard', 'badges', 'roadmap', 'compiler', 'experiments', 'heatmap', 'quiz', 'language'],
  heatmap: [
    [1, 1, 0, 1, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [0, 1, 1, 0, 1, 1, 1, 0],
    [1, 1, 0, 1, 0, 1, 1, 1]
  ]
};

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(ROOT, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'online', service: 'CodeFlow Dashboard' });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password || username.length < 3 || password.length < 6) {
    return res.status(400).json({ error: 'Username must be at least 3 chars and password at least 6 chars.' });
  }

  const db = global.codeflowDb;
  const hash = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, password, role, xp, streak, theme) VALUES (?, ?, ?, ?, ?, ?)',
    [username, hash, 'user', 1200, 1, 'dark'],
    function insertUser(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(409).json({ error: 'Username already exists.' });
        }
        return res.status(500).json({ error: 'Could not create user.' });
      }

      const user = { id: this.lastID, username, role: 'user', xp: 1200, streak: 1, theme: 'dark' };
      return res.status(201).json({ token: signToken(user), user });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const db = global.codeflowDb;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error during login.' });
    }

    if (!row || !bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = mapUserRow(row);
    return res.json({ token: signToken(user), user });
  });
});

app.get('/api/me', authRequired, (req, res) => {
  const db = global.codeflowDb;
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ user: mapUserRow(row) });
  });
});

app.get('/api/dashboard', authRequired, (req, res) => {
  const db = global.codeflowDb;
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, userRow) => {
    if (err || !userRow) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = mapUserRow(userRow);
    const payload = {
      user,
      dashboard: {
        ...fallbackData.dashboard,
        stats: [
          { label: 'Active Missions', value: '12', delta: '+3 this week' },
          { label: 'XP Earned', value: `${Math.floor(user.xp / 1000)}.0k`, delta: '+1.2k today' },
          { label: 'Streak', value: `${user.streak} days`, delta: 'best streak' },
          { label: 'Accuracy', value: '91%', delta: '+8%' }
        ]
      },
      badges: fallbackData.badges,
      roadmap: fallbackData.roadmap,
      language: fallbackData.language,
      quiz: fallbackData.quiz,
      glossary: fallbackData.glossary,
      searchIndex: fallbackData.searchIndex,
      autocomplete: fallbackData.autocomplete,
      heatmap: fallbackData.heatmap
    };

    return res.json(payload);
  });
});

app.get('/api/badges', authRequired, (req, res) => {
  const db = global.codeflowDb;
  db.all('SELECT * FROM badges WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Could not load badges.' });
    const badges = rows.length ? rows.map((badge) => ({
      name: badge.name,
      tier: badge.tier,
      icon: badge.icon,
      desc: badge.description
    })) : fallbackData.badges;
    return res.json({ badges });
  });
});

app.get('/api/roadmap', authRequired, (req, res) => {
  const db = global.codeflowDb;
  db.all('SELECT * FROM roadmap_items ORDER BY order_index ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Could not load roadmap.' });
    const roadmap = rows.length ? rows.map((row) => ({
      title: row.title,
      status: row.status,
      detail: row.detail
    })) : fallbackData.roadmap;
    return res.json({ roadmap });
  });
});

app.get('/api/glossary', authRequired, (req, res) => {
  return res.json({ glossary: fallbackData.glossary });
});

app.get('/api/search', authRequired, (req, res) => {
  const query = String(req.query.q || '').trim().toLowerCase();
  const items = query
    ? fallbackData.searchIndex.filter((item) => item.toLowerCase().includes(query))
    : fallbackData.searchIndex;
  return res.json({ query, items });
});

app.get('/api/compile', authRequired, (req, res) => {
  const name = req.query.name || 'sum';
  const compiledOutput = [
    'LOAD_CONST 0',
    'STORE_NAME sum',
    'LOAD_NAME sum',
    'BINARY_ADD',
    'RETURN_VALUE',
    'COMPILATION_OK'
  ];

  const db = global.codeflowDb;
  db.run(
    'INSERT INTO compile_history (user_id, program_name, status, output) VALUES (?, ?, ?, ?)',
    [req.user.id, name, 'compiled', JSON.stringify(compiledOutput)],
    (err) => {
      if (err) {
        console.warn('Compile logging failed:', err.message);
      }
    }
  );

  io.emit('activity', { message: `Program ${name} compiled successfully.` });
  return res.json({
    program: name,
    status: 'compiled',
    output: compiledOutput,
    log: `Program ${name} compiled successfully with 0 syntax errors.`,
    xp: 240
  });
});

app.post('/api/theme', authRequired, (req, res) => {
  const theme = String(req.body.theme || 'dark');
  const db = global.codeflowDb;
  db.run('UPDATE users SET theme = ? WHERE id = ?', [theme, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: 'Theme update failed.' });
    return res.json({ ok: true, theme, message: 'Theme preference saved.' });
  });
});

app.post('/api/quiz/submit', authRequired, (req, res) => {
  const answer = String(req.body.answer || '').trim();
  const isCorrect = answer.toLowerCase() === fallbackData.quiz.answer.toLowerCase();
  const rewardXp = isCorrect ? 250 : 0;

  const db = global.codeflowDb;
  db.run(
    'INSERT INTO quiz_history (user_id, question, answer, correct, xp_awarded) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, fallbackData.quiz.question, answer, isCorrect ? 1 : 0, rewardXp],
    (err) => {
      if (err) {
        console.warn('Quiz logging failed:', err.message);
      }
    }
  );

  if (isCorrect) {
    db.run('UPDATE users SET xp = xp + ? WHERE id = ?', [rewardXp, req.user.id]);
  }

  return res.json({
    correct: isCorrect,
    explanation: fallbackData.quiz.explanation,
    rewardXp,
    message: isCorrect ? 'Correct answer. Great work.' : 'Not quite. Review the glossary and try again.'
  });
});

app.get('/api/admin/overview', authRequired, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const db = global.codeflowDb;
  db.get('SELECT COUNT(*) AS users FROM users', (errUsers, userRow) => {
    if (errUsers) return res.status(500).json({ error: 'Cannot load admin overview.' });
    db.get('SELECT SUM(xp) AS totalXp FROM users', (errXp, xpRow) => {
      if (errXp) return res.status(500).json({ error: 'Cannot load total xp.' });
      return res.json({
        totalUsers: userRow.users,
        totalXp: Number(xpRow.totalXp || 0),
        activeSessions: 12,
        systemHealth: 'stable'
      });
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'public', 'index.html'));
});

initDatabase()
  .then((db) => {
    global.codeflowDb = db;
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      socket.emit('connected', { status: 'online' });
    });

    server.listen(PORT, () => {
      console.log(`CodeFlow Dashboard listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
