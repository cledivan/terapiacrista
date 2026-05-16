/* Agenda */
let dataAtual = new Date().toISOString().slice(0,10);

TC_UI.ready(async () => {
  const shell = await AdminShell.renderAdminShell({
    titulo: 'Agenda',
    subtitulo: 'Gerencie suas sessões',
    page: 'agenda.html'
  });
  if (!shell) return;
  shell.contentEl.appendChild(document.getElementById('pageContent').content.cloneNode(true));
  AdminShell.bindAdminShell();

  document.getElementById('dataAtual').value = dataAtual;
  document.getElementById('dataAtual').onchange = (e) => { dataAtual = e.target.value; render(); };
  document.getElementById('btnHoje').onclick = () => { dataAtual = new Date().toISOString().slice(0,10); document.getElementById('dataAtual').value = dataAtual; render(); };
  document.getElementById('btnAnt').onclick = () => mover(-1);
  document.getElementById('btnProx').onclick = () => mover(1);
  document.getElementById('btnNovaSessao').onclick = () => abrirSessao(null);

  await render();
});

function mover(d) {
  const dt = new Date(dataAtual + 'T00:00');
  dt.setDate(dt.getDate() + d);
  dataAtual = dt.toISOString().slice(0,10);
  document.getElementById('dataAtual').value = dataAtual;
  render();
}

async function render() {
  const el = document.getElementById('agendaDia');
  el.innerHTML = '<div class="agenda-empty">Carregando...</div>';
  try {
    const sessoes = await TC_DB.sessoes.list({ data: dataAtual });
    if (!sessoes.length) {
      el.innerHTML = '<div class="agenda-empty">Nenhuma sessão neste dia.</div>';
    } else {
      el.innerHTML = sessoes.map(s => `
        <div class="agenda-slot ${s.modalidade === 'online' ? 'online' : ''} ${s.status}">
          <div class="agenda-hora">${s.hora.slice(0,5)}</div>
          <div>
            <div class="agenda-nome">${s.pacientes?.nome || '(sem paciente)'}</div>
            <div class="agenda-meta">${s.modalidade} · ${s.tipo} · ${s.duracao_min}min ${s.pago ? '· 💰 Pago' : ''}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center">
            <span class="badge badge-${s.status}">${s.status}</span>
            <button class="btn btn-secondary btn-sm" onclick='editarSessao("${s.id}")'>Editar</button>
          </div>
        </div>
      `).join('');
    }
    await renderResumo();
  } catch (e) {
    console.error(e); el.innerHTML = '<div class="agenda-empty">Erro ao carregar.</div>';
  }
}

async function renderResumo() {
  const mes = dataAtual.slice(0,7);
  const sessoesMes = await TC_DB.sessoes.list({ mes });
  const total = sessoesMes.length;
  const realiz = sessoesMes.filter(s => s.status === 'realizado').length;
  const cancel = sessoesMes.filter(s => s.status === 'cancelado' || s.status === 'faltou').length;
  const receita = sessoesMes.filter(s => s.pago).reduce((a,s)=> a + Number(s.valor || 0), 0);

  document.getElementById('resumoMes').innerHTML = `
    <div class="stat-card"><div class="stat-card-label">Total</div><div class="stat-card-value">${total}</div></div>
    <div class="stat-card"><div class="stat-card-label">Realizadas</div><div class="stat-card-value">${realiz}</div></div>
    <div class="stat-card"><div class="stat-card-label">Faltas/Cancel.</div><div class="stat-card-value">${cancel}</div></div>
    <div class="stat-card"><div class="stat-card-label">Recebido</div><div class="stat-card-value">${TC_UI.fmt.moeda(receita)}</div></div>
  `;
}

window.editarSessao = async (id) => {
  const ss = await TC_DB.sessoes.list({ data: dataAtual });
  const s = ss.find(x => x.id === id);
  if (s) abrirSessao(s);
};

async function abrirSessao(s) {
  const pacientes = await TC_DB.pacientes.list({ status: 'ativo' });
  const cfg = await TC_DB.configuracoes.get();

  const overlay = document.createElement('div');
  overlay.className = 'tc-drawer-overlay';
  overlay.innerHTML = `
    <div class="tc-drawer">
      <div class="tc-drawer-head">
        <h3>${s ? '✏️ Editar sessão' : '➕ Nova sessão'}</h3>
        <button class="tc-drawer-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="tc-drawer-body">
        <form id="formSessao" class="tc-form">
          <div class="tc-field">
            <label>Paciente *</label>
            <select name="paciente_id" required>
              <option value="">Selecione...</option>
              ${pacientes.map(p => `<option value="${p.id}" ${s?.paciente_id===p.id?'selected':''}>${p.nome}</option>`).join('')}
            </select>
          </div>
          <div class="tc-form-row">
            <div class="tc-field"><label>Data *</label><input type="date" name="data" required value="${s?.data || dataAtual}"></div>
            <div class="tc-field"><label>Hora *</label><input type="time" name="hora" required value="${s?.hora?.slice(0,5) || '09:00'}"></div>
          </div>
          <div class="tc-form-row">
            <div class="tc-field"><label>Duração (min)</label><input type="number" name="duracao_min" value="${s?.duracao_min || cfg.duracao_sessao_min}"></div>
            <div class="tc-field"><label>Valor (R$)</label><input type="number" step="0.01" name="valor" value="${s?.valor || cfg.valor_sessao}"></div>
          </div>
          <div class="tc-form-row">
            <div class="tc-field"><label>Modalidade</label>
              <select name="modalidade">
                <option value="presencial" ${s?.modalidade==='presencial'?'selected':''}>Presencial</option>
                <option value="online" ${s?.modalidade==='online'?'selected':''}>Online</option>
              </select>
            </div>
            <div class="tc-field"><label>Tipo</label>
              <select name="tipo">
                <option value="individual" ${s?.tipo==='individual'?'selected':''}>Individual</option>
                <option value="casal" ${s?.tipo==='casal'?'selected':''}>Casal</option>
                <option value="familia" ${s?.tipo==='familia'?'selected':''}>Família</option>
                <option value="grupo" ${s?.tipo==='grupo'?'selected':''}>Grupo</option>
              </select>
            </div>
          </div>
          <div class="tc-form-row">
            <div class="tc-field"><label>Status</label>
              <select name="status">
                <option value="agendado" ${s?.status==='agendado'?'selected':''}>Agendado</option>
                <option value="realizado" ${s?.status==='realizado'?'selected':''}>Realizado</option>
                <option value="cancelado" ${s?.status==='cancelado'?'selected':''}>Cancelado</option>
                <option value="faltou" ${s?.status==='faltou'?'selected':''}>Faltou</option>
              </select>
            </div>
            <div class="tc-field"><label>Pagamento</label>
              <select name="pago">
                <option value="false" ${!s?.pago?'selected':''}>Pendente</option>
                <option value="true" ${s?.pago?'selected':''}>Pago</option>
              </select>
            </div>
          </div>
          <div class="tc-field"><label>Notas / Evolução</label><textarea name="notas" rows="4">${s?.notas || ''}</textarea></div>
        </form>
      </div>
      <div class="tc-drawer-actions">
        ${s ? `<button class="btn btn-danger" id="btnExcl">Excluir</button>` : ''}
        ${s ? `<button class="btn btn-whatsapp" id="btnLembrete">Enviar lembrete</button>` : ''}
        <button class="btn btn-ghost" id="btnCancel">Cancelar</button>
        <button class="btn btn-primary" id="btnSalvar">Salvar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('on'));

  const fechar = () => { overlay.classList.remove('on'); setTimeout(() => overlay.remove(), 280); };
  overlay.querySelector('.tc-drawer-close').onclick = fechar;
  overlay.querySelector('#btnCancel').onclick = fechar;
  overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });

  overlay.querySelector('#btnSalvar').onclick = async () => {
    const form = overlay.querySelector('#formSessao');
    if (!TC_UI.validarCampos(form)) return;
    const data = Object.fromEntries(new FormData(form));
    data.duracao_min = parseInt(data.duracao_min) || 50;
    data.valor = parseFloat(data.valor) || 0;
    data.pago = data.pago === 'true';
    try {
      if (s) await TC_DB.sessoes.update(s.id, data);
      else await TC_DB.sessoes.create(data);
      TC_UI.toast('Sessão salva!', 'sucesso');
      fechar(); render();
    } catch (e) { console.error(e); TC_UI.toast('Erro ao salvar.', 'erro'); }
  };

  overlay.querySelector('#btnExcl')?.addEventListener('click', async () => {
    const ok = await TC_UI.confirmar({ titulo: 'Excluir sessão?', mensagem: 'Esta ação é definitiva.', perigo: true, ok: 'Excluir' });
    if (!ok) return;
    await TC_DB.sessoes.remove(s.id);
    TC_UI.toast('Sessão removida.', 'sucesso');
    fechar(); render();
  });

  overlay.querySelector('#btnLembrete')?.addEventListener('click', async () => {
    const pac = pacientes.find(p => p.id === s.paciente_id);
    if (!pac?.telefone) { TC_UI.toast('Paciente sem telefone.', 'aviso'); return; }
    const msg = TC_DB.whatsapp.montarMensagem(cfg.mensagem_lembrete, pac, s);
    TC_DB.whatsapp.abrirChat(pac.telefone, msg);
    TC_DB.whatsapp.registrar({ paciente_id: pac.id, destinatario: pac.telefone, mensagem: msg, tipo: 'lembrete' }).catch(()=>{});
  });
}
