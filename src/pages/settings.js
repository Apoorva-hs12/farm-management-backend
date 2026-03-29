import { sidebar, topbar } from '../components/layout.js';
import { getUser, setUser, apiFetch, clearToken } from '../api.js';

export function attachEvents() {
  const user = getUser();
  
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', async (e) => {
      const isDark = e.target.checked;
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
      
      try {
        const res = await apiFetch('/users/settings', {
          method: 'PUT',
          body: JSON.stringify({ dark_mode: isDark })
        });
        if (res.user) setUser(res.user);
      } catch (err) {
        console.error('Failed to save theme preference', err);
      }
    });
  }

  // Language Toggle
  const langToggleBtns = document.querySelectorAll('.lang-toggle button');
  langToggleBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const lang = btn.textContent.includes('EN') ? 'en' : 'kn';
      try {
        const res = await apiFetch('/users/settings', {
          method: 'PUT',
          body: JSON.stringify({ language: lang })
        });
        if (res.user) {
          setUser(res.user);
          window.location.reload(); // Reload to apply language change globally
        }
      } catch (err) {
        console.error('Failed to change language', err);
      }
    });
  });

  // Edit Profile (Simple prompt for now)
  const editBtn = document.getElementById('edit-profile-btn');
  if (editBtn) {
    editBtn.addEventListener('click', async () => {
      const newName = prompt('Enter your full name:', user.name);
      const newFarm = prompt('Enter farm name:', user.farm_name);
      
      if (newName || newFarm) {
        try {
          const res = await apiFetch('/users/settings', {
            method: 'PUT',
            body: JSON.stringify({ name: newName, farm_name: newFarm })
          });
          if (res.user) {
            setUser(res.user);
            window.navigateFromInline('settings');
          }
        } catch (err) {
          alert('Update failed');
        }
      }
    });
  }

  // Sign Out
  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      clearToken();
      window.navigateFromInline('login');
    });
  }
}

export function render() {
  const user = getUser();
  const name = user?.name || 'Farmer';
  const farmName = user?.farm_name || 'My Farm';
  const village = user?.village || 'Unknown';
  const phone = user?.phone || 'Unknown';
  const isDark = user?.dark_mode || false;
  const lang = user?.language || 'en';
  const profilePic = user?.profile_pic || '👨‍🌾';

  return `
  <div class="app-layout page">
    ${sidebar('settings')}
    <div class="main-content">
      ${topbar(lang === 'kn' ? 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು' : 'Settings','')}
      <div class="page-content" style="max-width:600px;">
        <div style="display:flex;align-items:center;gap:16px;background:var(--bg-card);border-radius:var(--radius-xl);padding:22px;box-shadow:var(--shadow-sm);margin-bottom:20px;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--primary-pale);display:flex;align-items:center;justify-content:center;font-size:2rem;border:3px solid var(--primary);">${profilePic}</div>
          <div>
            <div style="font-size:1.1rem;font-weight:700;">${name}</div>
            <div style="font-size:0.78rem;color:var(--primary);">${lang === 'kn' ? 'ಪ್ರಮುಖ ರೈತ' : 'Lead Farmer'} • ${farmName}</div>
            <div style="font-size:0.72rem;color:var(--text-light);margin-top:2px;">+91 ${phone} • ${village}</div>
          </div>
          <button id="edit-profile-btn" style="margin-left:auto;background:var(--bg);border:1.5px solid var(--border);border-radius:var(--radius-md);padding:8px 14px;font-size:0.8rem;font-weight:600;color:var(--text-mid);cursor:pointer;">${lang === 'kn' ? 'ತಿದ್ದು' : 'Edit'}</button>
        </div>

        <div class="settings-group">
          <div class="settings-group-title">${lang === 'kn' ? 'ಫಾರ್ಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು' : 'Farm Settings'}</div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-icon">🏡</span>
              <div><div class="settings-row-text">${lang === 'kn' ? 'ಫಾರ್ಮ್ ಹೆಸರು' : 'Farm Name'}</div><div class="settings-row-sub">${farmName}</div></div>
            </div>
            <span class="settings-chevron">›</span>
          </div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-icon">📍</span>
              <div><div class="settings-row-text">${lang === 'kn' ? 'ಸ್ಥಳ' : 'Location'}</div><div class="settings-row-sub">${village}</div></div>
            </div>
            <span class="settings-chevron">›</span>
          </div>
        </div>

        <div class="settings-group">
          <div class="settings-group-title">${lang === 'kn' ? 'ಆದ್ಯತೆಗಳು' : 'Preferences'}</div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-icon">🌐</span>
              <div><div class="settings-row-text">${lang === 'kn' ? 'ಭಾಷೆ' : 'Language'}</div></div>
            </div>
            <div class="lang-toggle">
              <button class="${lang === 'en' ? 'active' : ''}">EN</button>
              <button class="${lang === 'kn' ? 'active' : ''}">ಕನ್ನಡ</button>
            </div>
          </div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-icon">🌙</span>
              <div><div class="settings-row-text">${lang === 'kn' ? 'ಡಾರ್ಕ್ ಮೋಡ್' : 'Dark Mode'}</div></div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="theme-toggle" ${isDark ? 'checked' : ''} />
              <div class="toggle-track"></div>
            </label>
          </div>
        </div>

        <div class="settings-group">
          <div class="settings-group-title">Data & Privacy</div>
          <div class="settings-row"><div class="settings-row-left"><span class="settings-row-icon">☁️</span><div><div class="settings-row-text">Backup Data</div><div class="settings-row-sub">Last synced: Today 6:00 PM</div></div></div><span class="settings-chevron">›</span></div>
        </div>

        <button id="sign-out-btn" style="width:100%;background:var(--red-pale);border:1.5px solid #f5c0c0;border-radius:var(--radius-md);padding:13px;font-size:0.88rem;font-weight:600;color:var(--red);cursor:pointer;margin-bottom:20px;">${lang === 'kn' ? 'ಲಾಗ್ ಔಟ್' : 'Sign Out'}</button>
        <div style="text-align:center;font-size:0.72rem;color:var(--text-muted);">Gokulam v2.1.0 • © 2024 Gokulam Agrarian Systems</div>
      </div>
    </div>
  </div>`;
}
