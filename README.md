const state = {
  theme: 'dark',
  token: localStorage.getItem('codeflowToken') || '',
  user: null,
  dashboard: null,
  badges: [],
  roadmap: [],
  glossary: [],
  quiz: null,
  language: null,
  autocomplete: [],
  searchIndex: [],
  heatmap: []
};

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

function safeInit(elementId, callback) {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    callback(element);
    return true;
  } catch (error) {
    console.error(`Failed to initialize ${elementId}:`, error);
    return false;
  }
}

async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

function showLogin() {
  document.getElementById('loginView').classList.remove('hidden');
  document.getElementById('dashboardView').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('dashboardView').classList.remove('hidden');
}

function saveToken(token) {
  state.token = token;
  localStorage.setItem('codeflowToken', token);
}

function clearToken() {
  state.token = '';
  localStorage.removeItem('codeflowToken');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  state.theme = theme;
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.textContent = `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`;
  }
  try {
    localStorage.setItem('cfTheme', theme);
  } catch (error) {
    console.warn('Theme storage failed:', error);
  }
}

function renderDashboard(element) {
  const data = state.dashboard || fallbackData.dashboard;
  const statsMarkup = data.stats
    .map(
      (stat) => `
        <div class="stat-card">
          <div class="stat-label">${stat.label}</div>
          <div class="stat-value">${stat.value}</div>
          <div class="stat-delta">${stat.delta}</div>
        </div>
      `
    )
    .join('');

  const activityMarkup = data.activity
    .map(
      (item) => `
        <div class="activity-item">
          <div>${item.label}</div>
          <div class="progress-track">
            <span class="progress-fill" style="width: ${item.value}%"></span>
          </div>
        </div>
      `
    )
    .join('');

  element.innerHTML = `
    <div class="section-title">${data.title}</div>
    <div class="muted-text">${data.subtitle}</div>
    <div class="stat-grid" style="margin-top: 16px;">${statsMarkup}</div>
    <div class="activity-list">${activityMarkup}</div>
  `;
}

function renderBadges(element) {
  const items = state.badges || fallbackData.badges;
  element.innerHTML = `
    <div class="section-title">Achievements</div>
    <div class="badge-grid">
      ${items
        .map(
          (badge) => `
            <div class="badge-card">
              <div class="badge-top">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-tier">${badge.tier}</div>
              </div>
              <h3>${badge.name}</h3>
              <div>${badge.desc}</div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderRoadmap(element) {
  const items = state.roadmap || fallbackData.roadmap;
  element.innerHTML = `
    <div class="section-title">Roadmap</div>
    <div class="pipeline">
      <div class="pipeline-step active"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
    </div>
    <div class="roadmap-list" style="margin-top: 18px;">
      ${items
        .map(
          (step) => `
            <div class="roadmap-step ${step.status}">
              <h3>${step.title}</h3>
              <div>${step.detail}</div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

async function compileProgram(name = 'sum') {
  try {
    const result = await apiFetch(`/api/compile?name=${encodeURIComponent(name)}`);
    const panel = document.getElementById('cpu-compile');
    if (panel) {
      panel.innerHTML = `
        <div class="section-title">CPU Compile</div>
        <div class="language-card">
          <strong>Program: ${result.program}</strong>
          <span class="language-pill">${result.status}</span>
        </div>
        <div class="compile-output">${(result.output || []).join('\n')}</div>
        <div>${result.log}</div>
        <button class="small-button" type="button">+${result.xp || 0} XP</button>
      `;
    }
  } catch (error) {
    console.error('Compilation failed:', error);
    const panel = document.getElementById('cpu-compile');
    if (panel) {
      panel.innerHTML = `
        <div class="section-title">CPU Compile</div>
        <div class="compile-output">Compilation fallback active\nUsing local emulation mode.</div>
      `;
    }
  }
}

function renderCpu(element) {
  element.innerHTML = `
    <div class="section-title">CPU Pipeline</div>
    <div class="pipeline">
      <div class="pipeline-step active"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
    </div>
    <button class="small-button" id="compileBtn" type="button">Compile sum</button>
  `;

  const compileBtn = document.getElementById('compileBtn');
  if (compileBtn) {
    compileBtn.addEventListener('click', () => compileProgram('sum'));
  }
}

function renderLanguage(element) {
  const language = state.language || fallbackData.language;
  element.innerHTML = `
    <div class="section-title">Active Language</div>
    <div class="language-card">
      <div>
        <div style="font-size: 1.2rem; font-weight: 700;">${language.name}</div>
        <div style="color: var(--muted); margin-top: 4px;">${language.focus}</div>
      </div>
      <span class="language-pill">${language.progress}%</span>
    </div>
    <div class="progress-track" style="margin-top: 14px;">
      <span class="progress-fill" style="width: ${language.progress}%"></span>
    </div>
    <div class="inline-list">
      ${(language.skills || []).map((skill) => `<span class="inline-pill">${skill}</span>`).join('')}
    </div>
  `;
}

function renderQuiz(element) {
  const quiz = state.quiz || fallbackData.quiz;
  const options = quiz.choices
    .map((choice) => `<button class="quiz-option" data-choice="${choice}" type="button">${choice}</button>`)
    .join('');

  element.innerHTML = `
    <div class="section-title">Quiz</div>
    <div>${quiz.question}</div>
    <div class="quiz-options">${options}</div>
    <div id="quizResult" style="margin-top: 12px; color: var(--muted);"></div>
  `;

  element.querySelectorAll('.quiz-option').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const payload = await apiFetch('/api/quiz/submit', {
          method: 'POST',
          body: JSON.stringify({ answer: button.dataset.choice })
        });

        const resultBox = document.getElementById('quizResult');
        if (resultBox) {
          resultBox.textContent = payload.correct ? `${payload.message} ${payload.rewardXp} XP` : `${payload.message} ${payload.explanation}`;
          resultBox.style.color = payload.correct ? 'var(--success)' : 'var(--warning)';
        }
      } catch (error) {
        console.error('Quiz submit failed:', error);
      }
    });
  });
}

function renderGlossary(element) {
  const items = state.glossary || fallbackData.glossary;
  element.innerHTML = `
    <div class="section-title">Glossary</div>
    <div class="glossary-list">
      ${items
        .map(
          (item) => `
            <div class="glossary-item">
              <h4>${item.term}</h4>
              <div>${item.definition}</div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderOpcodeEditor(element) {
  element.innerHTML = `
    <div class="section-title">Opcode Editor</div>
    <textarea class="editor-box" spellcheck="false">LOAD R1, #12
ADD R1, R1, #8
STORE [MEM], R1
JMP 0x02</textarea>
  `;
}

function renderXPBar(element) {
  element.innerHTML = '<div class="xp-fill"></div>';
}

function renderHeatmap(element) {
  const values = state.heatmap || fallbackData.heatmap;
  const cells = values.flat().map((value) => `<div class="heat-cell ${value ? 'active' : ''}"></div>`).join('');
  element.innerHTML = `
    <div class="section-title">Activity Heatmap</div>
    <div class="heatmap-grid">${cells}</div>
  `;
}

function renderEvents(element) {
  const events = [
    { time: '09:42', text: 'Compiler optimization pass complete' },
    { time: '10:18', text: 'XP boost unlocked: pipeline mastery' },
    { time: '11:06', text: 'Roadmap milestone reached' },
    { time: '12:20', text: 'Quiz accuracy improved by 7%' }
  ];

  element.innerHTML = `
    <div class="section-title">Recent Events</div>
    <div class="event-list">
      ${events
        .map(
          (event) => `
            <div class="event-item">
              <strong>${event.time}</strong>
              <span>${event.text}</span>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function bindAutocomplete() {
  const input = document.getElementById('search-index');
  const list = document.getElementById('autocomplete');
  if (!input || !list) return;

  const items = state.autocomplete || fallbackData.autocomplete;
  const renderSuggestions = (term) => {
    const normalized = (term || '').trim();
    const filtered = items.filter((item) => item.toLowerCase().includes(normalized.toLowerCase()));
    list.innerHTML = filtered.slice(0, 6).map((item) => `<button class="autocomplete-item" type="button">${item}</button>`).join('');

    list.querySelectorAll('.autocomplete-item').forEach((button) => {
      button.addEventListener('click', () => {
        input.value = button.textContent.trim();
        list.innerHTML = '';
      });
    });
  };

  input.addEventListener('input', (event) => renderSuggestions(event.target.value));
  input.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      const q = input.value.trim();
      if (!q) return;
      try {
        const result = await apiFetch(`/api/search?q=${encodeURIComponent(q)}`);
        list.innerHTML = result.items.map((item) => `<button class="autocomplete-item" type="button">${item}</button>`).join('');
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  });
}

function buildSearchIndex() {
  const input = document.getElementById('search-index');
  if (input) input.value = 'compiler';
}

function initPipelineAnimation() {
  const steps = document.querySelectorAll('.pipeline-step');
  if (!steps.length) return;

  let activeIndex = 0;
  setInterval(() => {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === activeIndex);
    });
    activeIndex = (activeIndex + 1) % steps.length;
  }, 1300);
}

async function loadDashboard() {
  try {
    const data = await apiFetch('/api/dashboard');
    state.dashboard = data.dashboard || fallbackData.dashboard;
    state.badges = data.badges || fallbackData.badges;
    state.roadmap = data.roadmap || fallbackData.roadmap;
    state.quiz = data.quiz || fallbackData.quiz;
    state.language = data.language || fallbackData.language;
    state.glossary = data.glossary || fallbackData.glossary;
    state.autocomplete = data.autocomplete || fallbackData.autocomplete;
    state.searchIndex = data.searchIndex || fallbackData.searchIndex;
    state.heatmap = data.heatmap || fallbackData.heatmap;
    state.user = data.user || state.user;
  } catch (error) {
    console.warn('Using fallback data:', error);
    state.dashboard = fallbackData.dashboard;
    state.badges = fallbackData.badges;
    state.roadmap = fallbackData.roadmap;
    state.quiz = fallbackData.quiz;
    state.language = fallbackData.language;
    state.glossary = fallbackData.glossary;
    state.autocomplete = fallbackData.autocomplete;
    state.searchIndex = fallbackData.searchIndex;
    state.heatmap = fallbackData.heatmap;
  }
}

async function handleLogin(username, password) {
  const status = document.getElementById('authStatus');
  status.textContent = 'Signing in...';

  try {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    saveToken(data.token);
    state.user = data.user;
    await loadDashboard();
    showDashboard();
    renderAll();
    status.textContent = '';
  } catch (error) {
    status.textContent = error.message;
  }
}

function renderAll() {
  safeInit('dashboard', renderDashboard);
  safeInit('badges', renderBadges);
  safeInit('roadmap', renderRoadmap);
  safeInit('cpu-compile', () => compileProgram('sum'));
  safeInit('cpu-render', renderCpu);
  safeInit('language', renderLanguage);
  safeInit('quiz', renderQuiz);
  safeInit('glossary', renderGlossary);
  safeInit('opcode-editor', renderOpcodeEditor);
  safeInit('xp-bar', renderXPBar);
  safeInit('heatmap', renderHeatmap);
  safeInit('events', renderEvents);
  bindAutocomplete();
  buildSearchIndex();
  initPipelineAnimation();
}

function bindAuthEvents() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      await handleLogin(username, password);
    });
  }

  document.getElementById('demoLoginBtn')?.addEventListener('click', async () => {
    await handleLogin('demo', 'demo123');
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    clearToken();
    state.user = null;
    showLogin();
  });

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', async () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      if (state.token) {
        try {
          await apiFetch('/api/theme', {
            method: 'POST',
            body: JSON.stringify({ theme: nextTheme })
          });
        } catch (error) {
          console.warn('Theme sync failed:', error);
        }
      }
    });
  }
}

async function bootstrap() {
  bindAuthEvents();
  const storageTheme = localStorage.getItem('cfTheme') || 'dark';
  applyTheme(storageTheme);

  if (!state.token) {
    showLogin();
    return;
  }

  try {
    const me = await apiFetch('/api/me');
    state.user = me.user;
    await loadDashboard();
    showDashboard();
    renderAll();
  } catch (error) {
    clearToken();
    showLogin();
  }
}

window.addEventListener('DOMContentLoaded', bootstrap);

if (window.io) {
  const socket = io();
  socket.on('connected', (payload) => {
    console.log('Realtime connected:', payload);
  });
  socket.on('activity', (payload) => {
    const status = document.getElementById('authStatus');
    if (status) {
      status.textContent = payload.message || 'Realtime update';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    }
  });
}
