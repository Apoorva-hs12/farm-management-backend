import { sidebar, topbar } from '../components/layout.js';
import { apiFetch } from '../api.js';

let currentDate = new Date().toISOString().split('T')[0];

export async function attachEvents() {
  // Tab switching
  document.querySelectorAll('.sub-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.sub-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const tab = t.dataset.tab;
      document.querySelectorAll('.sub-pane').forEach(p => {
        p.classList.toggle('hidden', p.dataset.pane !== tab);
      });
      if (tab === 'milk') loadMilkData();
    });
  });

  // FAB handles add animal
  document.getElementById('fab-btn')?.addEventListener('click', () => {
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.sub-tab[data-tab="add"]')?.classList.add('active');
    document.querySelectorAll('.sub-pane').forEach(p => p.classList.toggle('hidden', p.dataset.pane !== 'add'));
  });

  // Add Animal form submission
  const addBtn = document.getElementById('save-animal-btn');
  addBtn?.addEventListener('click', async () => {
    const type = document.getElementById('animal-type').value;
    const name = document.getElementById('animal-name').value;
    const tag = document.getElementById('animal-tag').value;
    const breed = document.getElementById('animal-breed').value;
    const dob = document.getElementById('animal-dob').value;
    const dop = document.getElementById('animal-dop').value;
    const weight = document.getElementById('animal-weight').value;

    if (!name && !tag) return alert('Name or Tag is required');

    try {
      addBtn.disabled = true;
      addBtn.innerText = 'Saving...';
      await apiFetch('/animals', {
        method: 'POST',
        body: JSON.stringify({ type, name, tag, breed, dob, dop, weight })
      });
      alert('Animal added successfully');
      
      // Reset and go back to milk tab
      document.querySelectorAll('input').forEach(i => i.value = '');
      document.querySelector('.sub-tab[data-tab="milk"]')?.click();
    } catch (err) {
      alert(err.message);
    } finally {
      addBtn.disabled = false;
      addBtn.innerText = '💾 Save Animal / ಉಳಿಸಿ';
    }
  });

  // Save milk entries
  const saveMilkBtn = document.getElementById('save-milk-btn');
  saveMilkBtn?.addEventListener('click', async () => {
    const inputs = document.querySelectorAll('.cow-card');
    let saved = 0;
    saveMilkBtn.disabled = true;
    saveMilkBtn.innerText = 'Saving...';

    try {
      for (const card of inputs) {
        const animal_id = card.dataset.id;
        const mornInput = card.querySelector('.morn-input').value;
        const eveInput = card.querySelector('.eve-input').value;
        
        if (mornInput || eveInput) {
          await apiFetch('/milk', {
            method: 'POST',
            body: JSON.stringify({ 
              animal_id, 
              date: currentDate, 
              morning: mornInput || 0, 
              evening: eveInput || 0 
            })
          });
          saved++;
        }
      }
      alert(`Saved ${saved} entries`);
      loadMilkData();
    } catch (err) {
      alert(err.message);
    } finally {
      saveMilkBtn.disabled = false;
      saveMilkBtn.innerText = 'Save Daily Entry';
    }
  });

  // Load initial data
  loadMilkData();
}

async function loadMilkData() {
  const container = document.getElementById('milk-cow-grid');
  if (!container) return;
  
  container.innerHTML = '<div>Loading...</div>';
  
  try {
    const entries = await apiFetch(`/milk?date=${currentDate}`);
    const weeklyRes = await apiFetch('/milk/weekly');
    
    // Update weekly summary
    if (weeklyRes.length > 0) {
      const todayTotal = weeklyRes[weeklyRes.length - 1].total_liters || 0;
      document.getElementById('farm-total-milk').innerText = todayTotal + ' L';
      document.getElementById('today-earnings').innerText = '₹' + (todayTotal * 42.50).toLocaleString();
    } else {
      document.getElementById('farm-total-milk').innerText = '0 L';
      document.getElementById('today-earnings').innerText = '₹0';
    }

    if (entries.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-light);">No cattle found. Add animals first.</div>';
      return;
    }

    // Render cow cards for data entry
    container.innerHTML = entries.map(e => `
      <div class="cow-card" data-id="${e.animal_id || e.id}">
        <div class="cow-img">🐄</div>
        <div class="cow-info">
          <div class="cow-name">${e.name || 'Unknown'}</div>
          <div class="cow-tag">TAG #${e.tag || 'N/A'}</div>
          <div class="cow-milk-row">
            <div class="milk-entry">
              <div class="milk-label">MORN</div>
              <input type="number" step="0.1" class="morn-input milk-val-box" value="${e.morning || ''}" placeholder="0.0" style="width:50px;text-align:center;border:1px solid #ddd;border-radius:4px;padding:4px;" />
            </div>
            <div class="milk-entry">
              <div class="milk-label">EVE</div>
              <input type="number" step="0.1" class="eve-input milk-val-box" value="${e.evening || ''}" placeholder="0.0" style="width:50px;text-align:center;border:1px solid #ddd;border-radius:4px;padding:4px;" />
            </div>
            <div class="milk-total">
              <div class="milk-total-label">TOTAL</div>
              <div class="milk-total-val" style="font-size:1.1rem;font-weight:700;color:var(--primary);">${((e.morning || 0) + (e.evening || 0)).toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Failed to load milk data', err);
    container.innerHTML = '<div style="color:red;">Error loading data</div>';
  }
}

function milkPane() {
  // We'll calculate a simple 7 day date slider UI
  const days = [];
  const d = new Date();
  for(let i=6; i>=0; i--) {
    const past = new Date();
    past.setDate(d.getDate() - i);
    days.push({
      d: past.toLocaleDateString('en-US', {weekday:'short'}).toUpperCase(),
      n: past.getDate(),
      dateStr: past.toISOString().split('T')[0],
      active: i === 0
    });
  }

  return `
  <div data-pane="milk">
    <div class="date-strip">
      ${days.map(day => `
        <div class="date-chip${day.active?' active':''}" onclick="updateDate('${day.dateStr}')">
          <div class="day">${day.d}</div><div class="num">${day.n}</div>${day.active?'<div class="dot"></div>':''}
        </div>
      `).join('')}
    </div>
    
    <div class="milk-earnings-row">
      <div class="earn-card">
        <div class="earn-label">TODAY'S EARNINGS</div>
        <div class="earn-value" id="today-earnings">₹...</div>
      </div>
      <div class="earn-card highlight">
        <div class="earn-label">MONTHLY TOTAL (EST)</div>
        <div class="earn-value">₹ --</div>
        <div class="earn-note">ಈ ತಿಂಗಳ ಒಟ್ಟು ಆದಾಯ</div>
      </div>
    </div>
    
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div>
        <div style="font-size:1rem;font-weight:700;">Milk Collection</div>
        <div style="font-size:0.72rem;color:var(--primary);">ಪ್ರತಿ ಹಸುವಿನ ಹಾಲು ಸಂಗ್ರಹಣೆ</div>
      </div>
      <div style="font-size:0.72rem;color:var(--text-light);">FARM TOTAL &nbsp;<span id="farm-total-milk" style="font-size:1.2rem;font-weight:800;color:var(--primary);font-family:'Outfit',sans-serif;">0 L</span></div>
    </div>
    
    <div class="cow-grid" id="milk-cow-grid">
      <!-- Loaded dynamically -->
    </div>
    
    <div class="egg-bottom-bar" style="margin-top:20px;border-top:1px solid #eee;padding-top:10px;">
      <button id="save-milk-btn" style="background:var(--primary-light);color:#fff;border-radius:var(--radius-md);padding:12px 20px;font-size:0.88rem;font-weight:700;border:none;cursor:pointer;width:100%;">Save Daily Entry</button>
    </div>
  </div>`;
}

// Global helper for React-like inline click
window.updateDate = (dateStr) => {
  currentDate = dateStr;
  document.querySelectorAll('.date-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('onclick').includes(dateStr));
    const dot = c.querySelector('.dot');
    if (dot) dot.remove();
    if (c.classList.contains('active')) c.innerHTML += '<div class="dot"></div>';
  });
  loadMilkData();
};

function eggPane() {
  return `<div data-pane="eggs"><div class="section-card"><div style="padding:40px;text-align:center;color:var(--text-light);">Egg tracking API not connected yet.</div></div></div>`;
}

function addPane() {
  return `
  <div data-pane="add">
    <div class="photo-drop" id="photo-drop-zone">
      <div class="camera-icon">📷</div>
      <div class="photo-label">Tap to add photo</div>
      <div class="photo-kn">ಫೋಟೋ ಸೇರಿಸಲು ಇಲ್ಲಿ ಒತ್ತಿ</div>
    </div>
    <div class="animal-form-card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div class="form-field"><label>ANIMAL TYPE / ಪ್ರಾಣಿಯ ವಿದ</label>
          <select id="animal-type"><option>Cow</option><option>Buffalo</option><option>Goat</option></select>
        </div>
        <div class="form-field"><label>NAME / ಹೆಸರು</label><input type="text" id="animal-name" placeholder="e.g. Ganga" /></div>
        <div class="form-field"><label>TAG / EAR NUMBER / ಟ್ಯಾಗ್ ಸಂಖ್ಯೆ</label><input type="text" id="animal-tag" placeholder="GK-1024" /></div>
        <div class="form-field"><label>BREED / ತಳಿ</label><input type="text" id="animal-breed" placeholder="e.g. Gir / Hallikar" /></div>
        <div class="form-field"><label>DATE OF BIRTH / ಹುಟ್ಟಿದ ದಿನಾಂಕ</label><input type="date" id="animal-dob" /></div>
        <div class="form-field"><label>DATE OF PURCHASE / ಖರೀದಿಸಿದ ದಿನಾಂಕ</label><input type="date" id="animal-dop" /></div>
        <div class="form-field" style="grid-column:1/-1;">
          <label>WEIGHT IN KG / ತೂಕ (ಕಿಗ್ರಾಂಗಳಲ್ಲಿ)</label>
          <div style="position:relative;">
            <input type="number" id="animal-weight" placeholder="0.00" style="width:100%;padding-right:40px;" />
            <span style="position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:0.8rem;font-weight:700;color:var(--text-light);">KG</span>
          </div>
        </div>
      </div>
      <button class="btn-primary" id="save-animal-btn" style="margin-top:20px;">💾 Save Animal / ಉಳಿಸಿ</button>
      <button class="btn-outline" style="margin-top:8px;" onclick="document.querySelector('.sub-tab[data-tab=\\'milk\\']').click()">Cancel / ರದ್ದುಗೊಳಿಸಿ</button>
    </div>
  </div>`;
}

export function render() {
  return `
  <div class="app-layout page">
    ${sidebar('livestock')}
    <div class="main-content">
      ${topbar('Livestock','ಹಾಲಿನ ಉತ್ಪಾದನೆ',`<span style="font-size:0.82rem;color:var(--text-mid);">Rate: <strong style="color:var(--text-dark);">₹42.50</strong> /l</span>`)}
      <div class="page-content">
        <div class="sub-tabs">
          <div class="sub-tab active" data-tab="milk">🥛 Milk Production</div>
          <div class="sub-tab" data-tab="eggs">🥚 Egg Production</div>
          <div class="sub-tab" data-tab="add">➕ Add Animal</div>
        </div>
        <div class="sub-pane" data-pane="milk">${milkPane()}</div>
        <div class="sub-pane hidden" data-pane="eggs">${eggPane()}</div>
        <div class="sub-pane hidden" data-pane="add">${addPane()}</div>
      </div>
    </div>
    <button class="fab" id="fab-btn" title="Add Animal">💾</button>
  </div>`;
}
