/* Dashboard */
TC_UI.ready(async () => {
  const shell = await AdminShell.renderAdminShell({
    titulo: 'Dashboard',
    subtitulo: 'Visão geral do seu consultório',
    page: 'dashboard.html'
  });
  if (!shell) return;
  shell.contentEl.appendChild(document.getElementById('pageContent').content.cloneNode(true));
  AdminShell.bindAdminShell();

  try {
    const [stats, sessoesHoje, prontuarios] = await Promise.all([
      TC_DB.stats.dashboard(),
      TC_DB.sessoes.list({ data: new Date().toISOString().slice(0,10) }),
      TC_DB.prontuarios.list({ limit: 8 })
    ]);

    document.getElementById('statPacientes').textContent = stats.pacientesAtivos;
    document.getElementById('statHoje').textContent = stats.sessoesHoje;
    document.getElementById('statMes').textContent = stats.sessoesMes;
    document.getElementById('statNovas').textContent = stats.prontuariosNovos;

    // Sessões hoje
    const sHoje = document.getElementById('sessoesHoje');
    if (sessoesHoje.length === 0) {
      sHoje.innerHTML = '<div class="agenda-empty">Nenhuma sessão agendada para hoje. Aproveite o tempo livre! 🙏</div>';
    } else {
      sHoje.innerHTML = sessoesHoje.map(s => `
        <div class="agenda-slot ${s.modalidade === 'online' ? 'online' : ''} ${s.status}">
          <div class="agenda-hora">${s.hora.slice(0,5)}</div>
          <div>
            <div class="agenda-nome">${s.pacientes?.nome || '—'}</div>
            <div class="agenda-meta">${s.modalidade} · ${s.tipo || 'individual'} · ${s.duracao_min} min</div>
          </div>
          <span class="badge badge-${s.status}">${s.status}</span>
        </div>
      `).join('');
    }

    // Prontuários recentes
    const tbody = document.getElementById('prontuariosRecentes');
    if (prontuarios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="tc-table-empty">Nenhuma anamnese ainda.</td></tr>';
    } else {
      tbody.innerHTML = prontuarios.map(p => `
        <tr>
          <td><strong>${p.nome}</strong><br><small style="color:var(--cinza-500)">${p.email || ''}</small></td>
          <td>${TC_UI.fmt.telefone(p.telefone)}</td>
          <td>${TC_UI.fmt.dataHora(p.criado_em)}</td>
          <td><span class="badge badge-${p.status}">${p.status}</span></td>
          <td class="actions">
            <a href="prontuarios.html?id=${p.id}" class="btn btn-secondary btn-sm">Ver</a>
          </td>
        </tr>
      `).join('');
    }
  } catch (e) {
    console.error(e);
    TC_UI.toast('Erro ao carregar dados. Verifique a configuração do Supabase.', 'erro');
  }
});
