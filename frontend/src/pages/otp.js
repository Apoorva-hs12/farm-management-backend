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
      <div style="font-family:'Outfit',sans-serif;">
        <span style="font-size:2rem;font-weight:800;">Gokulam</span>
        <div style="color:var(--primary);font-size:0.95rem;">ಗೋಕುಲಂ</div>
      </div>
    </div>
    <div class="auth-card" style="margin-top:0;">
      <div style="text-align:center;margin-bottom:22px;">
        <div style="font-size:1.4rem;font-weight:700;color:var(--text-dark);">Enter OTP</div>
        <div style="font-size:0.82rem;color:var(--text-light);margin-top:6px;">Sent to +91 98765 43210</div>
      </div>
      <div class="otp-row">
        <input type="text" maxlength="1" id="otp-1" />
        <input type="text" maxlength="1" id="otp-2" />
        <input type="text" maxlength="1" id="otp-3" />
        <input type="text" maxlength="1" id="otp-4" />
        <input type="text" maxlength="1" id="otp-5" />
        <input type="text" maxlength="1" id="otp-6" />
      </div>
      <div class="resend-row">Resend OTP in &nbsp;<span id="resend-timer">30s</span></div>
      <button class="btn-primary" id="verify-btn" style="margin-top:20px;">Verify &amp; Login →</button>
      <button class="btn-outline" id="back-btn">← Change Number</button>
    </div>
    <div class="auth-footer">© 2024 Gokulam Agrarian Systems. All rights reserved.</div>
  </div>`;
}
