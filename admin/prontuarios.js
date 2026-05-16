/* Anamneses (Prontuários) */
let prontList = [];

TC_UI.ready(async () => {
  const shell = await AdminShell.renderAdminShell({
    titulo: 'Anamneses',
    subtitulo: 'Formulários recebidos pelo site',
    page: 'prontuarios.html'
  });
  if (!shell) return;
  shell.contentEl.appendChild(document.getElementById('pageContent').content.cloneNode(true));
  AdminShell.bindAdminShell();

  document.getElementById('buscar').addEventListener('input', e => carregar(e.target.value, document.getElementById('filtroStatus').value));
  document.getElementById('filtroStatus').onchange = e => carregar(document.getElementById('buscar').value, e.target.value);
  document.getElementById('btnSync').onclick = sincronizar;

  await carregar();

  // ?id=xxx
  const urlId = new URLSearchParams(location.search).get('id');
  if (urlId) {
    try { const p = await TC_DB.prontuarios.get(urlId); abrir(p); } catch {}
  }
});

async function carregar(search = '', status = '') {
  const tbody = document.getElementById('tabela');
  tbody.innerHTML = '<tr><td colspan="6" class="tc-table-empty">Carregando...</td></tr>';
  try {
    prontList = await TC_DB.prontuarios.list({ search: search || null, status: status || null });
    if (!prontList.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="tc-table-empty">Nenhuma anamnese encontrada.</td></tr>';
      return;
    }
    tbody.innerHTML = prontList.map(p => `
      <tr>
        <td><strong>${p.nome}</strong><br><small style="color:var(--cinza-500)">${p.email || '—'}</small></td>
        <td>${TC_UI.fmt.telefone(p.telefone)}</td>
        <td>${p.origem || '—'}</td>
        <td>${TC_UI.fmt.dataHora(p.criado_em)}</td>
        <td><span class="badge badge-${p.status}">${p.status}</span></td>
        <td class="actions">
          <button class="btn btn-secondary btn-sm" onclick='abrirProntuario("${p.id}")'>Ver</button>
          <button class="btn btn-whatsapp btn-sm" onclick='chamarWhats("${p.id}")'>WA</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="6" class="tc-table-empty">Erro ao carregar.</td></tr>';
  }
}

window.abrirProntuario = (id) => {
  const p = prontList.find(x => x.id === id);
  if (p) abrir(p);
};

window.chamarWhats = async (id) => {
  const p = prontList.find(x => x.id === id);
  if (!p?.telefone) { TC_UI.toast('Sem telefone.', 'aviso'); return; }
  const cfg = await TC_DB.configuracoes.get();
  const msg = TC_DB.whatsapp.montarMensagem(cfg.mensagem_pos_anamnese, { nome: p.nome });
  TC_DB.whatsapp.abrirChat(p.telefone, msg);
  TC_DB.whatsapp.registrar({ destinatario: p.telefone, mensagem: msg, tipo: 'pos_anamnese' }).catch(()=>{});
};

async function sincronizar() {
  TC_UI.showLoader('Sincronizando...');
  try {
    const n = await TC_DB.pacientes.sincronizarAnamneses();
    TC_UI.toast(n > 0 ? `${n} novo(s) paciente(s) criado(s)!` : 'Tudo sincronizado.', 'sucesso');
    await carregar();
  } catch (e) {
    console.error(e); TC_UI.toast('Erro ao sincronizar.', 'erro');
  } finally { TC_UI.hideLoader(); }
}

function abrir(p) {
  const overlay = document.createElement('div');
  overlay.className = 'tc-drawer-overlay';
  overlay.innerHTML = `
    <div class="tc-drawer">
      <div class="tc-drawer-head">
        <h3>📋 ${p.nome}</h3>
        <button class="tc-drawer-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="tc-drawer-body">
        <div class="info-grid" style="margin-bottom:24px">
          <dl class="info-list"><dt>E-mail</dt><dd>${p.email||'—'}</dd></dl>
          <dl class="info-list"><dt>Telefone</dt><dd>${TC_UI.fmt.telefone(p.telefone)}</dd></dl>
          <dl class="info-list"><dt>CPF</dt><dd>${TC_UI.fmt.cpf(p.cpf)}</dd></dl>
          <dl class="info-list"><dt>Nascimento</dt><dd>${TC_UI.fmt.data(p.data_nascimento)}</dd></dl>
          <dl class="info-list"><dt>Origem</dt><dd>${p.origem||'—'}</dd></dl>
          <dl class="info-list"><dt>Status</dt><dd><span class="badge badge-${p.status}">${p.status}</span></dd></dl>
        </div>
        <div class="tc-field" style="margin-bottom:18px">
          <label>Mudar status</label>
          <select id="selStatus">
            <option value="novo" ${p.status==='novo'?'selected':''}>Novo</option>
            <option value="em_atendimento" ${p.status==='em_atendimento'?'selected':''}>Em atendimento</option>
            <option value="concluido" ${p.status==='concluido'?'selected':''}>Concluído</option>
            <option value="arquivado" ${p.status==='arquivado'?'selected':''}>Arquivado</option>
          </select>
        </div>
        <hr style="border:0;border-top:1px dashed var(--cinza-300);margin:20px 0">
        <h3 style="margin-top:0">Respostas da Anamnese</h3>
        ${renderAnamnese(p.dados || {})}
      </div>
      <div class="tc-drawer-actions">
        <button class="btn btn-danger" id="btnExcluir">Excluir</button>
        <button class="btn btn-whatsapp" id="btnWA">Enviar WhatsApp</button>
        <button class="btn btn-primary" id="btnImportar">Importar como Paciente</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('on'));

  const fechar = () => { overlay.classList.remove('on'); setTimeout(() => overlay.remove(), 280); };
  overlay.querySelector('.tc-drawer-close').onclick = fechar;
  overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });

  overlay.querySelector('#selStatus').onchange = async (e) => {
    try { await TC_DB.prontuarios.update(p.id, { status: e.target.value }); TC_UI.toast('Status atualizado.', 'sucesso'); await carregar(); }
    catch { TC_UI.toast('Erro ao atualizar.', 'erro'); }
  };

  overlay.querySelector('#btnExcluir').onclick = async () => {
    const ok = await TC_UI.confirmar({ titulo: 'Excluir anamnese?', mensagem: 'Esta ação não pode ser desfeita.', perigo: true, ok: 'Excluir' });
    if (!ok) return;
    await TC_DB.prontuarios.remove(p.id);
    TC_UI.toast('Anamnese removida.', 'sucesso');
    fechar(); carregar();
  };

  overlay.querySelector('#btnWA').onclick = () => window.chamarWhats(p.id);

  overlay.querySelector('#btnImportar').onclick = async () => {
    try {
      await TC_DB.pacientes.importarDeProntuario(p.id);
      await TC_DB.prontuarios.update(p.id, { status: 'em_atendimento' });
      TC_UI.toast('Paciente criado!', 'sucesso');
      fechar(); carregar();
    } catch { TC_UI.toast('Erro ao importar (ou já existe).', 'erro'); }
  };
}

function renderAnamnese(a) {
  if (!a || Object.keys(a).length === 0) return '<p style="color:var(--cinza-500)">Sem dados.</p>';
  const grupos = [
    { titulo: '👤 Dados pessoais', campos: ['estado_civil','escolaridade','ocupacao','religiao','reside','endereco','origem'] },
    { titulo: '💬 Queixas e objetivos', campos: ['motivos','objetivos'] },
    { titulo: '🌱 Como está hoje', campos: ['quando_comecou','fatores_contribuintes','maior_incomodo','hobbies'] },
    { titulo: '💊 Saúde', campos: ['saude_fisica','sono','medicamentos','doencas','acompanhamento'] },
    { titulo: '👨‍👩‍👧 Família', campos: ['relacao_pais','irmaos','filhos','historico_familiar'] },
    { titulo: '💞 Relacionamentos', campos: ['vida_afetiva','amizades','confidente'] },
    { titulo: '💼 Trabalho', campos: ['trabalho_sentimentos','trabalho_problemas','metas'] },
    { titulo: '🕊️ Espiritualidade', campos: ['papel_fe','fe_impacto','temas_espirituais'] },
    { titulo: '📝 Observações finais', campos: ['observacoes','modalidade_pref','horario_pref'] }
  ];
  const out = [];
  for (const g of grupos) {
    const items = g.campos.filter(c => a[c]).map(c => `<dt>${c.replace(/_/g,' ')}</dt><dd>${String(a[c]).replace(/\n/g,'<br>')}</dd>`).join('');
    if (items) out.push(`<h4 style="margin-top:20px;color:var(--verde-900)">${g.titulo}</h4><dl class="info-list">${items}</dl>`);
  }
  if (a.sintomas?.length) out.push(`<h4 style="margin-top:20px">⚠️ Sintomas</h4><p>${a.sintomas.map(s=>`<span class="badge badge-ativo" style="margin:2px">${s}</span>`).join('')}</p>`);
  if (a.sentimentos && Object.keys(a.sentimentos).length) {
    const sents = Object.entries(a.sentimentos).map(([k,v]) =>
      `<span class="badge badge-${v==='R'?'cancelado':'novo'}" style="margin:2px">${k} <strong>(${v})</strong></span>`).join('');
    out.push(`<h4 style="margin-top:20px">💭 Sentimentos</h4><p>${sents}</p>`);
  }
  return out.join('') || '<p style="color:var(--cinza-500)">Sem dados.</p>';
}
