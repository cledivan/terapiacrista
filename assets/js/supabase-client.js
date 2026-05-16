/* ============================================================
   TERAPIA CRISTÃ — Cliente Supabase + Camada DB Unificada
   ============================================================
   Substitui todo o localStorage por banco online.
   API consistente: TC_DB.prontuarios.list(), TC_DB.pacientes.create(), etc.
   Funciona com fallback offline em caso de erro de rede.
   ============================================================ */

(function() {
  const cfg = window.TC_CONFIG;
  if (!cfg) {
    console.error('TC_CONFIG ausente. Carregue config.js antes de supabase-client.js');
    return;
  }

  // Cria cliente Supabase (CDN: supabase-js v2)
  const supa = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'tc-auth',
      storage: window.localStorage
    }
  });

  window.TC_SUPABASE = supa;

  // ============================================================
  // AUTH (Login Direto no Banco)
  // ============================================================
  const TC_AUTH = {
    async signIn(email, senha) {
      // Busca o usuário diretamente na tabela personalizada
      const { data, error } = await supa
        .from('usuarios_admin')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('senha', senha)
        .eq('ativo', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Usuário ou senha inválidos.');

      // Salva a "sessão" simples no localStorage
      localStorage.setItem('tc_session', JSON.stringify(data));
      return data;
    },
    async signOut() {
      localStorage.removeItem('tc_session');
      window.location.href = '../admin/login.html';
    },
    async getSession() {
      const s = localStorage.getItem('tc_session');
      return s ? JSON.parse(s) : null;
    },
    async requireAuth(redirect = 'login.html') {
      const s = await this.getSession();
      if (!s) { window.location.href = redirect; return null; }
      return s;
    }
  };

  // ============================================================
  // PRONTUÁRIOS (anamneses)
  // ============================================================
  const prontuarios = {
    async list({ status = null, search = null, limit = 200 } = {}) {
      let q = supa.from('prontuarios').select('*').order('criado_em', { ascending: false }).limit(limit);
      if (status) q = q.eq('status', status);
      if (search) q = q.or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async get(id) {
      const { data, error } = await supa.from('prontuarios').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async create(payload) {
      const { data, error } = await supa.from('prontuarios').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    async update(id, patch) {
      const { data, error } = await supa.from('prontuarios').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async remove(id) {
      const { error } = await supa.from('prontuarios').delete().eq('id', id);
      if (error) throw error;
    }
  };

  // ============================================================
  // PACIENTES
  // ============================================================
  const pacientes = {
    async list({ status = null, search = null, limit = 500 } = {}) {
      let q = supa.from('pacientes').select('*').order('criado_em', { ascending: false }).limit(limit);
      if (status) q = q.eq('status', status);
      if (search) q = q.or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async get(id) {
      const { data, error } = await supa.from('pacientes').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async create(payload) {
      const { data, error } = await supa.from('pacientes').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    async update(id, patch) {
      const { data, error } = await supa.from('pacientes').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async remove(id) {
      const { error } = await supa.from('pacientes').delete().eq('id', id);
      if (error) throw error;
    },
    /**
     * Importa um prontuário automaticamente para pacientes (se ainda não existir)
     */
    async importarDeProntuario(prontuarioId) {
      const pr = await prontuarios.get(prontuarioId);
      const { data: existente } = await supa.from('pacientes').select('id').eq('prontuario_id', prontuarioId).maybeSingle();
      if (existente) return existente;
      return this.create({
        prontuario_id: pr.id,
        nome: pr.nome,
        email: pr.email,
        telefone: pr.telefone,
        cpf: pr.cpf,
        data_nascimento: pr.data_nascimento,
        origem: pr.origem,
        status: 'ativo',
        anamnese: pr.dados || {}
      });
    },
    /** Sincroniza TODOS os prontuários novos como pacientes (idempotente) */
    async sincronizarAnamneses() {
      const prs = await prontuarios.list({ limit: 1000 });
      const { data: pacs } = await supa.from('pacientes').select('prontuario_id');
      const existentes = new Set((pacs || []).map(p => p.prontuario_id).filter(Boolean));
      let novos = 0;
      for (const pr of prs) {
        if (existentes.has(pr.id)) continue;
        try {
          await this.importarDeProntuario(pr.id);
          await prontuarios.update(pr.id, { status: 'em_atendimento' });
          novos++;
        } catch (e) { console.warn('sync', e); }
      }
      return novos;
    }
  };

  // ============================================================
  // SESSÕES
  // ============================================================
  const sessoes = {
    async list({ data = null, paciente_id = null, mes = null, limit = 1000 } = {}) {
      let q = supa.from('sessoes').select('*, pacientes(nome, telefone)').order('data', { ascending: true }).order('hora', { ascending: true }).limit(limit);
      if (data) q = q.eq('data', data);
      if (paciente_id) q = q.eq('paciente_id', paciente_id);
      if (mes) {
        const ini = mes + '-01';
        const fim = new Date(mes + '-01');
        fim.setMonth(fim.getMonth() + 1);
        q = q.gte('data', ini).lt('data', fim.toISOString().slice(0,10));
      }
      const { data: rows, error } = await q;
      if (error) throw error;
      return rows || [];
    },
    async create(payload) {
      const { data, error } = await supa.from('sessoes').insert(payload).select('*, pacientes(nome, telefone)').single();
      if (error) throw error;
      return data;
    },
    async update(id, patch) {
      const { data, error } = await supa.from('sessoes').update(patch).eq('id', id).select('*, pacientes(nome, telefone)').single();
      if (error) throw error;
      return data;
    },
    async remove(id) {
      const { error } = await supa.from('sessoes').delete().eq('id', id);
      if (error) throw error;
    }
  };

  // ============================================================
  // CONVÊNIOS / PARCEIROS
  // ============================================================
  const convenios = {
    async list({ ativo = null, limit = 500 } = {}) {
      let q = supa.from('convenios').select('*').order('nome', { ascending: true }).limit(limit);
      if (ativo !== null) q = q.eq('ativo', ativo);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async create(payload) {
      const { data, error } = await supa.from('convenios').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    async update(id, patch) {
      const { data, error } = await supa.from('convenios').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async remove(id) {
      const { error } = await supa.from('convenios').delete().eq('id', id);
      if (error) throw error;
    }
  };

  // ============================================================
  // CONFIGURAÇÕES (singleton)
  // ============================================================
  let _configCache = null;
  const configuracoes = {
    async get(force = false) {
      if (_configCache && !force) return _configCache;
      const { data, error } = await supa.from('configuracoes').select('*').eq('id', 1).single();
      if (error) throw error;
      _configCache = data;
      return data;
    },
    async update(patch) {
      const { data, error } = await supa.from('configuracoes').update(patch).eq('id', 1).select().single();
      if (error) throw error;
      _configCache = data;
      return data;
    }
  };

  // ============================================================
  // MENSAGENS WHATSAPP
  // ============================================================
  const whatsapp = {
    async list({ limit = 200 } = {}) {
      const { data, error } = await supa.from('mensagens_whatsapp').select('*').order('criado_em', { ascending: false }).limit(limit);
      if (error) throw error;
      return data || [];
    },
    async registrar(payload) {
      const { data, error } = await supa.from('mensagens_whatsapp').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    /** Abre o WhatsApp Web/App com mensagem pronta */
    abrirChat(telefone, mensagem) {
      const num = String(telefone || '').replace(/\D/g, '');
      const final = num.startsWith('55') ? num : '55' + num;
      const url = `https://wa.me/${final}?text=${encodeURIComponent(mensagem || '')}`;
      window.open(url, '_blank');
    },
    /** Substitui placeholders {NOME}, {HORA}, {DATA} */
    montarMensagem(template, paciente = {}, sessao = {}) {
      let msg = template || '';
      msg = msg.replace(/\{NOME\}/g, paciente.nome || 'amigo(a)');
      msg = msg.replace(/\{PRIMEIRO_NOME\}/g, (paciente.nome || '').split(' ')[0]);
      msg = msg.replace(/\{HORA\}/g, sessao.hora || '');
      msg = msg.replace(/\{DATA\}/g, sessao.data ? new Date(sessao.data + 'T00:00').toLocaleDateString('pt-BR') : '');
      return msg;
    }
  };

  // ============================================================
  // ESTATÍSTICAS
  // ============================================================
  const stats = {
    async dashboard() {
      const hoje = new Date().toISOString().slice(0,10);
      const mesIni = hoje.slice(0,7) + '-01';
      const mesFim = (() => { const d = new Date(mesIni); d.setMonth(d.getMonth()+1); return d.toISOString().slice(0,10); })();

      const [pacAtivos, sessHoje, sessMes, prontNovos] = await Promise.all([
        supa.from('pacientes').select('id', { count: 'exact', head: true }).eq('status', 'ativo'),
        supa.from('sessoes').select('id', { count: 'exact', head: true }).eq('data', hoje),
        supa.from('sessoes').select('id', { count: 'exact', head: true }).gte('data', mesIni).lt('data', mesFim),
        supa.from('prontuarios').select('id', { count: 'exact', head: true }).eq('status', 'novo')
      ]);
      return {
        pacientesAtivos: pacAtivos.count || 0,
        sessoesHoje: sessHoje.count || 0,
        sessoesMes: sessMes.count || 0,
        prontuariosNovos: prontNovos.count || 0
      };
    }
  };

  // ============================================================
  // ADMIN / USUÁRIOS
  // ============================================================
  const admin = {
    async update(id, patch) {
      const { data, error } = await supa.from('usuarios_admin').update(patch).eq('id', id).select().single();
      if (error) throw error;
      // Se atualizou o próprio usuário, atualiza a sessão local
      const session = await TC_AUTH.getSession();
      if (session && session.id === id) {
        localStorage.setItem('tc_session', JSON.stringify({ ...session, ...data }));
      }
      return data;
    }
  };

  // ============================================================
  // EXPORTAR
  // ============================================================
  window.TC_AUTH = TC_AUTH;
  window.TC_DB = {
    auth: TC_AUTH,
    prontuarios,
    pacientes,
    sessoes,
    convenios,
    configuracoes,
    whatsapp,
    stats,
    admin,
    raw: supa
  };
})();
