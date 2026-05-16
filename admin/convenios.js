/* Convênios */
let lista = [];

TC_UI.ready(async () => {
  const shell = await AdminShell.renderAdminShell({
    titulo: 'Convênios',
    subtitulo: 'Empresas, igrejas, escolas e parceiros',
    page: 'convenios.html'
  });
  if (!shell) return;
  shell.contentEl.appendChild(document.getElementById('pageContent').content.cloneNode(true));
  AdminShell.bindAdminShell();

  document.getElementById('btnNovo').onclick = () => abrir(null);
  document.getElementById('buscar').addEventListener('input', carregar);
  await carregar();
});

async function carregar() {
  const tbody = document.getElementById('tabela');
  tbody.innerHTML = '<tr><td colspan="6" class="tc-table-empty">Carregando...</td></tr>';
  try {
    lista = await TC_DB.convenios.list();
    const q = (document.getElementById('buscar').value || '').toLowerCase();
    const filt = q ? lista.filter(c => c.nome.toLowerCase().includes(q) || (c.contato_nome||'').toLowerCase().includes(q)) : lista;
    if (!filt.length) { tbody.innerHTML = '<tr><td colspan="6" class="tc-table-empty">Nenhum convênio.</td></tr>'; return; }
    tbody.innerHTML = filt.map(c => `
      <tr>
        <td><strong>${c.nome}</strong></td>
        <td><span class="badge badge-novo">${c.tipo}</span></td>
        <td>${c.contato_nome || '—'}<br><small style="color:var(--cinza-500)">${TC_UI.fmt.telefone(c.contato_telefone)}</small></td>
        <td>${c.desconto_percent || 0}%</td>
        <td><span class="badge badge-${c.ativo?'ativo':'inativo'}">${c.ativo?'Ativo':'Inativo'}</span></td>
        <td class="actions"><button class="btn btn-secondary btn-sm" onclick='editar("${c.id}")'>Editar</button></td>
      </tr>
    `).join('');
  } catch (e) { tbody.innerHTML = '<tr><td colspan="6" class="tc-table-empty">Erro ao carregar.</td></tr>'; }
}

window.editar = (id) => abrir(lista.find(c => c.id === id));

function abrir(c) {
  const overlay = document.createElement('div');
  overlay.className = 'tc-drawer-overlay';
  overlay.innerHTML = `
    <div class="tc-drawer">
      <div class="tc-drawer-head">
        <h3>${c ? '✏️ Editar' : '➕ Novo'} convênio</h3>
        <button class="tc-drawer-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="tc-drawer-body">
        <form id="form" class="tc-form">
          <div class="tc-form-row">
            <div class="tc-field"><label>Nome *</label><input name="nome" required value="${c?.nome||''}"></div>
            <div class="tc-field"><label>Tipo</label>
              <select name="tipo">
                ${['empresa','igreja','escola','hospital','convenio','outro'].map(t => `<option value="${t}" ${c?.tipo===t?'selected':''}>${t}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="tc-form-row">
            <div class="tc-field"><label>Contato (nome)</label><input name="contato_nome" value="${c?.contato_nome||''}"></div>
            <div class="tc-field"><label>Telefone</label><input name="contato_telefone" data-mask="phone" value="${c?.contato_telefone?TC_UI.fmt.telefone(c.contato_telefone):''}"></div>
          </div>
          <div class="tc-form-row">
            <div class="tc-field"><label>E-mail</label><input name="contato_email" type="email" value="${c?.contato_email||''}"></div>
            <div class="tc-field"><label>CNPJ</label><input name="cnpj" data-mask="cnpj" value="${c?.cnpj||''}"></div>
          </div>
          <div class="tc-form-row">
            <div class="tc-field"><label>Desconto (%)</label><input type="number" name="desconto_percent" step="0.01" value="${c?.desconto_percent||0}"></div>
            <div class="tc-field"><label>Ativo</label>
              <select name="ativo">
                <option value="true" ${c?.ativo!==false?'selected':''}>Sim</option>
                <option value="false" ${c?.ativo===false?'selected':''}>Não</option>
              </select>
            </div>
          </div>
          <div class="tc-field"><label>Endereço</label><input name="endereco" value="${c?.endereco||''}"></div>
          <div class="tc-field"><label>Observações</label><textarea name="observacoes" rows="3">${c?.observacoes||''}</textarea></div>
        </form>
      </div>
      <div class="tc-drawer-actions">
        ${c ? `<button class="btn btn-danger" id="btnDel">Excluir</button>` : ''}
        <button class="btn btn-ghost" id="btnCancel">Cancelar</button>
        <button class="btn btn-primary" id="btnSalvar">Salvar</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('on'));
  TC_UI.aplicarMascaras(overlay);

  const fechar = () => { overlay.classList.remove('on'); setTimeout(() => overlay.remove(), 280); };
  overlay.querySelector('.tc-drawer-close').onclick = fechar;
  overlay.querySelector('#btnCancel').onclick = fechar;

  overlay.querySelector('#btnSalvar').onclick = async () => {
    const form = overlay.querySelector('#form');
    if (!TC_UI.validarCampos(form)) return;
    const data = Object.fromEntries(new FormData(form));
    data.desconto_percent = parseFloat(data.desconto_percent) || 0;
    data.ativo = data.ativo === 'true';
    data.contato_telefone = (data.contato_telefone||'').replace(/\D/g,'');
    data.cnpj = (data.cnpj||'').replace(/\D/g,'');
    try {
      if (c) await TC_DB.convenios.update(c.id, data);
      else await TC_DB.convenios.create(data);
      TC_UI.toast('Convênio salvo!', 'sucesso');
      fechar(); carregar();
    } catch (e) { console.error(e); TC_UI.toast('Erro ao salvar.', 'erro'); }
  };

  overlay.querySelector('#btnDel')?.addEventListener('click', async () => {
    const ok = await TC_UI.confirmar({ titulo: 'Excluir convênio?', perigo: true, ok: 'Excluir' });
    if (!ok) return;
    await TC_DB.convenios.remove(c.id);
    TC_UI.toast('Removido.', 'sucesso');
    fechar(); carregar();
  });
}
