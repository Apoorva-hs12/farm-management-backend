import { sidebar, topbar } from '../components/layout.js';
import { apiFetch } from '../api.js';

let currentCategory = 'Feed';
let currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

export async function attachEvents() {
  document.querySelectorAll('.cat-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      currentCategory = t.innerText;
    });
  });

  document.getElementById('month-select')?.addEventListener('change', (e) => {
    currentMonth = e.target.value;
    loadExpenses();
  });

  const saveBtn = document.getElementById('save-expense-btn');
  saveBtn?.addEventListener('click', async () => {
    const amount = document.getElementById('exp-amount').value;
    const date = document.getElementById('exp-date').value;
    const notes = document.getElementById('exp-notes').value;
    
    if (!amount || !date) return alert('Amount and Date are required');
    
    try {
      saveBtn.disabled = true;
      saveBtn.innerText = 'Saving...';
      
      await apiFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify({ category: currentCategory, amount, date, notes, status: 'paid' })
      });
      
      // reset form
      document.getElementById('exp-amount').value = '';
      document.getElementById('exp-notes').value = '';
      loadExpenses();
    } catch (err) {
      alert(err.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerText = 'Save Expense / ಉಳಿಸಿ';
    }
  });

  loadExpenses();
}

async function loadExpenses() {
  const listEl = document.getElementById('expense-list');
  const totalEl = document.getElementById('month-total-amount');
  if (!listEl) return;
  
  try {
    const data = await apiFetch(`/expenses?month=${currentMonth}`);
    
    if (data.length === 0) {
      listEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-light);">No expenses recorded for this month.</div>';
      totalEl.innerText = '₹0.00';
      return;
    }

    let total = 0;
    const html = data.map(e => {
      total += e.amount;
      const dateStr = new Date(e.date).toLocaleDateString();
      const color = e.category === 'Feed' ? 'var(--primary)' : e.category === 'Medicine' ? 'var(--purple)' : 'var(--orange)';
      return `
      <div class="expense-row" style="display:flex;padding:12px;background:#fff;border-radius:8px;border:1px solid #eee;margin-bottom:8px;align-items:center;">
        <div class="expense-dot" style="width:12px;height:12px;border-radius:50%;background:${color};margin-right:12px;"></div>
        <div class="expense-info" style="flex:1;">
          <div class="expense-name" style="font-weight:700;font-size:0.95rem;">${e.notes ? (e.category + ' - ' + e.notes) : e.category}</div>
          <div class="expense-meta" style="font-size:0.75rem;color:var(--text-light);margin-top:4px;">${e.category} • ${dateStr}</div>
        </div>
        <div class="expense-right" style="text-align:right;">
          <div class="expense-amount" style="font-weight:800;font-size:1.1rem;color:var(--text-dark);">– ₹${e.amount.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
          <div class="expense-status paid" style="font-size:0.7rem;font-weight:700;color:var(--primary);margin-top:4px;">${e.status.toUpperCase()}</div>
        </div>
      </div>`;
    }).join('');

    listEl.innerHTML = html;
    totalEl.innerText = '₹' + total.toLocaleString(undefined, {minimumFractionDigits: 2});

  } catch (err) {
    console.error(err);
    listEl.innerHTML = '<div style="color:red">Error loading expenses</div>';
  }
}

export function render() {
  const d = new Date();
  const tm = d.toISOString().slice(0, 7);
  d.setMonth(d.getMonth() - 1);
  const lm = d.toISOString().slice(0, 7);

  return `
  <div class="app-layout page">
    ${sidebar('finance')}
    <div class="main-content">
      ${topbar('Finance / ಖರ್ಚು','FINANCIAL RECORDS')}
      <div class="page-content">
        <div class="expense-top-bar" style="display:flex;align-items:center;justify-content:space-between;background:var(--primary-dark);color:#fff;padding:24px;border-radius:16px;margin-bottom:24px;">
          <div class="month-total">
            <div class="label-small" style="font-size:0.7rem;letter-spacing:0.05em;opacity:0.8;">MONTHLY TOTAL • ಈ ತಿಂಗಳ ಒಟ್ಟು</div>
            <div class="big-num" id="month-total-amount" style="font-size:2.4rem;font-family:'Outfit',sans-serif;font-weight:800;margin-top:4px;">₹0.00</div>
          </div>
          <button style="background:#fff;color:var(--primary-dark);border:none;padding:10px 20px;border-radius:8px;font-weight:700;cursor:pointer;">+ Add Expense</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
          <div>
            <div class="card" style="padding:24px;border-radius:12px;background:#fff;border:1px solid #eee;">
              <div style="font-size:1.2rem;font-weight:800;margin-bottom:20px;color:var(--primary-dark);">New Entry <span style="font-size:0.8rem;color:var(--text-light);font-weight:500;">/ ಹೊಸ ದಾಖಲೆ</span></div>
              <div class="category-tabs" style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
                ${['Feed','Medicine','Labour','Veterinary','Other'].map((c,i)=>`<div class="cat-tab${i===0?' active':''}" style="padding:6px 14px;border-radius:20px;font-size:0.85rem;font-weight:600;cursor:pointer;border:1px solid var(--border);">${c}</div>`).join('')}
              </div>
              <div style="margin-bottom:16px;">
                <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-light);margin-bottom:8px;">AMOUNT (₹)</label>
                <input type="number" id="exp-amount" style="width:100%;padding:12px;border-radius:8px;border:1px solid #ddd;font-size:1rem;font-weight:600;" placeholder="0.00" />
              </div>
              <div style="margin-bottom:16px;">
                <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-light);margin-bottom:8px;">DATE</label>
                <input type="date" id="exp-date" value="${new Date().toISOString().split('T')[0]}" style="width:100%;padding:12px;border-radius:8px;border:1px solid #ddd;font-family:inherit;" />
              </div>
              <div style="margin-bottom:20px;">
                <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-light);margin-bottom:8px;">NOTES</label>
                <textarea id="exp-notes" style="width:100%;padding:12px;border-radius:8px;border:1px solid #ddd;font-family:inherit;resize:none;height:80px;" placeholder="Details about this expense..."></textarea>
              </div>
              <button id="save-expense-btn" style="width:100%;padding:14px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;">Save Expense / ಉಳಿಸಿ</button>
            </div>
          </div>

          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <select id="month-select" style="padding:8px 12px;border-radius:6px;border:1px solid #ddd;outline:none;font-weight:600;">
                <option value="${tm}">This Month</option>
                <option value="${lm}">Last Month</option>
              </select>
            </div>
            <div id="expense-list" style="display:flex;flex-direction:column;gap:8px;">
              <div style="padding:30px;text-align:center;color:var(--text-light);">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
