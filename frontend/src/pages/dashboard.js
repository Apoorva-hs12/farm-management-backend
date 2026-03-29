import { sidebar, topbar } from '../components/layout.js';
import { apiFetch } from '../api.js';

export async function attachEvents() {
  document.getElementById('fab-btn')?.addEventListener('click', () => window.navigateFromInline('livestock'));

  try {
    const data = await apiFetch('/dashboard');
    document.getElementById('dash-milk').innerText = Math.round(data.todayMilk);
    document.getElementById('dash-earn').innerText = '₹' + Math.round(data.todayEarnings).toLocaleString();
    document.getElementById('dash-anim').innerText = data.totalAnimals;
    
    const trendEl = document.getElementById('dash-trend');
    if (trendEl && data.milkTrend && data.milkTrend.length > 0) {
      trendEl.innerHTML = barChart(data.milkTrend.map(t => t.total), data.milkTrend.map(t => new Date(t.date).toLocaleDateString('en-US', {weekday:'short'}).toUpperCase()));
    }
  } catch (err) {
    console.error('Failed to load dashboard:', err);
  }
}

function barChart(data, labels) {
  const max = Math.max(...data, 1);
  return `
  <div class="bar-chart">
    ${data.map((val, i) => `
      <div class="bar-col">
        <div class="bar-fill" style="height:${(val/max)*100}%; background: ${i === data.length-1 ? 'var(--primary)' : 'var(--border)'}"></div>
      </div>
    `).join('')}
  </div>
  <div class="chart-labels">
    ${labels.map(l => `<div>${l}</div>`).join('')}
  </div>
  <style>
    .bar-chart { display:flex; height:120px; align-items:flex-end; gap:8px; justify-content:space-between; margin-bottom:8px;}
    .bar-col { flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; }
    .bar-fill { width:100%; border-radius:4px 4px 0 0; }
    .chart-labels { display:flex; justify-content:space-between; font-size:0.65rem; color:var(--text-light); font-weight:600;}
  </style>
  `;
}

function donutChart() {
  return `
  <div class="donut-chart">
    <div class="donut-center">₹42k</div>
  </div>
  <style>
    .donut-chart { width:120px; height:120px; border-radius:50%; background:conic-gradient(var(--primary) 0% 65%, var(--orange) 65% 90%, var(--purple) 90% 100%); position:relative; }
    .donut-center { position:absolute; inset:16px; background:var(--surface); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.9rem;}
    .donut-wrap { display:flex; align-items:center; gap:24px; }
    .donut-legend { flex:1; display:flex; flex-direction:column; gap:8px; font-size:0.85rem;}
    .legend-item { display:flex; align-items:center; gap:8px; justify-content:space-between; }
    .legend-dot { width:10px; height:10px; border-radius:3px; }
    .legend-pct { font-weight:700;}
  </style>
  `;
}

export function render() {
  const milkData = [0, 0, 0, 0, 0, 0, 0];
  const milkLabels = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  return `
  <div class="app-layout page">
    ${sidebar('dashboard')}
    <div class="main-content">
      ${topbar('Dashboard','')}
      <div class="page-content">
        <div class="stats-grid">
          <div class="stat-card green">
            <div class="stat-label">TODAY'S MILK</div>
            <div class="stat-value"><span id="dash-milk">0</span><span class="unit">Liters</span></div>
          </div>
          <div class="stat-card teal">
            <div class="stat-label">TODAY'S EARNINGS</div>
            <div class="stat-value" id="dash-earn" style="font-size:1.5rem;">₹0</div>
            <div class="stat-change pos">+12%</div>
          </div>
          <div class="stat-card orange">
            <div class="stat-label">TOTAL ANIMALS</div>
            <div class="stat-value"><span id="dash-anim">0</span><span class="unit">Cattle</span></div>
          </div>
          <div class="stat-card red">
            <div class="stat-label">PENDING ALERTS</div>
            <div class="stat-value" style="color:var(--red);">03<span class="unit" style="color:var(--red);font-size:0.75rem;">Critical</span></div>
          </div>
        </div>

        <div class="dash-grid">
          <div class="dash-col">
            <div class="section-card">
              <div class="section-header">
                <div class="section-title">Today's Alerts <span class="kn">ಇಂದಿನ ಎಚ್ಚರಿಕೆಗಳು</span></div>
                <div class="view-all" onclick="navigateFromInline('health')">View All</div>
              </div>
              <div class="alert-item priority">
                <div class="alert-icon blue">💉</div>
                <div class="alert-body">
                  <div class="alert-title">Vaccination Due</div>
                  <div class="alert-desc">FMD Booster for Herd B (12 Cows)</div>
                </div>
                <div class="alert-badge">
                  <div class="alert-badge-label priority">PRIORITY</div>
                  <div class="alert-date">Oct 24</div>
                </div>
              </div>
              <div class="alert-item attention">
                <div class="alert-icon purple">🤰</div>
                <div class="alert-body">
                  <div class="alert-title">Expected Calving</div>
                  <div class="alert-desc">Cow #GOK-204 (Gauri) is near term</div>
                </div>
                <div class="alert-badge">
                  <div class="alert-badge-label attention">ATTENTION</div>
                  <div class="alert-date">Tomorrow</div>
                </div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="section-card">
                <div class="section-title" style="margin-bottom:12px;">Milk Production (7 Days)</div>
                <div id="dash-trend">
                  ${barChart(milkData, milkLabels)}
                </div>
              </div>
              <div class="section-card">
                <div class="section-title" style="margin-bottom:12px;">Monthly Expenses</div>
                <div class="donut-wrap">
                  ${donutChart()}
                  <div class="donut-legend">
                    <div class="legend-item"><div class="legend-dot" style="background:var(--primary)"></div><span>Feed</span><span class="legend-pct" style="margin-left:4px;">65%</span></div>
                    <div class="legend-item"><div class="legend-dot" style="background:var(--orange)"></div><span>Health</span><span class="legend-pct" style="margin-left:4px;">25%</span></div>
                    <div class="legend-item"><div class="legend-dot" style="background:var(--purple)"></div><span>Other</span><span class="legend-pct" style="margin-left:4px;">10%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="dash-col">
            <div class="section-card">
              <div class="section-title" style="margin-bottom:16px;">Recent Activity</div>
              <div class="activity-feed">
                <div class="activity-item">
                  <div class="alert-icon light-blue">💧</div>
                  <div class="alert-body">
                    <div class="alert-title list-title">Evening Milking Done</div>
                    <div class="alert-desc list-desc">18:45 PM • Shed A</div>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="alert-icon light-green">💳</div>
                  <div class="alert-body">
                    <div class="alert-title list-title">Payment Received</div>
                    <div class="alert-desc list-desc">15:20 PM • Dairy Cooperative</div>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="alert-icon light-gray">🩺</div>
                  <div class="alert-body">
                    <div class="alert-title list-title">Vet Visit Completed</div>
                    <div class="alert-desc list-desc">11:00 AM • Routine Checkup</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="hero-card">
              <div class="hero-icon">📈</div>
              <div class="hero-title">Your herd's health is up 5%</div>
              <div class="hero-desc">Based on the last 30 days of medical checkups and milk quality tests, your farm performance is improving.</div>
              <button class="hero-btn">Download Report</button>
            </div>
          </div>
        </div>
      </div>
      <button class="fab" id="fab-btn">+</button>
    </div>
  </div>`;
}
