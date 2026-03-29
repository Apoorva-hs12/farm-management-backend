import { getUser, clearToken } from '../api.js';

export function sidebar(activePage = '') {
  return `
  <div class="sidebar-overlay" id="sidebar-overlay"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:1.4rem;">🐄</span>
        <div>
          <h2>Gokulam</h2>
          <div class="kn" style="font-size:0.78rem;color:var(--primary);">ಗೋಕುಲಂ</div>
        </div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" data-page="dashboard"><span class="nav-icon">⊞</span>Dashboard</div>
      <div class="nav-item ${activePage === 'livestock' ? 'active' : ''}" data-page="livestock"><span class="nav-icon">🐾</span>Livestock</div>
      <div class="nav-item ${activePage === 'health' ? 'active' : ''}" data-page="health"><span class="nav-icon">🩺</span>Health</div>
      <div class="nav-item ${activePage === 'finance' ? 'active' : ''}" data-page="finance"><span class="nav-icon">💳</span>Finance</div>
      <div class="nav-item ${activePage === 'reports' ? 'active' : ''}" data-page="reports"><span class="nav-icon">📊</span>Reports</div>
      <div class="nav-item ${activePage === 'settings' ? 'active' : ''}" data-page="settings"><span class="nav-icon">⚙️</span>Settings</div>
    </nav>
    <div class="sidebar-user" onclick="window.handleLogout()" style="cursor:pointer;" title="Click to Logout">
      <div class="sidebar-avatar">👨‍🌾</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${getUser()?.name || 'Farmer'}</div>
        <div class="sidebar-user-role">Logout / ಲಾಗೌಟ್</div>
      </div>
    </div>
  </aside>`;
}

export function topbar(title, kn = '', extra = '') {
  return `
  <header class="topbar">
    <div style="display:flex;align-items:center;gap:12px;">
      <span class="menu-toggle" id="menu-toggle">☰</span>
      <div class="topbar-title">
        <h1>${title}</h1>
        ${kn ? `<div class="kn-sub">${kn}</div>` : ''}
      </div>
    </div>
    <div class="topbar-right">
      ${extra}
      <div class="lang-toggle">
        <button class="active">EN</button>
        <button>ಕನ್ನಡ</button>
      </div>
      <div class="notif-btn"><span>🔔</span><div class="notif-dot"></div></div>
      <div class="topbar-user">
        <div class="topbar-user-role">Primary Farmer</div>
        <div class="topbar-user-name">${getUser()?.name || 'Farmer'}</div>
      </div>
      <div class="topbar-avatar">👨‍🌾</div>
    </div>
  </header>`;
}

// Global logout handler
window.handleLogout = () => {
  clearToken();
  window.navigateFromInline('login');
};
