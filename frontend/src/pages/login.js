import { apiFetch, setToken } from '../api.js';

export function attachEvents() {
  document.getElementById('go-register')?.addEventListener('click', () => window.navigateFromInline('register'));
  
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');
    
    if (!phone || !password) return alert('Enter phone and password');
    
    try {
      btn.disabled = true;
      btn.innerText = 'Logging in...';
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      
      setToken(data.token, data.user);
      window.navigateFromInline('dashboard');
    } catch (err) {
      alert(err.message);
      btn.disabled = false;
      btn.innerText = 'Login →';
    }
  });
}

export function render() {
  return `
  <div class="auth-root page">
    <div class="auth-topbar">
      <div class="lang-toggle">
        <button class="active">EN</button>
        <button>ಕನ್ನಡ</button>
      </div>
    </div>
    <div class="auth-hero">
      <div class="auth-logo-box">🐄</div>
      <h1 style="font-family:'Outfit',sans-serif;font-size:2.2rem;font-weight:800;">Gokulam</h1>
      <div class="kannada" style="color:var(--primary);font-size:1.05rem;margin-top:2px;">ಗೋಕುಲಂ</div>
      <div class="tagline">YOUR SMART FARM COMPANION</div>
    </div>
    <form class="auth-card" id="login-form">
      <div class="field-label">PHONE NUMBER</div>
      <div class="phone-input-row" style="margin-bottom:14px;">
        <div class="phone-prefix">+91</div>
        <input type="tel" id="login-phone" placeholder="Enter mobile number" maxlength="10" required />
      </div>
      
      <div class="field-label">PASSWORD</div>
      <div class="phone-input-row">
        <input type="password" id="login-password" placeholder="Enter password" required />
      </div>

      <button typs="submit" class="btn-primary" id="login-btn">Login &nbsp;→</button>
      <div class="auth-link-row">New Farmer? <a id="go-register" href="#">Register here</a></div>
    </form>
    <div class="auth-footer">© 2024 Gokulam Agrarian Systems. All rights reserved.</div>
  </div>`;
}
