// ===== GOKULAM APP ROUTER =====
import { getToken, getUser } from './api.js';

const app = document.getElementById('app');
export let currentPage = 'login';
let sidebarOpen = false;

const routes = {
  login: () => import('./pages/login.js').then(m => m.render()),
  otp: () => import('./pages/otp.js').then(m => m.render()),
  register: () => import('./pages/register.js').then(m => m.render()),
  dashboard: () => import('./pages/dashboard.js').then(m => m.render()),
  livestock: () => import('./pages/livestock.js').then(m => m.render()),
  health: () => import('./pages/health.js').then(m => m.render()),
  finance: () => import('./pages/finance.js').then(m => m.render()),
  reports: () => import('./pages/reports.js').then(m => m.render()),
  settings: () => import('./pages/settings.js').then(m => m.render()),
};

const protectedRoutes = ['dashboard', 'livestock', 'health', 'finance', 'reports', 'settings'];

window.navigate = async function(page) {
  // Auth guards
  const hasToken = !!getToken();
  if (protectedRoutes.includes(page) && !hasToken) {
    page = 'login';
  } else if ((page === 'login' || page === 'register' || page === 'otp') && hasToken) {
    page = 'dashboard';
  }

  currentPage = page;
  app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;"><div style="width:36px;height:36px;border:3px solid var(--primary-pale);border-top-color:var(--primary);border-radius:50%;animation:spin 0.7s linear infinite"></div></div>';
  if (!document.getElementById('spin-style')) {
    const s = document.createElement('style');
    s.id = 'spin-style';
    s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }
  const fn = routes[page];
  if (fn) {
    const html = await fn();
    app.innerHTML = html;
    attachEvents(page);
  }
};

function attachEvents(page) {
  // Sidebar nav
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      navigate(el.dataset.page);
      closeSidebar();
    });
  });
  // Mobile menu toggle
  const toggle = document.getElementById('menu-toggle');
  if (toggle) toggle.addEventListener('click', toggleSidebar);
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.addEventListener('click', closeSidebar);
  
  // Page-specific setup (we now call attach methods imported per page or handled dynamically)
  import(`./pages/${page}.js`).then(m => {
    if (m.attachEvents) m.attachEvents();
  });
}

function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  document.getElementById('sidebar')?.classList.toggle('open', sidebarOpen);
  document.getElementById('sidebar-overlay')?.classList.toggle('active', sidebarOpen);
}
function closeSidebar() {
  sidebarOpen = false;
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
}

// Global functions for inline HTML event handlers
window.navigateFromInline = (page) => { navigate(page); };

// Boot
const user = getUser();
if (user) {
  if (user.dark_mode) document.body.setAttribute('data-theme', 'dark');
  document.documentElement.lang = user.language || 'en';
}

const token = getToken();
navigate(token ? 'dashboard' : 'login');

