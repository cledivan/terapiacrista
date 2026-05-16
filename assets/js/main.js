/* ============================================================
   TERAPIA CRISTÃ — Main (Landing Page)
   ============================================================ */
(function() {
  TC_UI.ready(async () => {
    // ---- Navbar scroll ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) navbar?.classList.add('scrolled');
      else navbar?.classList.remove('scrolled');
    });

    // ---- Menu mobile ----
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');
    toggle?.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      links.classList.remove('open');
    }));

    // ---- Carregar config dinâmica do banco (se disponível) ----
    let whatsappNum = window.TC_CONFIG.clinica.whatsapp;
    let whatsappDisplay = window.TC_CONFIG.clinica.whatsappDisplay;
    let mensagemBoas = 'Olá! Vim pelo site da Terapia Cristã e gostaria de agendar uma sessão. 🙏';

    try {
      const cfg = await TC_DB.configuracoes.get();
      if (cfg?.whatsapp) {
        whatsappNum = cfg.whatsapp;
        const s = cfg.whatsapp.replace(/\D/g,'');
        const local = s.startsWith('55') ? s.slice(2) : s;
        if (local.length === 11) whatsappDisplay = `(${local.slice(0,2)}) ${local.slice(2,7)}-${local.slice(7)}`;
      }
      if (cfg?.mensagem_boas_vindas) mensagemBoas = cfg.mensagem_boas_vindas;
    } catch (e) {
      console.warn('Config remota indisponível, usando defaults', e);
    }

    // ---- Aplicar telefone em todos os elementos ----
    document.querySelectorAll('[data-whatsapp-display]').forEach(el => el.textContent = whatsappDisplay);
    function abrirWhats(mensagem) {
      const txt = mensagem || mensagemBoas;
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(txt)}`, '_blank');
    }
    document.querySelectorAll('[data-whatsapp]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        abrirWhats(el.dataset.whatsappMsg);
      });
    });

    window.abrirAgendamento = function(e) {
      e?.preventDefault();
      abrirWhats('Olá! Gostaria de agendar uma sessão de Terapia Cristã. 🙏');
    };

    // ---- Animar ao rolar (reveal) ----
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  });
})();
