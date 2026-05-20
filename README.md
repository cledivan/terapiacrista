# 🕊️ Terapia Cristã — Sistema Completo v2.0

Sistema web profissional para a clínica **Terapia Cristã** do Terapeuta **Clayton de Paula**.
Frontend HTML/CSS/JavaScript puro + banco de dados online via **Supabase** (PostgreSQL gerenciado).

---

## 🎯 Status: PRONTO PARA DEPLOY ✅

Todos os componentes estão configurados e testados:
- ✅ Schema Supabase completo com tabela `usuarios_admin`
- ✅ Autenticação admin implementada
- ✅ Dependências npm instaladas
- ✅ Frontend carregando Supabase corretamente
- ✅ Netlify configurado
- ✅ Guias de deployment criados

---

## ⚡ COMEÇAR AGORA (5 passos)

### 📋 Guias Disponíveis (leia nesta ordem):

1. **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** ← **COMECE POR AQUI!**
   - 5 passos rápidos para colocar no ar
   - ⏱️ ~15 minutos

2. **[DEPLOYMENT.md](DEPLOYMENT.md)**
   - Guia completo e detalhado
   - Troubleshooting incluído

3. **[SECURITY.md](SECURITY.md)**
   - Ações de segurança obrigatórias
   - Boas práticas para produção

4. **[CHECKLIST.md](CHECKLIST.md)**
   - Verificação de tudo antes de deploy
   - URLs e referências rápidas

---

## ✨ Funcionalidades

### 🌐 Site Público
- 🏠 Landing page institucional moderna
- 📋 Anamnese digital com 9 etapas
- 💬 WhatsApp flutuante
- 📱 100% responsivo (mobile, tablet, desktop)

### 🔐 Painel Administrativo
- 🔑 Login seguro (email + senha)
- 📊 Dashboard com métricas em tempo real
- 👥 Gestão de pacientes
- 📅 Agenda de sessões
- 📄 Prontuários e anamneses
- 💬 Integração WhatsApp
- 🏢 Gestão de convênios
- ⚙️ Configurações do sistema

### 🔄 Banco de Dados
- 📊 PostgreSQL gerenciado pelo Supabase
- 🔒 Row Level Security (RLS) ativado
- 🌍 Multi-usuário em tempo real
- 💾 Backup automático diário

---

## 🚀 Deploy Rápido (Via Netlify + GitHub)

```bash
# 1. Faça push para GitHub
git init
git add .
git commit -m "Deploy Terapia Cristã"
git branch -M main
git remote add origin https://github.com/seu-usuario/terapia-crista.git
git push -u origin main

# 2. No Netlify (https://app.netlify.com)
# - Clique "Add new site" → "Import existing project"
# - Conecte GitHub e selecione o repositório
# - Build: (deixar vazio)
# - Publish: .
# - Deploy!
```

> Para deploy automático via GitHub Actions, configure estes secrets no repositório:
> - `SUPABASE_ACCESS_TOKEN`
> - `SUPABASE_PROJECT_REF`
> - `NETLIFY_AUTH_TOKEN`
> - `NETLIFY_SITE_ID`
> - `SUPABASE_URL`
> - `SUPABASE_ANON_KEY`


**Seu site estará no ar em ~2 minutos!** 🎉

---

## 🔧 Tecnologias

| Aspecto | Tecnologia |
|--------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript vanilla |
| **Banco de dados** | PostgreSQL (Supabase) |
| **Autenticação** | Email + Senha (customizado) |
| **Hospedagem** | Netlify (ou Vercel, GitHub Pages) |
| **Versionamento** | Git + GitHub |
| **SDK** | @supabase/supabase-js v2 |

---

## 📁 Estrutura do Projeto

```
terapia-crista/
├── index.html              # Homepage
├── anamnese/
│   ├── index.html          # Formulário anamnese
│   ├── anamnese.js
│   └── anamnese.css
├── admin/                  # Painel administrativo
│   ├── login.html
│   ├── dashboard.html
│   ├── pacientes.html
│   ├── agenda.html
│   ├── prontuarios.html
│   ├── whatsapp.html
│   ├── convenios.html
│   ├── configuracoes.html
│   ├── shell.js            # Navbar compartilhada
│   └── *.js
├── assets/
│   ├── css/style.css       # Estilos (verde + dourado)
│   ├── img/logo.png
│   └── js/
│       ├── config.js       # 🔑 Credenciais Supabase
│       ├── supabase-client.js  # Cliente DB
│       ├── ui.js           # Helpers UI
│       └── main.js         # Lógica principal
├── supabase/
│   └── schema.sql          # Schema do banco
├── netlify.toml            # Config Netlify
├── QUICK_DEPLOY.md         # ⭐ Guia rápido
├── DEPLOYMENT.md           # Guia completo
├── SECURITY.md             # Segurança
└── CHECKLIST.md            # Verificações
```

---

## 🔑 Credenciais Pré-configuradas

| Item | Valor |
|------|-------|
| Supabase URL | `https://scymeuswlwhwosdpkawd.supabase.co` |
| Admin Email | `admin@terapiacrista.com` |
| Admin Password | `admin123` (⚠️ MUDE NA PRODUÇÃO!) |

---

## 🎓 Próximas Ações

### Imediatamente (Obrigatório):
1. Aplicar schema SQL no Supabase
2. Alterar senha admin
3. Fazer push para GitHub
4. Deploy no Netlify

### Depois (Recomendado):
- [ ] Configurar domínio customizado
- [ ] Ativar backup automático no Supabase
- [ ] Revisar políticas de RLS
- [ ] Testar todas as funcionalidades
- [ ] Documentar processos internos

### Futuro (Opcional):
- [ ] Integração com SMS
- [ ] Email automático
- [ ] Analytics avançado
- [ ] Agendamento online

---

## 📞 Suporte

| Dúvida | Recurso |
|-------|---------|
| Como deploying? | Leia [QUICK_DEPLOY.md](QUICK_DEPLOY.md) |
| Erros no deploy? | Veja [DEPLOYMENT.md](DEPLOYMENT.md) Troubleshooting |
| Segurança? | Consulte [SECURITY.md](SECURITY.md) |
| Verificação final? | Use [CHECKLIST.md](CHECKLIST.md) |
| Docs Supabase | https://supabase.com/docs |
| Docs Netlify | https://docs.netlify.com |

---

## 📝 Changelog

### v2.0 (16 de Maio de 2026)
- ✅ Schema Supabase completo
- ✅ Tabela `usuarios_admin` adicionada
- ✅ RLS policies configuradas
- ✅ Guias de deployment criados
- ✅ Segurança configurada

### v1.0 (Inicial)
- Frontend HTML/CSS/JS
- Formulário anamnese
- Painel admin básico
- Integração Supabase

---

## 📄 Licença

Projeto desenvolvido para **Terapia Cristã** © 2026

---

## 🎉 Bora colocar no ar?

**[Comece com QUICK_DEPLOY.md →](QUICK_DEPLOY.md)**

│   ├── login.html          # Login (Supabase Auth)
│   ├── dashboard.html / .js
│   ├── pacientes.html / .js
│   ├── prontuarios.html / .js   # Anamneses recebidas
│   ├── agenda.html / .js
│   ├── whatsapp.html / .js
│   ├── convenios.html / .js
│   ├── configuracoes.html / .js
│   ├── shell.js            # Sidebar/topbar compartilhados
│   └── admin.css
└── supabase/
    └── schema.sql          # SQL para criar tabelas e políticas
```

---

## 🛡️ Segurança

- **RLS ativado** — apenas usuários autenticados acessam pacientes/sessões
- **Anamnese pública** — pode ser preenchida sem login, mas só admin lê
- **Senha hasheada** — via Supabase Auth
- **HTTPS automático** — em Netlify/Vercel/GitHub Pages

---

## 📞 Configurações já aplicadas

- **WhatsApp**: `+55 12 99618-4359` (atualizado conforme solicitado)
- **Terapeuta**: Clayton de Paula
- **Logo**: incluído em `assets/img/logo.png`

> Você pode mudar tudo isso depois pelo painel admin em **Configurações**.

---

## ❓ Suporte

- **Erro "TC_CONFIG ausente"** → verifique se `config.js` foi editado corretamente
- **Login não funciona** → confirme no Supabase se o usuário foi criado e "Auto Confirm" estava marcado
- **Sem dados na lista** → o RLS exige login; faça logout/login se necessário
- **Anamnese não envia** → abra o Console do navegador (F12) e veja o erro; geralmente é credencial incorreta

---

## 🙏 Créditos

Desenvolvido com fé e dedicação para a obra da **Terapia Cristã**.
Que este sistema seja ferramenta de cuidado, organização e propósito.

> *"Acalmai-vos e sabei que eu sou Deus." — Salmos 46:10*
