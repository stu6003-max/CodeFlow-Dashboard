* {
  box-sizing: border-box;
}

:root {
  --bg: #080d18;
  --bg-strong: #101a2b;
  --panel: rgba(17, 27, 40, 0.92);
  --panel-alt: rgba(13, 21, 31, 0.96);
  --line: rgba(148, 163, 184, 0.18);
  --text: #e6edf7;
  --muted: #8ea3bf;
  --accent: #7c9cff;
  --accent-2: #54d3ff;
  --success: #3ddc97;
  --warning: #ffbf69;
  --danger: #ff5f7a;
  --shadow: rgba(0, 0, 0, 0.35);
}

[data-theme='light'] {
  --bg: #edf4ff;
  --bg-strong: #dfeaff;
  --panel: rgba(255, 255, 255, 0.9);
  --panel-alt: rgba(243, 247, 255, 0.95);
  --line: rgba(109, 128, 158, 0.18);
  --text: #101827;
  --muted: #53647c;
  --accent: #345cf7;
  --accent-2: #1296d9;
  --success: #1db36a;
  --warning: #f59e0b;
  --danger: #ef476f;
  --shadow: rgba(53, 77, 125, 0.12);
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: radial-gradient(circle at top left, rgba(124, 156, 255, 0.18), transparent 30%), linear-gradient(135deg, var(--bg), var(--bg-strong));
  color: var(--text);
  font-family: Inter, 'Segoe UI', sans-serif;
}

body {
  padding: 24px;
}

button, input, textarea {
  font: inherit;
}

.hidden {
  display: none !important;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 20px 40px var(--shadow);
  backdrop-filter: blur(16px);
}

.auth-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.auth-card {
  width: min(460px, 90vw);
  padding: 28px 24px;
}

.auth-title {
  margin: 18px 0 20px;
  font-size: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--muted);
}

.auth-form input {
  width: 100%;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--text);
}

.auth-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.primary-button,
.secondary-button,
.ghost-button,
.small-button,
.quiz-option,
.autocomplete-item {
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.primary-button,
.secondary-button,
.small-button {
  border: none;
  padding: 10px 16px;
  font-weight: 600;
}

.primary-button {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
}

.secondary-button {
  background: rgba(255,255,255,0.04);
  color: var(--text);
  border: 1px solid var(--line);
}

.ghost-button {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--line);
  color: var(--text);
  padding: 10px 12px;
}

.ghost-button.danger {
  border-color: rgba(255,95,122,0.4);
  color: var(--danger);
}

.primary-button:hover,
.secondary-button:hover,
.ghost-button:hover,
.small-button:hover,
.quiz-option:hover,
.autocomplete-item:hover {
  transform: translateY(-1px);
}

.auth-status {
  min-height: 22px;
  margin-top: 14px;
  color: var(--warning);
}

.app-shell {
  max-width: 1500px;
  margin: 0 auto;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  margin-bottom: 20px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
  font-weight: 800;
  box-shadow: 0 12px 24px rgba(124, 156, 255, 0.45);
}

.eyebrow {
  color: var(--muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
}

.sidebar {
  padding: 18px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.nav-item {
  text-align: left;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--text);
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
}

.nav-item.active,
.nav-item:hover {
  background: linear-gradient(135deg, rgba(124, 156, 255, 0.18), rgba(84, 211, 255, 0.08));
  border-color: rgba(124, 156, 255, 0.5);
}

.mini-panel {
  margin-top: 18px;
  padding: 12px;
  border-radius: 12px;
  background: var(--panel-alt);
  border: 1px solid var(--line);
}

.mini-label {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.xp-bar {
  width: 100%;
  height: 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--line);
}

.xp-fill {
  height: 100%;
  width: 78%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.search-input {
  width: 100%;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.02);
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--text);
}

.autocomplete-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.autocomplete-item {
  padding: 6px 10px;
  background: rgba(124, 156, 255, 0.12);
  border: 1px solid rgba(124, 156, 255, 0.28);
  color: var(--text);
  font-size: 12px;
}

.content-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  padding: 18px 20px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 1.2rem;
}

.muted-text {
  color: var(--muted);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 14px;
}

.stat-card {
  background: var(--panel-alt);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px;
}

.stat-label {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-value {
  margin-top: 12px;
  font-size: clamp(1.4rem, 2vw, 2rem);
  font-weight: 700;
}

.stat-delta {
  margin-top: 8px;
  color: var(--success);
  font-size: 12px;
}

.activity-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.activity-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-track {
  position: relative;
  height: 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--line);
}

.progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--success));
}

.badge-grid,
.roadmap-list,
.glossary-list,
.quiz-options {
  display: grid;
  gap: 14px;
}

.badge-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.badge-card {
  background: var(--panel-alt);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px;
}

.badge-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.badge-icon {
  font-size: 1.8rem;
}

.badge-tier {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--warning);
}

.roadmap-list {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.roadmap-step {
  padding: 16px;
  background: var(--panel-alt);
  border: 1px solid var(--line);
  border-radius: 14px;
  position: relative;
  overflow: hidden;
}

.roadmap-step::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--accent);
  opacity: 0.7;
}

.roadmap-step.completed {
  border-color: rgba(61, 220, 151, 0.5);
}

.roadmap-step.active {
  border-color: rgba(124, 156, 255, 0.6);
  box-shadow: 0 0 0 1px rgba(124, 156, 255, 0.2);
}

.roadmap-step.pending {
  opacity: 0.75;
}

.pipeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(60px, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.pipeline-step {
  height: 14px;
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
  transition: all 0.2s ease;
}

.pipeline-step.active {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 18px rgba(124, 156, 255, 0.6);
}

.two-column-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.compile-output {
  margin-top: 14px;
  background: rgba(13,21,31,0.9);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  white-space: pre-wrap;
  color: var(--success);
}

.small-button {
  padding: 10px 12px;
  margin-top: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
  border: none;
}

.language-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.language-pill {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(84, 211, 255, 0.08);
  border: 1px solid rgba(84, 211, 255, 0.2);
  color: var(--accent-2);
  font-size: 12px;
}

.inline-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.inline-pill {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--muted);
  font-size: 12px;
}

.editor-box {
  width: 100%;
  min-height: 160px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(6, 10, 18, 0.8);
  color: var(--text);
  padding: 12px;
  resize: vertical;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.quiz-option {
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--line);
  color: var(--text);
  text-align: left;
}

.glossary-item {
  background: var(--panel-alt);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
}

.glossary-item h4 {
  margin: 0 0 8px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.event-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.02);
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(8, minmax(26px, 1fr));
  gap: 8px;
  margin-top: 14px;
}

.heat-cell {
  aspect-ratio: 1;
  border-radius: 8px;
  background: rgba(124, 156, 255, 0.15);
}

.heat-cell.active {
  background: linear-gradient(135deg, var(--accent), var(--success));
}

@media (max-width: 980px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .two-column-grid,
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
