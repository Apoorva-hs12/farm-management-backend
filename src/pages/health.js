import { sidebar, topbar } from '../components/layout.js';
import { apiFetch } from '../api.js';

export async function attachEvents() {
  document.getElementById('fab-btn')?.addEventListener('click', () => {
    // Scroll to new entry form or something
    document.getElementById('health-form')?.scrollIntoView({behavior:'smooth'});
  });

  const saveBtn = document.getElementById('save-health-btn');
  saveBtn?.addEventListener('click', async () => {
    const type = document.getElementById('health-type').value;
    const animal_id = document.getElementById('health-animal').value || null;
    const description = document.getElementById('health-desc').value;
    const date = document.getElementById('health-date').value;
    const vet_name = document.getElementById('health-vet').value;

    if (!type || !description || !date) return alert('Type, description, and date are required');

    try {
      saveBtn.disabled = true;
      saveBtn.innerText = 'Saving...';
      
      await apiFetch('/health', {
        method: 'POST',
        body: JSON.stringify({ type, animal_id, description, date, vet_name })
      });
      
      alert('Record saved');
      // reset
      document.getElementById('health-desc').value = '';
      document.getElementById('health-vet').value = '';
      loadHealth();
    } catch (err) {
      alert(err.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerText = 'Save Record / ಉಳಿಸಿ';
    }
  });

  loadAnimals();
  loadHealth();
}

async function loadAnimals() {
  const sel = document.getElementById('health-animal');
  if (!sel) return;
  try {
    const animals = await apiFetch('/animals');
    sel.innerHTML = '<option value="">All Animals / ಯಾರ್ಗು ಅಲ್ಲ</option>' + animals.map(a => `<option value="${a.id}">${a.name || 'Unnamed'} (${a.tag || 'No Tag'})</option>`).join('');
  } catch (err) {
    console.error(err);
  }
}

async function loadHealth() {
  const listEl = document.getElementById('health-list');
  if (!listEl) return;
  
  try {
    const data = await apiFetch('/health');
    
    if (data.length === 0) {
      listEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-light);">No health records found.</div>';
      return;
    }

    const icons = {
      'Vaccination': '💉',
      'Checkup': '🩺',
      'Treatment': '💊',
      'Dietary': '🌾'
    };
    const colors = {
      'Vaccination': '#eef6ff',
      'Checkup': '#fdf2e9',
      'Treatment': '#fff3f3',
      'Dietary': '#eafaf1'
    };

    const html = data.map(e => {
      const dateStr = new Date(e.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'});
      const ani = e.animal_name ? `${e.animal_name} (${e.animal_tag})` : 'General/Multiple';
      return `
      <div style="background:#fff;border-radius:12px;border:1px solid #eee;padding:16px;margin-bottom:12px;display:flex;gap:16px;align-items:flex-start;">
        <div style="width:40px;height:40px;border-radius:50%;background:${colors[e.type]||'#eee'};display:flex;align-items:center;justify-content:center;font-size:1.2rem;">${icons[e.type]||'📌'}</div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <div style="font-weight:700;font-size:1rem;color:var(--text-dark)">${e.type}</div>
            <div style="font-size:0.75rem;font-weight:600;color:var(--primary)">${dateStr}</div>
          </div>
          <div style="font-size:0.8rem;color:var(--text-light);font-weight:600;margin-bottom:8px;">🐄 ${ani}</div>
          <div style="font-size:0.9rem;color:var(--text-dark);line-height:1.4;">${e.description}</div>
          ${e.vet_name ? `<div style="font-size:0.75rem;color:var(--text-light);margin-top:8px;font-style:italic;">Veterinarian: Dr. ${e.vet_name}</div>` : ''}
        </div>
      </div>`;
    }).join('');

    listEl.innerHTML = html;

  } catch (err) {
    console.error(err);
    listEl.innerHTML = '<div style="color:red">Error loading health records</div>';
  }
}

export function render() {
  return `
  <div class="app-layout page">
    ${sidebar('health')}
    <div class="main-content">
      ${topbar('Health / ಆರೋಗ್ಯ','MEDICAL RECORDS & ALERTS')}
      <div class="page-content" style="display:grid;grid-template-columns:1fr 340px;gap:20px;">
        
        <div style="display:flex;flex-direction:column;gap:24px;">
          <!-- Timeline / List -->
          <div>
            <div style="font-size:1.1rem;font-weight:800;margin-bottom:16px;color:var(--primary-dark)">Medical History</div>
            <div id="health-list">
              <div style="padding:30px;text-align:center;color:var(--text-light);">Loading...</div>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;" id="health-form">
          <div class="card" style="padding:24px;border-radius:12px;background:#fff;border:1px solid #eee;">
            <div style="font-size:1.1rem;font-weight:800;margin-bottom:20px;color:var(--primary-dark);">New Record</div>
            
            <div style="margin-bottom:16px;">
              <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-light);margin-bottom:8px;">RECORD TYPE</label>
              <select id="health-type" style="width:100%;padding:10px;border-radius:6px;border:1px solid #ddd;outline:none;font-weight:600;font-family:inherit;">
                <option value="Vaccination">Vaccination / ಲಸಿಕೆ</option>
                <option value="Checkup">Routine Checkup / ತಪಾಸಣೆ</option>
                <option value="Treatment">Medical Treatment / ಚಿಕಿತ್ಸೆ</option>
                <option value="Dietary">Dietary Change / ಆಹಾರ</option>
              </select>
            </div>
            
            <div style="margin-bottom:16px;">
              <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-light);margin-bottom:8px;">ANIMAL (Optional)</label>
              <select id="health-animal" style="width:100%;padding:10px;border-radius:6px;border:1px solid #ddd;outline:none;font-family:inherit;">
                <option value="">Loading animals...</option>
              </select>
            </div>
            
            <div style="margin-bottom:16px;">
              <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-light);margin-bottom:8px;">DATE</label>
              <input type="date" id="health-date" value="${new Date().toISOString().split('T')[0]}" style="width:100%;padding:10px;border-radius:6px;border:1px solid #ddd;font-family:inherit;" />
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-light);margin-bottom:8px;">DESCRIPTION / DETAILS</label>
              <textarea id="health-desc" style="width:100%;padding:10px;border-radius:6px;border:1px solid #ddd;font-family:inherit;resize:none;height:80px;" placeholder="What was the procedure..."></textarea>
            </div>

            <div style="margin-bottom:24px;">
              <label style="display:block;font-size:0.75rem;font-weight:700;color:var(--text-light);margin-bottom:8px;">VETERINARIAN NAME (Optional)</label>
              <input type="text" id="health-vet" placeholder="Dr. Suresh" style="width:100%;padding:10px;border-radius:6px;border:1px solid #ddd;font-family:inherit;" />
            </div>

            <button id="save-health-btn" style="width:100%;padding:14px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;">Save Record / ಉಳಿಸಿ</button>
          </div>
        </div>

      </div>
    </div>
    <button class="fab" id="fab-btn">+</button>
  </div>`;
}
