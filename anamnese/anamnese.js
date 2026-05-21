/* ============================================================
   ANAMNESE DIGITAL — Wizard Lógica (com Supabase)
   ============================================================ */

const SINTOMAS = [
  'Dores de cabeça', 'Sensações de pânico', 'Sensação de desmaio', 'Deprimido(a)',
  'Coração acelerado', 'Ideias de suicídio', 'Falta de apetite', 'Tremores',
  'Palpitações', 'Tensão', 'Insônia', 'Problemas estomacais',
  'Problemas sexuais', 'Uso de álcool', 'Dificuldade de concentração',
  'Tontura', 'Fadiga', 'Pesadelos', 'Compulsão alimentar', 'Falta de energia'
];

const SENTIMENTOS = [
  'Vergonha de outras pessoas', 'Indeciso(a)', 'Dificuldade em fazer amigos',
  'Inferioridade', 'Sem prazer em nada', 'Sem valor',
  'Inútil', 'Inadequado(a)', 'Em conflito', 'Ingênuo(a)', 'Incompreendido(a)',
  'Cheio(a) de arrependimentos', 'Atencioso(a)', 'Estúpido(a)', 'Mau / Má', 'Agitado(a)',
  'Solitário(a)', 'Não confiável', 'Incompetente', 'Inteligente', 'Engraçado(a)',
  'Pensamentos ruins', 'Não sou amado(a)', 'Ansioso(a)', 'Culpado(a)', 'Triste'
];

const TOTAL_STEPS = 9;
const STEP_LABELS = [
  'Bem-vindo(a)', 'Dados Pessoais', 'Queixas', 'Como está hoje', 'Saúde',
  'Família', 'Relacionamentos', 'Trabalho', 'Espiritualidade', 'Finalização', 'Concluído'
];
const LOCAL_KEY = 'tc_anamnese_rascunho_v2';

let currentStep = 0;
let formData = {};
let prontuarioSalvo = null;

/* ============================================================
   RENDER CHIPS
   ============================================================ */
function renderChips() {
  const sintomasEl = document.getElementById('sintomas');
  if (sintomasEl) {
    sintomasEl.innerHTML = SINTOMAS.map(s => `<div class="ana-chip" data-sintoma="${s}">${s}</div>`).join('');
    sintomasEl.querySelectorAll('.ana-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        coletarSintomas();
        autoSave();
      });
    });
  }

  const sentEl = document.getElementById('sentimentos');
  if (sentEl) {
    sentEl.innerHTML = SENTIMENTOS.map(s => `
      <div class="ana-chip-rm" data-sentimento="${s}">
        <span class="chip-label">${s}</span>
        <span class="chip-r" title="Recorrente">R</span>
        <span class="chip-m" title="Já senti">M</span>
      </div>
    `).join('');
    sentEl.querySelectorAll('.ana-chip-rm').forEach(chip => {
      chip.querySelector('.chip-r').addEventListener('click', () => {
        chip.classList.remove('selected-m');
        chip.classList.toggle('selected-r');
        coletarSentimentos(); autoSave();
      });
      chip.querySelector('.chip-m').addEventListener('click', () => {
        chip.classList.remove('selected-r');
        chip.classList.toggle('selected-m');
        coletarSentimentos(); autoSave();
      });
    });
  }
}

function coletarSintomas() {
  formData.sintomas = Array.from(document.querySelectorAll('#sintomas .ana-chip.selected'))
    .map(c => c.dataset.sintoma);
}
function coletarSentimentos() {
  const items = {};
  document.querySelectorAll('#sentimentos .ana-chip-rm').forEach(c => {
    if (c.classList.contains('selected-r')) items[c.dataset.sentimento] = 'R';
    if (c.classList.contains('selected-m')) items[c.dataset.sentimento] = 'M';
  });
  formData.sentimentos = items;
}

/* ============================================================
   NAVEGAÇÃO ENTRE ETAPAS
   ============================================================ */
function renderDots() {
  const dotsEl = document.getElementById('stepDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const d = document.createElement('span');
    d.className = 'ana-step-dot';
    if (i < currentStep) d.classList.add('done');
    if (i === currentStep) d.classList.add('active');
    d.title = `Etapa ${i}: ${STEP_LABELS[i]}`;
    d.addEventListener('click', () => {
      if (i <= currentStep || i === currentStep + 1) showStep(i);
    });
    dotsEl.appendChild(d);
  }
}

function showStep(n) {
  document.querySelectorAll('.ana-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.ana-step[data-step="${n}"]`);
  if (!target) return;
  target.classList.add('active');
  currentStep = n;

  // Progress
  let percent = 0;
  if (n === 0) percent = 0;
  else if (n >= 10) percent = 100;
  else percent = Math.round((n / TOTAL_STEPS) * 100);

  document.getElementById('progressFill').style.width = percent + '%';
  document.getElementById('stepPercent').textContent = percent + '%';
  document.getElementById('stepLabel').textContent =
    n === 0 ? 'Bem-vindo(a)' :
    n === 10 ? 'Concluído!' :
    `Etapa ${n} de ${TOTAL_STEPS} · ${STEP_LABELS[n]}`;

  renderDots();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  formData._step = n;
  saveLocal();
}

function validarEtapa(n) {
  const step = document.querySelector(`.ana-step[data-step="${n}"]`);
  if (!step) return true;
  const ok = TC_UI.validarCampos(step);
  if (!ok) TC_UI.toast('Preencha os campos obrigatórios destacados.', 'aviso');
  return ok;
}

/* ============================================================
   COLETA E RESTAURAÇÃO DE DADOS
   ============================================================ */
function coletarDados() {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    if (!el.name) return;
    if (el.type === 'checkbox') formData[el.name] = el.checked;
    else formData[el.name] = el.value;
  });
  coletarSintomas();
  coletarSentimentos();
}

function restaurarDados() {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    if (!el.name || formData[el.name] === undefined) return;
    if (el.type === 'checkbox') el.checked = !!formData[el.name];
    else el.value = formData[el.name];
  });
  if (Array.isArray(formData.sintomas)) {
    formData.sintomas.forEach(s => {
      document.querySelector(`[data-sintoma="${CSS.escape(s)}"]`)?.classList.add('selected');
    });
  }
  if (formData.sentimentos) {
    Object.entries(formData.sentimentos).forEach(([s, v]) => {
      const chip = document.querySelector(`[data-sentimento="${CSS.escape(s)}"]`);
      if (chip) chip.classList.add(v === 'R' ? 'selected-r' : 'selected-m');
    });
  }
}

/* ============================================================
   AUTO-SAVE (LOCAL + nuvem ao finalizar)
   ============================================================ */
function saveLocal() {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(formData)); } catch {}
}
function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

let saveTimer = null;
function autoSave() {
  coletarDados();
  const status = document.getElementById('saveStatus');
  if (status) {
    status.classList.remove('error', 'offline');
    status.classList.add('saving');
    status.querySelector('span').textContent = 'Salvando...';
  }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveLocal();
    if (status) {
      status.classList.remove('saving');
      status.querySelector('span').textContent = '✓ Salvo automaticamente';
    }
  }, 350);
}

document.addEventListener('input', e => { if (e.target.closest('.ana-wizard')) autoSave(); });
document.addEventListener('change', e => { if (e.target.closest('.ana-wizard')) autoSave(); });

/* ============================================================
   FINALIZAR — ENVIA AO SUPABASE
   ============================================================ */
async function finalizarAnamnese() {
  if (!validarEtapa(9)) return;
  coletarDados();

  // Validação extra
  if (!formData.nome || !formData.email || !formData.telefone) {
    TC_UI.toast('Volte às etapas iniciais e preencha nome, email e telefone.', 'erro');
    return;
  }

  const btn = document.getElementById('btnFinalizar');
  btn.disabled = true;
  btn.innerHTML = '<div class="tc-spinner" style="width:18px;height:18px;border-width:2px"></div> Enviando...';

  const payload = {
    nome: formData.nome.trim(),
    email: (formData.email || '').trim().toLowerCase(),
    telefone: (formData.telefone || '').replace(/\D/g, ''),
    cpf: (formData.cpf || '').replace(/\D/g, ''),
    data_nascimento: formData.data_nascimento || null,
    origem: formData.origem || 'Direto',
    status: 'novo',
    dados: formData
  };

  try {
    const salvo = await TC_DB.prontuarios.create(payload);
    prontuarioSalvo = salvo;
    localStorage.removeItem(LOCAL_KEY); // limpa rascunho

    // Atualiza UI sucesso
    const proto = document.getElementById('protocoloTexto');
    if (proto) {
      proto.innerHTML = `
        <strong>Protocolo:</strong> #${salvo.id.slice(0,8).toUpperCase()}<br>
        <strong>Data:</strong> ${new Date(salvo.criado_em).toLocaleString('pt-BR')}<br>
        <strong>Nome:</strong> ${salvo.nome}
      `;
    }

    showStep(10);
    TC_UI.toast('🙏 Anamnese enviada com sucesso!', 'sucesso', 5000);
  } catch (e) {
    console.error('Erro ao enviar:', e);
    btn.disabled = false;
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg> Finalizar Anamnese';
    let erroMsg = 'Erro ao enviar. Verifique sua conexão e tente novamente.';
    if (e?.message) {
      const msg = e.message;
      if (/relation .*prontuarios.*does not exist/i.test(msg)
        || /Could not find the table 'public\.prontuarios' in the schema cache/i.test(msg)) {
        erroMsg = 'Erro de configuração do Supabase: tabela "prontuarios" não encontrada ou não aplicada no projeto Supabase. Execute o SQL em supabase/schema.sql no painel do Supabase.';
      } else if (/network|timeout|failed to fetch/i.test(msg)) {
        erroMsg = 'Não foi possível conectar ao Supabase. Verifique sua conexão e as credenciais do projeto.';
      } else {
        erroMsg = `Erro ao enviar: ${msg}`;
      }
    }
    TC_UI.toast(erroMsg, 'erro', 9000);
    document.getElementById('saveStatus')?.classList.add('error');
  }
}

/* ============================================================
   WHATSAPP NA TELA DE SUCESSO
   ============================================================ */
async function enviarWhatsappSucesso() {
  let whatsNum = window.TC_CONFIG.clinica.whatsapp;
  let template = `Olá! Sou {NOME} e acabei de preencher minha anamnese no site da Terapia Cristã. Protocolo: #{PROTO}. Aguardo seu contato. 🙏`;

  try {
    const cfg = await TC_DB.configuracoes.get();
    if (cfg?.whatsapp) whatsNum = cfg.whatsapp;
  } catch {}

  const nome = prontuarioSalvo?.nome || formData.nome || 'paciente';
  const proto = prontuarioSalvo ? prontuarioSalvo.id.slice(0,8).toUpperCase() : '';
  const msg = template.replace('{NOME}', nome).replace('{PROTO}', proto);
  window.open(`https://wa.me/${whatsNum}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ============================================================
   INIT
   ============================================================ */
TC_UI.ready(() => {
  TC_UI.aplicarMascaras();
  renderChips();

  // Carregar rascunho local
  const draft = loadLocal();
  if (draft) {
    formData = draft;
    restaurarDados();
    if (draft._step && draft._step > 0 && draft._step < 10) {
      const hint = document.getElementById('resumeHint');
      const stepN = document.getElementById('resumeStep');
      const link = document.getElementById('resumeLink');
      if (hint) {
        hint.style.display = 'block';
        stepN.textContent = draft._step;
        link.addEventListener('click', e => { e.preventDefault(); showStep(draft._step); });
      }
    }
  }

  // Botões nav
  document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => {
    if (!validarEtapa(currentStep)) return;
    showStep(currentStep + 1);
  }));
  document.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => {
    showStep(Math.max(0, currentStep - 1));
  }));

  // Finalizar
  document.getElementById('btnFinalizar')?.addEventListener('click', finalizarAnamnese);
  document.getElementById('successWhats')?.addEventListener('click', enviarWhatsappSucesso);

  showStep(formData._step || 0);
});
