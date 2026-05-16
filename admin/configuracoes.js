/* Configurações */
TC_UI.ready(async () => {
  const shell = await AdminShell.renderAdminShell({
    titulo: 'Configurações',
    subtitulo: 'Personalize seu sistema',
    page: 'configuracoes.html'
  });
  if (!shell) return;
  shell.contentEl.appendChild(document.getElementById('pageContent').content.cloneNode(true));
  AdminShell.bindAdminShell();

  // Tabs
  document.querySelectorAll('.tc-tab').forEach(t => t.onclick = () => {
    document.querySelectorAll('.tc-tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tc-tab-content').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.querySelector(`[data-content="${t.dataset.tab}"]`).classList.add('active');
  });

  // Carregar config
  const cfg = await TC_DB.configuracoes.get(true);
  for (const [k,v] of Object.entries(cfg)) {
    const el = document.querySelector(`[name="${k}"]`);
    if (el) el.value = v ?? '';
  }

  document.getElementById('supaUrl').textContent = window.TC_CONFIG.SUPABASE_URL;

  // Submit clínica
  document.getElementById('formClinica').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.valor_sessao = parseFloat(data.valor_sessao) || 0;
    data.duracao_sessao_min = parseInt(data.duracao_sessao_min) || 50;
    data.whatsapp = (data.whatsapp||'').replace(/\D/g,'');
    try { await TC_DB.configuracoes.update(data); TC_UI.toast('Salvo!', 'sucesso'); }
    catch (e) { console.error(e); TC_UI.toast('Erro ao salvar.', 'erro'); }
  };

  // Submit mensagens
  document.getElementById('formMsgs').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try { await TC_DB.configuracoes.update(data); TC_UI.toast('Modelos atualizados!', 'sucesso'); }
    catch (e) { TC_UI.toast('Erro ao salvar.', 'erro'); }
  };

  // Submit senha
  document.getElementById('formSenha').onsubmit = async (e) => {
    e.preventDefault();
    const nova = document.getElementById('senhaNova').value;
    const conf = document.getElementById('senhaConf').value;
    if (nova.length < 6) { TC_UI.toast('Senha mínima 6 caracteres.', 'aviso'); return; }
    if (nova !== conf) { TC_UI.toast('As senhas não coincidem.', 'aviso'); return; }
    try {
      await TC_AUTH.updatePassword(nova);
      TC_UI.toast('Senha atualizada!', 'sucesso');
      e.target.reset();
    } catch (e) { console.error(e); TC_UI.toast('Erro ao atualizar.', 'erro'); }
  };
});
