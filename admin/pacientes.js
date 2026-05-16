/* Pacientes */
let pacientesList = [];
let editandoId = null;

TC_UI.ready(async () => {
  const shell = await AdminShell.renderAdminShell({
    titulo: 'Pacientes',
    subtitulo: 'Gestão completa de pacientes',
    page: 'pacientes.html'
  });
  if (!shell) return;
  shell.contentEl.appendChild(document.getElementById('pageContent').content.cloneNode(true));
  AdminShell.bindAdminShell();

  document.getElementById('btnNovo').onclick = () => abrirDrawer(null);
  document.getElementById('buscar').addEventListener('input', e => carregar(e.target.value, document.getElementById('filtroStatus').value));
  document.getElementById('filtroStatus').onchange = e => carregar(document.getElementById('buscar').value, e.target.value);

  await carregar();

  // Se URL tem ?id=xxx, abre direto
  const urlId = new URLSearchParams(location.search).get('id');
  if (urlId) {
    try { const p = await TC_DB.pacientes.get(urlId); abrirDrawer(p); } catch {}
  }
});

async function carregar(search = '', status = '') {
  const tbody = document.getElementById('tabela');
  tbody.innerHTML = '<tr><td colspan="6" class="tc-table-empty">Carregando...</td></tr>';
  try {
    pacientesList = await TC_DB.pacientes.list({ search: search || null, status: status || null });
    if (pacientesList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="tc-table-empty">
        ${search ? 'Nenhum paciente encontrado para "' + search + '".' : 'Nenhum paciente cadastrado ainda.'}
      </td></tr>`;
      return;
    }
    tbody.innerHTML = pacientesList.map(p => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="admin-user-avatar" style="background:var(--grad-verde)">${TC_UI.fmt.iniciais(p.nome)}</div>
            <div><strong>${p.nome}</strong><br><small style="color:var(--cinza-500)">${p.email || '—'}</small></div>
          </div>
        </td>
        <td>${TC_UI.fmt.telefone(p.telefone)}</td>
        <td>${p.origem || '—'}</td>
        <td>${TC_UI.fmt.data(p.criado_em)}</td>
        <td><span class="badge badge-${p.status}">${p.status}</span></td>
        <td class="actions">
          <button class="btn btn-secondary btn-sm" onclick='abrirPaciente("${p.id}")'>Editar</button>
          <button class="btn btn-whatsapp btn-sm" onclick='chamarWhats("${p.id}")'>WA</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="6" class="tc-table-empty">Erro ao carregar. Verifique sua conexão.</td></tr>';
  }
}

window.abrirPaciente = (id) => {
  const p = pacientesList.find(x => x.id === id);
  if (p) abrirDrawer(p);
};

window.chamarWhats = async (id) => {
  const p = pacientesList.find(x => x.id === id);
  if (!p?.telefone) { TC_UI.toast('Paciente sem telefone cadastrado.', 'aviso'); return; }
  const cfg = await TC_DB.configuracoes.get();
  const msg = TC_DB.whatsapp.montarMensagem(cfg.mensagem_boas_vindas, p);
  TC_DB.whatsapp.abrirChat(p.telefone, msg);
};

function abrirDrawer(p) {
  editandoId = p?.id || null;
  const overlay = document.createElement('div');
  overlay.className = 'tc-drawer-overlay';
  overlay.innerHTML = `
    <div class="tc-drawer">
      <div class="tc-drawer-head">
        <h3>${p ? '✏️ Editar paciente' : '➕ Novo paciente'}</h3>
        <button class="tc-drawer-close" id="drawerClose">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="tc-drawer-body">
        ${p?.anamnese && Object.keys(p.anamnese).length ? `
          <div class="tc-tabs">
            <button class="tc-tab active" data-tab="dados">Dados</button>
            <button class="tc-tab" data-tab="anamnese">Anamnese</button>
            <button class="tc-tab" data-tab="sessoes">Sessões</button>
          </div>` : ''}
        <div class="tc-tab-content active" data-content="dados">
          <form id="formPaciente" class="tc-form">
            <div class="tc-form-row">
              <div class="tc-field"><label>Nome *</label><input type="text" name="nome" required value="${p?.nome || ''}"></div>
              <div class="tc-field"><label>CPF</label><input type="text" name="cpf" data-mask="cpf" value="${p?.cpf || ''}"></div>
            </div>
            <div class="tc-form-row">
              <div class="tc-field"><label>Telefone *</label><input type="tel" name="telefone" data-mask="phone" required value="${p?.telefone ? TC_UI.fmt.telefone(p.telefone) : ''}"></div>
              <div class="tc-field"><label>E-mail</label><input type="email" name="email" value="${p?.email || ''}"></div>
            </div>
            <div class="tc-form-row">
              <div class="tc-field"><label>Data Nascimento</label><input type="date" name="data_nascimento" value="${p?.data_nascimento || ''}"></div>
              <div class="tc-field"><label>Origem</label><input type="text" name="origem" value="${p?.origem || ''}"></div>
            </div>
            <div class="tc-field"><label>Endereço</label><input type="text" name="endereco" value="${p?.endereco || ''}"></div>
            <div class="tc-field"><label>Status</label>
              <select name="status">
                <option value="ativo" ${p?.status==='ativo'?'selected':''}>Ativo</option>
                <option value="inativo" ${p?.status==='inativo'?'selected':''}>Inativo</option>
                <option value="alta" ${p?.status==='alta'?'selected':''}>Alta</option>
              </select>
            </div>
            <div class="tc-field"><label>Observações</label><textarea name="observacoes" rows="4">${p?.observacoes || ''}</textarea></div>
          </form>
        </div>
        ${p?.anamnese && Object.keys(p.anamnese).length ? `
        <div class="tc-tab-content" data-content="anamnese">
          ${renderAnamnese(p.anamnese)}
        </div>
        <div class="tc-tab-content" data-content="sessoes">
          <div id="sessoesPaciente">Carregando...</div>
        </div>` : ''}
      </div>
      <div class="tc-drawer-actions">
        ${p ? `<button class="btn btn-danger" id="btnExcluir">Excluir</button>` : ''}
        <button class="btn btn-ghost" id="btnCancel">Cancelar</button>
        <button class="btn btn-primary" id="btnSalvar">Salvar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('on'));
  TC_UI.aplicarMascaras(overlay);

  // Tabs
  overlay.querySelectorAll('.tc-tab').forEach(t => t.onclick = () => {
    overlay.querySelectorAll('.tc-tab').forEach(x => x.classList.remove('active'));
    overlay.querySelectorAll('.tc-tab-content').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    overlay.querySelector(`[data-content="${t.dataset.tab}"]`).classList.add('active');
    if (t.dataset.tab === 'sessoes') carregarSessoesPaciente(p.id, overlay);
  });

  const fechar = () => { overlay.classList.remove('on'); setTimeout(() => overlay.remove(), 280); };
  overlay.querySelector('#drawerClose').onclick = fechar;
  overlay.querySelector('#btnCancel').onclick = fechar;
  overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });

  overlay.querySelector('#btnSalvar').onclick = async () => {
    const form = overlay.querySelector('#formPaciente');
    if (!TC_UI.validarCampos(form)) return;
    const data = Object.fromEntries(new FormData(form));
    data.telefone = (data.telefone || '').replace(/\D/g,'');
    data.cpf = (data.cpf || '').replace(/\D/g,'');
    if (!data.data_nascimento) delete data.data_nascimento;
    try {
      if (editandoId) await TC_DB.pacientes.update(editandoId, data);
      else await TC_DB.pacientes.create(data);
      TC_UI.toast('Paciente salvo!', 'sucesso');
      fechar(); carregar();
    } catch (e) { console.error(e); TC_UI.toast('Erro ao salvar.', 'erro'); }
  };

  overlay.querySelector('#btnExcluir')?.addEventListener('click', async () => {
    const ok = await TC_UI.confirmar({
      titulo: 'Excluir paciente?',
      mensagem: 'Esta ação não pode ser desfeita. Todas as sessões deste paciente também serão removidas.',
      ok: 'Excluir', perigo: true
    });
    if (!ok) return;
    await TC_DB.pacientes.remove(editandoId);
    TC_UI.toast('Paciente removido.', 'sucesso');
    fechar(); carregar();
  });
}

async function carregarSessoesPaciente(id, overlay) {
  const el = overlay.querySelector('#sessoesPaciente');
  try {
    const ss = await TC_DB.sessoes.list({ paciente_id: id });
    if (!ss.length) { el.innerHTML = '<div class="agenda-empty">Sem sessões registradas.</div>'; return; }
    el.innerHTML = ss.map(s => `
      <div class="agenda-slot ${s.status}">
        <div class="agenda-hora">${s.hora.slice(0,5)}</div>
        <div>
          <div class="agenda-nome">${TC_UI.fmt.data(s.data)}</div>
          <div class="agenda-meta">${s.modalidade} · ${s.duracao_min}min</div>
        </div>
        <span class="badge badge-${s.status}">${s.status}</span>
      </div>
    `).join('');
  } catch (e) { el.innerHTML = 'Erro ao carregar.'; }
}

function renderAnamnese(a) {
  if (!a || Object.keys(a).length === 0) return '<p style="color:var(--cinza-500)">Sem anamnese.</p>';
  const blocos = [];
  const grupos = [
    { titulo: '👤 Dados', campos: ['estado_civil','escolaridade','ocupacao','religiao','reside','endereco','origem'] },
    { titulo: '💬 Queixas e objetivos', campos: ['motivos','objetivos'] },
    { titulo: '🌱 Como está hoje', campos: ['quando_comecou','fatores_contribuintes','maior_incomodo','hobbies'] },
    { titulo: '💊 Saúde', campos: ['saude_fisica','sono','medicamentos','doencas','acompanhamento'] },
    { titulo: '👨‍👩‍👧 Família', campos: ['relacao_pais','irmaos','filhos','historico_familiar'] },
    { titulo: '💞 Relacionamentos', campos: ['vida_afetiva','amizades','confidente'] },
    { titulo: '💼 Trabalho', campos: ['trabalho_sentimentos','trabalho_problemas','metas'] },
    { titulo: '🕊️ Espiritualidade', campos: ['papel_fe','fe_impacto','temas_espirituais'] },
    { titulo: '📝 Final', campos: ['observacoes','modalidade_pref','horario_pref'] }
  ];
  for (const g of grupos) {
    const items = g.campos.filter(c => a[c]).map(c => `<dt>${c.replace(/_/g,' ')}</dt><dd>${String(a[c]).replace(/\n/g,'<br>')}</dd>`).join('');
    if (items) blocos.push(`<h4 style="margin-top:20px;color:var(--verde-900)">${g.titulo}</h4><dl class="info-list">${items}</dl>`);
  }
  // Sintomas e Sentimentos
  if (a.sintomas?.length) blocos.push(`<h4 style="margin-top:20px">⚠️ Sintomas</h4><p>${a.sintomas.map(s=>`<span class="badge badge-ativo" style="margin:2px">${s}</span>`).join('')}</p>`);
  if (a.sentimentos && Object.keys(a.sentimentos).length) {
    const sents = Object.entries(a.sentimentos).map(([k,v]) =>
      `<span class="badge badge-${v==='R'?'cancelado':'novo'}" style="margin:2px">${k} (${v})</span>`).join('');
    blocos.push(`<h4 style="margin-top:20px">💭 Sentimentos</h4><p>${sents}</p>`);
  }
  return blocos.join('') || '<p style="color:var(--cinza-500)">Sem dados.</p>';
}
