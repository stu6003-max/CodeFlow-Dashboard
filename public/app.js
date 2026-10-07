const FALLBACK_DATA = {
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

const state = {
  theme: 'dark',
  dashboard: FALLBACK_DATA.dashboard,
  badges: FALLBACK_DATA.badges,
  roadmap: FALLBACK_DATA.roadmap,
  glossary: FALLBACK_DATA.glossary,
  quiz: FALLBACK_DATA.quiz,
  language: FALLBACK_DATA.language,
  autocomplete: FALLBACK_DATA.autocomplete,
  searchIndex: FALLBACK_DATA.searchIndex,
  heatmap: FALLBACK_DATA.heatmap
};

function safeInit(elementId, callback) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element not found: ${elementId}`);
    return false;
  }

  try {
    callback(element);
    return true;
  } catch (error) {
    console.error(`Failed to initialize ${elementId}:`, error);
    return false;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
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
    console.warn('Theme could not be saved:', error);
  }
}

function renderDashboard(element) {
  const data = state.dashboard;
  if (!data) return;

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
  const items = state.badges || [];
  const markup = items
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
    .join('');

  element.innerHTML = `
    <div class="section-title">Achievements</div>
    <div class="badge-grid">${markup}</div>
  `;
}

function renderRoadmap(element) {
  const items = state.roadmap || [];
  const markup = items
    .map(
      (step) => `
        <div class="roadmap-step ${step.status}">
          <h3>${step.title}</h3>
          <div>${step.detail}</div>
        </div>
      `
    )
    .join('');

  element.innerHTML = `
    <div class="section-title">Roadmap</div>
    <div class="pipeline">
      <div class="pipeline-step active"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
      <div class="pipeline-step"></div>
    </div>
    <div class="roadmap-list" style="margin-top: 18px;">${markup}</div>
  `;
}

async function compileProgram(name) {
  const panel = document.getElementById('cpu-compile');
  try {
    const result = await fetchJson(`/api/compile?name=${encodeURIComponent(name || 'sum')}`);

    if (panel) {
      panel.innerHTML = `
        <div class="section-title">CPU Compile</div>
        <div class="language-card">
          <strong>Program: ${result.program}</strong>
          <span class="language-pill">${result.status}</span>
        </div>
        <div class="compile-output">${String(result.output || []).join('\n')}</div>
        <div>${result.log}</div>
        <button class="small-button" type="button">+${result.xp || 0} XP</button>
      `;
    }
  } catch (error) {
    console.error('Compilation failed:', error);
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
  const language = state.language || { name: 'Python', focus: 'Algorithms', skills: [], progress: 80 };
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
  const quiz = state.quiz;
  if (!quiz) return;

  const options = quiz.choices
    .map(
      (choice) => `<button class="quiz-option" data-choice="${choice}" type="button">${choice}</button>`
    )
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
        const payload = await fetchJson('/api/quiz/submit', {
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
  const list = state.glossary || [];
  const markup = list
    .map(
      (item) => `
        <div class="glossary-item">
          <h4>${item.term}</h4>
          <div>${item.definition}</div>
        </div>
      `
    )
    .join('');

  element.innerHTML = `
    <div class="section-title">Glossary</div>
    <div class="glossary-list">${markup}</div>
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
  const values = state.heatmap || [];
  const cells = values
    .flat()
    .map((value) => `<div class="heat-cell ${value ? 'active' : ''}"></div>`)
    .join('');

  element.innerHTML = `
    <div class="section-title">Activity Heatmap</div>
    <div class="heatmap-grid">${cells}</div>
  `;
}

function bindAutocomplete() {
  const input = document.getElementById('search-index');
  const list = document.getElementById('autocomplete');
  const items = state.autocomplete || [];

  if (!input || !list) return;

  const renderSuggestions = (term) => {
    const normalized = (term || '').trim();
    const filtered = items.filter((item) => item.toLowerCase().includes(normalized.toLowerCase()));
    list.innerHTML = filtered
      .slice(0, 6)
      .map((item) => `<button class="autocomplete-item" type="button">${item}</button>`)
      .join('');

    list.querySelectorAll('.autocomplete-item').forEach((button) => {
      button.addEventListener('click', () => {
        input.value = button.textContent.trim();
        list.innerHTML = '';
      });
    });
  };

  input.addEventListener('input', (event) => renderSuggestions(event.target.value));
}

function bindEvents() {
  const input = document.getElementById('search-index');
  if (input) {
    input.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        const q = input.value.trim();
        if (!q) return;
        try {
          const result = await fetchJson(`/api/search?q=${encodeURIComponent(q)}`);
          const list = document.getElementById('autocomplete');
          if (!list) return;
          list.innerHTML = result.items
            .map((item) => `<button class="autocomplete-item" type="button">${item}</button>`)
            .join('');
        } catch (error) {
          console.error('Search failed:', error);
        }
      }
    });
  }
}

function buildSearchIndex() {
  const input = document.getElementById('search-index');
  if (input) {
    input.value = 'compiler';
  }
}

function renderEvents(element) {
  const events = [
    { time: '09:42', text: 'Compiler optimization pass complete' },
    { time: '10:18', text: 'XP boost unlocked: pipeline mastery' },
    { time: '11:06', text: 'Roadmap milestone reached' },
    { time: '12:20', text: 'Quiz accuracy improved by 7%' }
  ];

  const markup = events
    .map(
      (event) => `
        <div class="event-item">
          <strong>${event.time}</strong>
          <span>${event.text}</span>
        </div>
      `
    )
    .join('');

  element.innerHTML = `
    <div class="section-title">Recent Events</div>
    <div class="event-list">${markup}</div>
  `;
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

async function bootstrap() {
  try {
    const data = await fetchJson('/api/dashboard');
    state.dashboard = data.dashboard || FALLBACK_DATA.dashboard;
    state.badges = data.badges || FALLBACK_DATA.badges;
    state.roadmap = data.roadmap || FALLBACK_DATA.roadmap;
    state.quiz = data.quiz || FALLBACK_DATA.quiz;
    state.language = data.language || FALLBACK_DATA.language;
    state.glossary = data.glossary || FALLBACK_DATA.glossary;
    state.autocomplete = data.autocomplete || FALLBACK_DATA.autocomplete;
    state.searchIndex = data.searchIndex || FALLBACK_DATA.searchIndex;
    state.heatmap = data.heatmap || FALLBACK_DATA.heatmap;
  } catch (error) {
    console.warn('Falling back to in-memory mock data:', error);
  }

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
  bindEvents();
  buildSearchIndex();
  initPipelineAnimation();

  const savedTheme = localStorage.getItem('cfTheme') || 'dark';
  applyTheme(savedTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      fetchJson('/api/theme', {
        method: 'POST',
        body: JSON.stringify({ theme: nextTheme }),
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => console.warn('Theme sync failed'));
    });
  }
}

window.addEventListener('DOMContentLoaded', bootstrap);
