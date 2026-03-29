import { setToken } from '../api.js';

export function attachEvents() {
  document.getElementById('go-login')?.addEventListener('click', () => window.navigateFromInline('login'));
  
  const createBtn = document.getElementById('create-btn');
  createBtn?.addEventListener('click', async () => {
    const name = document.getElementById('reg-name').value;
    const farm_name = document.getElementById('reg-farm').value;
    const village = document.getElementById('reg-village').value;
    const language = document.getElementById('reg-lang').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-pass').value;
    
    if (!name || !phone || !password) return alert('Name, phone, and password are required');
    
    try {
      createBtn.disabled = true;
      createBtn.innerText = 'Creating Account...';
      
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, farm_name, village, language, phone, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Auto login after register
      const loginRes = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error);
      
      setToken(loginData.token, loginData.user);
      window.navigateFromInline('dashboard');
    } catch (err) {
      alert(err.message);
      createBtn.disabled = false;
      createBtn.innerText = 'Create Account →';
    }
  });
}

export function render() {
  return `
  <div class="auth-root page">
    <div class="auth-topbar" style="justify-content:space-between;align-items:center;">
      <div style="font-family:'Outfit',sans-serif;">
        <span style="font-size:1.3rem;font-weight:800;">Gokulam</span>
        <div style="color:var(--primary);font-size:0.78rem;">ಗೋಕುಲಂ</div>
      </div>
      <div class="lang-toggle">
        <button class="active">EN</button>
        <button>ಕನ್ನಡ</button>
      </div>
    </div>
    <div class="auth-card register-card" style="margin-top:10px;width:min(500px,94vw);">
      <div style="margin-bottom:20px;">
        <div style="font-size:1.5rem;font-weight:800;color:var(--text-dark);">Create Account</div>
        <div style="font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-light);font-weight:700;margin-top:4px;">JOIN THE DIGITAL AGRARIAN MOVEMENT</div>
      </div>
      <div class="avatar-upload">
        <div class="field-label" style="margin-bottom:10px;">PROFILE PICTURE</div>
        <div class="avatar-box" id="avatar-upload-btn">
          <span class="icon">📷</span>
          <span>Add Photo</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-field">
          <label>FULL NAME *</label>
          <input type="text" id="reg-name" placeholder="Enter your full name" required />
        </div>
        <div class="form-field">
          <label>FARM NAME</label>
          <input type="text" id="reg-farm" placeholder="e.g. Green Valley Farm" />
        </div>
        <div class="form-grid-2">
          <div class="form-field">
            <label>VILLAGE / TOWN</label>
            <input type="text" id="reg-village" placeholder="Locality" />
          </div>
          <div class="form-field">
            <label>LANGUAGE</label>
            <select id="reg-lang">
              <option value="en">English (EN)</option>
              <option value="kn">ಕನ್ನಡ (KN)</option>
            </select>
          </div>
        </div>
        <div class="form-field">
          <label>PHONE NUMBER *</label>
          <div class="phone-input-row">
            <div class="phone-prefix">+91</div>
            <input type="tel" placeholder="00000 00000" maxlength="10" id="reg-phone" required />
          </div>
        </div>
        <div class="form-field">
          <label>PASSWORD *</label>
          <input type="password" id="reg-pass" placeholder="Create a strong password" required />
        </div>
      </div>
      <button class="btn-primary" id="create-btn" style="margin-top:20px;">Create Account →</button>
      <div class="auth-link-row">Already have an account? <a id="go-login" href="#">Login</a></div>
      <div class="trust-row">
        <div class="trust-badge">🔒 SECURE DATA</div>
        <div class="trust-badge">☁️ REAL-TIME SYNC</div>
      </div>
    </div>
    <div class="auth-footer">© 2024 Gokulam Agrarian Systems. All rights reserved.</div>
  </div>`;
}
