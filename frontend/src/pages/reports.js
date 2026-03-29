import { sidebar, topbar } from '../components/layout.js';
import { apiFetch, getUser } from '../api.js';

export async function attachEvents() {
  document.querySelectorAll('.month-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.month-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });
  
  try {
    const user = getUser();
    if (user && user.farm_name) {
      document.getElementById('report-farm').innerText = user.farm_name;
    }
    
    // Quick load basic stats combining endpoints
    // For a real app, you would have a dedicated /api/reports endpoint
    const d = new Date();
    const currentMonth = d.toISOString().slice(0, 7);
    const expenses = await apiFetch(`/expenses?month=${currentMonth}`);
    
    // Mocking report charts if API doesn't have deep history 
    // Usually these come from a specific aggregation query
    
    let totalExp = 0;
    expenses.forEach(e => totalExp += e.amount);
    
    document.getElementById('rep-exp').innerText = '₹' + totalExp.toLocaleString();
    
  } catch (err) {
    console.error(err);
  }
}

function lineChart() {
  return `
  <div style="height:200px;position:relative;margin-top:20px;width:100%;">
    <!-- Y Axis Lines -->
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;opacity:0.6;">
      <div style="border-bottom:1px dashed var(--border);height:0;"></div>
      <div style="border-bottom:1px dashed var(--border);height:0;"></div>
      <div style="border-bottom:1px dashed var(--border);height:0;"></div>
      <div style="border-bottom:1px dashed var(--black);height:0;"></div>
    </div>
    <!-- Simple SVG Line -->
    <svg viewBox="0 0 400 200" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,150 L66,120 L132,140 L198,80 L264,100 L330,40 L400,60 L400,200 L0,200 Z" fill="url(#lineGrad)"/>
      <path d="M0,150 L66,120 L132,140 L198,80 L264,100 L330,40 L400,60" fill="none" stroke="var(--primary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="66" cy="120" r="5" fill="#fff" stroke="var(--primary)" stroke-width="2"/>
      <circle cx="198" cy="80" r="5" fill="#fff" stroke="var(--primary)" stroke-width="2"/>
      <circle cx="330" cy="40" r="5" fill="#fff" stroke="var(--primary)" stroke-width="2"/>
    </svg>
    <div style="position:absolute;bottom:-25px;left:0;right:0;display:flex;justify-content:space-between;font-size:0.7rem;color:var(--text-light);font-weight:600;">
      <div>MAY</div><div>JUN</div><div>JUL</div><div>AUG</div><div>SEP</div><div>OCT</div>
    </div>
  </div>`;
}

export function render() {
  return `
  <div class="app-layout page">
    ${sidebar('reports')}
    <div class="main-content">
      ${topbar('Reports / ವರದಿಗಳು','FARM PERFORMANCE')}
      <div class="page-content">
        
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px;">
          <div>
            <div style="font-size:1.6rem;font-family:'Outfit',sans-serif;font-weight:800;color:var(--text-dark);" id="report-farm">Gokulam Farm</div>
            <div style="font-size:0.85rem;color:var(--text-light);">Financial Year 2023-24 Performance</div>
          </div>
          <button style="background:var(--primary);color:#fff;border-radius:8px;padding:10px 16px;font-weight:600;display:flex;align-items:center;gap:8px;border:none;cursor:pointer;">
             Download Last Month PDF
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 340px;gap:20px;">
          
          <div style="display:flex;flex-direction:column;gap:20px;">
            <div class="card" style="padding:24px;border-radius:12px;background:#fff;border:1px solid #eee;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <div style="font-weight:800;color:var(--text-dark);font-size:1.1rem;">6-Month Revenue Trend</div>
                <div class="category-tabs" style="display:flex;gap:8px;">
                  <div class="cat-tab active" style="padding:4px 12px;border-radius:16px;font-size:0.75rem;">Milk</div>
                  <div class="cat-tab" style="padding:4px 12px;border-radius:16px;font-size:0.75rem;">Eggs</div>
                  <div class="cat-tab" style="padding:4px 12px;border-radius:16px;font-size:0.75rem;">Total</div>
                </div>
              </div>
              <div style="display:flex;gap:30px;margin-bottom:10px;">
                <div>
                  <div style="font-size:0.75rem;color:var(--text-light);font-weight:700;">TOTAL REVENUE</div>
                  <div style="font-size:1.8rem;font-family:'Outfit',sans-serif;font-weight:800;color:var(--text-dark);">₹4,20,500</div>
                </div>
                <div>
                  <div style="font-size:0.75rem;color:var(--text-light);font-weight:700;">AVERAGE MONTHLY</div>
                  <div style="font-size:1.8rem;font-family:'Outfit',sans-serif;font-weight:800;color:var(--text-dark);">₹70,083</div>
                </div>
              </div>
              ${lineChart()}
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
              <div class="card" style="padding:24px;border-radius:12px;background:#fff;border:1px solid #eee;">
                <div style="font-weight:800;color:var(--text-dark);font-size:1rem;margin-bottom:12px;">Top Expense Categories</div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;margin-bottom:4px;"><span>Cattle Feed</span><span>₹1,85,000</span></div>
                    <div style="background:#f1f5f9;height:8px;border-radius:4px;width:100%;overflow:hidden;"><div style="background:var(--primary);height:100%;width:65%;"></div></div>
                  </div>
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;margin-bottom:4px;"><span>Labour</span><span>₹72,000</span></div>
                    <div style="background:#f1f5f9;height:8px;border-radius:4px;width:100%;overflow:hidden;"><div style="background:var(--orange);height:100%;width:25%;"></div></div>
                  </div>
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;margin-bottom:4px;"><span>Veterinary</span><span>₹28,500</span></div>
                    <div style="background:#f1f5f9;height:8px;border-radius:4px;width:100%;overflow:hidden;"><div style="background:var(--purple);height:100%;width:10%;"></div></div>
                  </div>
                </div>
              </div>
              <div class="card" style="padding:24px;border-radius:12px;background:#fff;border:1px solid #eee;">
                <div style="font-weight:800;color:var(--text-dark);font-size:1rem;margin-bottom:12px;">Health & Metrics</div>
                <div style="display:flex;flex-direction:column;gap:16px;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;border-radius:8px;background:#eef6ff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📈</div>
                    <div>
                      <div style="font-size:0.75rem;color:var(--text-light);font-weight:700;">PROFIT MARGIN</div>
                      <div style="font-size:1.1rem;font-weight:800;">34.2% <span style="font-size:0.75rem;color:var(--primary);margin-left:4px;">↑ 2.1%</span></div>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;border-radius:8px;background:#fff3f3;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🍼</div>
                    <div>
                      <div style="font-size:0.75rem;color:var(--text-light);font-weight:700;">AVG MILK/COW/DAY</div>
                      <div style="font-size:1.1rem;font-weight:800;">14.5 L <span style="font-size:0.75rem;color:var(--danger);margin-left:4px;">↓ 0.2 L</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div style="display:flex;flex-direction:column;gap:20px;">
            <div class="card" style="padding:0;border-radius:12px;background:#fff;border:1px solid #eee;overflow:hidden;">
              <div style="padding:16px 20px;border-bottom:1px solid #eee;font-weight:800;color:var(--primary-dark);background:#f8fafc;">
                October Estimate
              </div>
              <div style="padding:20px;">
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed #e2e8f0;padding-bottom:12px;margin-bottom:12px;">
                  <span style="font-size:0.9rem;color:var(--text-light);font-weight:600;">Proj. Income</span>
                  <span style="font-size:1.1rem;font-weight:800;color:var(--primary);">₹1,45,000</span>
                </div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed #e2e8f0;padding-bottom:12px;margin-bottom:12px;">
                  <span style="font-size:0.9rem;color:var(--text-light);font-weight:600;">Proj. Expenses</span>
                  <span style="font-size:1.1rem;font-weight:800;color:var(--danger);" id="rep-exp">₹42,850</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:20px;background:#f0fae6;padding:12px;border-radius:8px;border:1px solid #dcf2c6;">
                  <span style="font-size:0.95rem;font-weight:700;color:#2c5e00;">EST. PROFIT</span>
                  <span style="font-size:1.2rem;font-weight:800;color:#2c5e00;">₹1,02,150</span>
                </div>
              </div>
            </div>

            <div class="card" style="padding:24px;border-radius:12px;background:var(--primary-dark);color:#fff;text-align:center;">
              <div style="font-size:2rem;margin-bottom:8px;">🎯</div>
              <div style="font-size:1.1rem;font-weight:800;margin-bottom:8px;">Yearly Goal Tracker</div>
              <div style="font-size:0.8rem;opacity:0.8;margin-bottom:16px;line-height:1.4;">You are on track to exceed your annual revenue target by 14%. Keep optimizing feed costs!</div>
              <button style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);padding:8px 16px;color:#fff;border-radius:8px;font-weight:600;">Adjust Goals</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>`;
}
