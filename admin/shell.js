/* ============================================================
   ADMIN SHELL — Sidebar + Topbar injetados em todas páginas
   Elimina redundância de código entre as páginas admin.
   ============================================================ */

const NAV_ITEMS = [
  { sec: 'Principal' },
  { href: 'dashboard.html',     label: 'Dashboard',    icon: 'grid' },
  { href: 'pacientes.html',     label: 'Pacientes',    icon: 'users' },
  { href: 'agenda.html',        label: 'Agenda',       icon: 'calendar' },
  { sec: 'Gestão' },
  { href: 'prontuarios.html',   label: 'Anamneses',    icon: 'file-text' },
  { href: 'whatsapp.html',      label: 'WhatsApp',     icon: 'message-circle' },
  { href: 'convenios.html',     label: 'Convênios',    icon: 'briefcase' },
  { sec: 'Sistema' },
  { href: 'configuracoes.html', label: 'Configurações', icon: 'settings' }
];

const ICONS = {
  grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  'file-text': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  'message-circle': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
  briefcase: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
  settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
};

async function renderAdminShell({ titulo, subtitulo, page }) {
  // Verificar auth
  const session = await TC_AUTH.requireAuth('login.html');
  if (!session) return;

  const userEmail = session.email || 'admin';
  const userNome = session.nome || userEmail;
  const userInicial = userNome[0].toUpperCase();

  // SIDEBAR HTML
  const sidebarItems = NAV_ITEMS.map(it => {
    if (it.sec) return `<li class="admin-nav-section">${it.sec}</li>`;
    const active = it.href === page ? ' active' : '';
    return `<li><a href="${it.href}" class="${active}">${ICONS[it.icon] || ''}<span>${it.label}</span></a></li>`;
  }).join('');

  const shellHTML = `
    <aside class="admin-sidebar" id="adminSidebar">
      <div class="admin-sidebar-brand">
        <img src="../assets/img/logo.png" alt="Logo">
        <div class="name">Terapia Cristã<small>Painel Admin</small></div>
      </div>
      <ul class="admin-nav">${sidebarItems}</ul>
      <div class="admin-sidebar-bottom">v2.0 · Online ✓</div>
    </aside>
    <div class="admin-main">
      <header class="admin-topbar">
        <div style="display:flex;align-items:center">
          <button class="admin-menu-mobile" id="adminMenuBtn" title="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <h1>${titulo}${subtitulo ? `<small>${subtitulo}</small>` : ''}</h1>
        </div>
        <div class="admin-topbar-actions">
          <a href="perfil.html" class="admin-user" style="text-decoration:none">
            <div class="admin-user-avatar">${userInicial}</div>
            <span>${userNome}</span>
          </a>
          <button class="admin-logout-btn" id="btnLogout" title="Sair">
            ${ICONS.logout}
          </button>
        </div>
      </header>
      <main class="admin-content" id="adminContent"></main>
    </div>
  `;

  // Encontrar elementos: body já tem class admin-body
  document.body.innerHTML = `<div class="admin-layout">${shellHTML}</div>` + `<div id="__contentSlot" style="display:none"></div>`;

  // Pegar HTML original do main do desenvolvedor
  return {
    contentEl: document.getElementById('adminContent'),
    session
  };
}

// Bind comportamento depois de injetar conteúdo
function bindAdminShell() {
  // Menu mobile toggle
  document.getElementById('adminMenuBtn')?.addEventListener('click', () => {
    document.getElementById('adminSidebar')?.classList.toggle('open');
  });

  // Logout
  document.getElementById('btnLogout')?.addEventListener('click', async () => {
    const ok = await TC_UI.confirmar({
      titulo: 'Sair do sistema?',
      mensagem: 'Você precisará fazer login novamente para acessar o painel.',
      ok: 'Sair',
      perigo: true
    });
    if (!ok) return;
    await TC_AUTH.signOut();
    window.location.href = 'login.html';
  });
}

window.AdminShell = { renderAdminShell, bindAdminShell, NAV_ITEMS, ICONS };
