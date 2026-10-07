const state = {
  theme: 'dark',
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
    ...options
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
  try {
    const result = await fetchJson(`/api/compile?name=${encodeURIComponent(name)}`);
    const panel = document.getElementById('cpu-compile');

    if (panel) {
      panel.innerHTML = `
        <div class="section-title">CPU Compile</div>
        <div class="language-card">
          <strong>Program: ${result.program}</strong>
          <span class="language-pill">${result.status}</span>
        </div>
        <div class="compile-output">${result.output.join('\n')}</div>
        <div>${result.log}</div>
        <button class="small-button" type="button">+${result.xp} XP</button>
      `;
    }
  } catch (error) {
    console.error('Compilation failed:', error);
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

  const renderSuggestions = (term) => {
    const filtered = items.filter((item) => item.toLowerCase().includes(term.toLowerCase()));
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
    state.dashboard = data.dashboard;
    state.badges = data.badges;
    state.roadmap = data.roadmap;
    state.quiz = data.quiz;
    state.language = data.language;
    state.glossary = data.glossary;
    state.autocomplete = data.autocomplete;
    state.searchIndex = data.searchIndex;
    state.heatmap = data.heatmap;
  } catch (error) {
    console.warn('Falling back to in-memory mock data:', error);
  }

  safeInit('dashboard', renderDashboard);
  safeInit('badges', renderBadges);
  safeInit('roadmap', renderRoadmap);
  safeInit('cpu-compile', compileProgram.bind(null, 'sum'));
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
        body: JSON.stringify({ theme: nextTheme })
      }).catch(() => console.warn('Theme sync failed'));
    });
  }
}

window.addEventListener('DOMContentLoaded', bootstrap);
