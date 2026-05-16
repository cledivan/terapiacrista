/* WhatsApp */
TC_UI.ready(async () => {
  const shell = await AdminShell.renderAdminShell({
    titulo: 'WhatsApp',
    subtitulo: 'Comunicação rápida com pacientes',
    page: 'whatsapp.html'
  });
  if (!shell) return;
  shell.contentEl.appendChild(document.getElementById('pageContent').content.cloneNode(true));
  AdminShell.bindAdminShell();
  TC_UI.aplicarMascaras();

  const [pacientes, cfg] = await Promise.all([
    TC_DB.pacientes.list({ status: 'ativo' }),
    TC_DB.configuracoes.get()
  ]);

  const sel = document.getElementById('selPaciente');
  pacientes.forEach(p => sel.innerHTML += `<option value="${p.id}" data-tel="${p.telefone||''}" data-nome="${p.nome}">${p.nome} — ${TC_UI.fmt.telefone(p.telefone)}</option>`);

  sel.onchange = () => {
    const opt = sel.options[sel.selectedIndex];
    if (opt.dataset.tel) document.getElementById('inpTelefone').value = TC_UI.fmt.telefone(opt.dataset.tel);
  };

  document.getElementById('selModelo').onchange = (e) => {
    const txt = document.getElementById('txtMensagem');
    const v = e.target.value;
    if (v === 'boas') txt.value = cfg.mensagem_boas_vindas;
    else if (v === 'pos') txt.value = cfg.mensagem_pos_anamnese;
    else if (v === 'lembrete') txt.value = cfg.mensagem_lembrete;
  };

  document.getElementById('btnEnviar').onclick = async () => {
    const tel = document.getElementById('inpTelefone').value.replace(/\D/g,'');
    let msg = document.getElementById('txtMensagem').value.trim();
    if (!tel) { TC_UI.toast('Informe o telefone.', 'aviso'); return; }
    if (!msg) { TC_UI.toast('Digite a mensagem.', 'aviso'); return; }

    const opt = sel.options[sel.selectedIndex];
    const nome = opt?.dataset.nome || '';
    msg = TC_DB.whatsapp.montarMensagem(msg, { nome });

    TC_DB.whatsapp.abrirChat(tel, msg);

    try {
      await TC_DB.whatsapp.registrar({
        paciente_id: sel.value || null,
        destinatario: tel,
        mensagem: msg,
        tipo: 'manual'
      });
      TC_UI.toast('Mensagem registrada e WhatsApp aberto.', 'sucesso');
      carregarHistorico();
    } catch (e) {
      console.warn(e);
      TC_UI.toast('WhatsApp aberto (sem registro online).', 'aviso');
    }
  };

  await carregarHistorico();
});

async function carregarHistorico() {
  const tbody = document.getElementById('tabHistorico');
  try {
    const lista = await TC_DB.whatsapp.list({ limit: 200 });
    if (!lista.length) { tbody.innerHTML = '<tr><td colspan="4" class="tc-table-empty">Nenhuma mensagem registrada.</td></tr>'; return; }
    tbody.innerHTML = lista.map(m => `
      <tr>
        <td>${TC_UI.fmt.dataHora(m.criado_em)}</td>
        <td>${TC_UI.fmt.telefone(m.destinatario)}</td>
        <td><span class="badge badge-novo">${m.tipo}</span></td>
        <td><div style="max-width:380px;color:var(--cinza-700);font-size:0.88rem">${m.mensagem.slice(0,140)}${m.mensagem.length>140?'...':''}</div></td>
      </tr>
    `).join('');
  } catch (e) { tbody.innerHTML = '<tr><td colspan="4" class="tc-table-empty">Erro ao carregar.</td></tr>'; }
}
