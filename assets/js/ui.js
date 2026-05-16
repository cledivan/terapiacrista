/* ============================================================
   TERAPIA CRISTÃ — UI Helpers (toast, modal, loader, format)
   ============================================================ */
(function() {
  // ---------- TOAST ----------
  function ensureToastContainer() {
    let c = document.getElementById('tc-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'tc-toast-container';
      document.body.appendChild(c);
    }
    return c;
  }
  function toast(msg, tipo = 'info', tempo = 3800) {
    const c = ensureToastContainer();
    const el = document.createElement('div');
    el.className = `tc-toast tc-toast-${tipo}`;
    const icones = {
      sucesso: '✓',
      erro: '✕',
      info: 'ℹ',
      aviso: '⚠'
    };
    el.innerHTML = `<span class="tc-toast-icon">${icones[tipo] || 'ℹ'}</span><span>${msg}</span>`;
    c.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => {
      el.classList.remove('in');
      setTimeout(() => el.remove(), 320);
    }, tempo);
  }

  // ---------- LOADER GLOBAL ----------
  let loaderCount = 0;
  function showLoader(texto = 'Carregando...') {
    loaderCount++;
    let el = document.getElementById('tc-global-loader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'tc-global-loader';
      el.innerHTML = `<div class="tc-loader-box"><div class="tc-spinner"></div><span class="tc-loader-text">${texto}</span></div>`;
      document.body.appendChild(el);
    } else {
      el.querySelector('.tc-loader-text').textContent = texto;
    }
    el.classList.add('on');
  }
  function hideLoader() {
    loaderCount = Math.max(0, loaderCount - 1);
    if (loaderCount === 0) {
      const el = document.getElementById('tc-global-loader');
      if (el) el.classList.remove('on');
    }
  }

  // ---------- CONFIRM MODAL (Promise) ----------
  function confirmar({ titulo = 'Confirmar', mensagem = '', ok = 'Confirmar', cancelar = 'Cancelar', perigo = false } = {}) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'tc-modal-overlay';
      overlay.innerHTML = `
        <div class="tc-modal">
          <h3>${titulo}</h3>
          <p>${mensagem}</p>
          <div class="tc-modal-actions">
            <button class="btn btn-ghost" data-cancel>${cancelar}</button>
            <button class="btn ${perigo ? 'btn-danger' : 'btn-primary'}" data-ok>${ok}</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('on'));
      function done(v) {
        overlay.classList.remove('on');
        setTimeout(() => overlay.remove(), 240);
        resolve(v);
      }
      overlay.querySelector('[data-ok]').onclick = () => done(true);
      overlay.querySelector('[data-cancel]').onclick = () => done(false);
      overlay.addEventListener('click', e => { if (e.target === overlay) done(false); });
    });
  }

  // ---------- FORMAT ----------
  const fmt = {
    data(iso) {
      if (!iso) return '—';
      const d = (iso.length === 10) ? new Date(iso + 'T00:00') : new Date(iso);
      return d.toLocaleDateString('pt-BR');
    },
    dataHora(iso) {
      if (!iso) return '—';
      const d = new Date(iso);
      return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    },
    moeda(v) {
      if (v == null) return '—';
      return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    telefone(v) {
      if (!v) return '—';
      const s = String(v).replace(/\D/g, '');
      if (s.length === 11) return `(${s.slice(0,2)}) ${s.slice(2,7)}-${s.slice(7)}`;
      if (s.length === 10) return `(${s.slice(0,2)}) ${s.slice(2,6)}-${s.slice(6)}`;
      return v;
    },
    cpf(v) {
      if (!v) return '—';
      const s = String(v).replace(/\D/g, '');
      if (s.length === 11) return `${s.slice(0,3)}.${s.slice(3,6)}.${s.slice(6,9)}-${s.slice(9)}`;
      return v;
    },
    iniciais(nome) {
      if (!nome) return '?';
      const parts = String(nome).trim().split(/\s+/);
      return ((parts[0]||'')[0] + (parts[parts.length-1]||'')[0]).toUpperCase();
    }
  };

  // ---------- MÁSCARAS ----------
  function aplicarMascaras(root = document) {
    root.querySelectorAll('[data-mask]').forEach(inp => {
      if (inp.__masked) return;
      inp.__masked = true;
      inp.addEventListener('input', () => {
        const m = inp.dataset.mask;
        let v = inp.value.replace(/\D/g, '');
        if (m === 'cpf') {
          v = v.slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else if (m === 'phone') {
          v = v.slice(0, 11);
          if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
          else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else if (m === 'cnpj') {
          v = v.slice(0, 14)
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
        } else if (m === 'cep') {
          v = v.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
        } else if (m === 'date') {
          v = v.slice(0, 8)
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
        }
        inp.value = v;
      });
    });
  }

  // ---------- VALIDAÇÃO ----------
  function validarCampos(container) {
    let ok = true;
    container.querySelectorAll('[data-required]').forEach(el => {
      const val = (el.value || '').trim();
      const wrap = el.closest('.ana-field, .tc-field') || el.parentElement;
      if (!val) {
        wrap?.classList.add('has-error');
        ok = false;
      } else {
        wrap?.classList.remove('has-error');
      }
    });
    return ok;
  }

  // ---------- AGUARDAR DOM ----------
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  window.TC_UI = { toast, showLoader, hideLoader, confirmar, fmt, aplicarMascaras, validarCampos, ready };
})();
