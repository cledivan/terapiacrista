# ✅ CHECKLIST DE DEPLOY - Terapia Cristã

## 📋 Pré-Deploy

- [x] Schema Supabase criado com tabela `usuarios_admin`
- [x] Arquivo `config.js` com credenciais Supabase
- [x] Arquivo `supabase-client.js` implementado
- [x] HTML pages carregando scripts corretamente
- [x] `package.json` com dependências (@supabase/supabase-js)
- [x] `.gitignore` configurado
- [x] `netlify.toml` configurado
- [x] `DEPLOYMENT.md` criado com instruções completas
- [x] `QUICK_DEPLOY.md` criado com guia rápido

---

## 🔧 Durante Deploy

### Antes de fazer push para GitHub:
- [ ] Alterar senha admin no Supabase (SQL: UPDATE usuarios_admin SET senha = '...')
- [ ] Verificar que `config.js` tem as credenciais corretas
- [ ] Testar localmente: formulário envia dados?
- [ ] Testar localmente: login funciona?

### Deploy via GitHub + Netlify:
- [ ] Fazer `git push` para GitHub
- [ ] Conectar repositório no Netlify
- [ ] Configurar: Build = vazio, Publish = `.`
- [ ] Clicar em "Deploy site"

### Depois do Deploy:
- [ ] Acessar URL do Netlify
- [ ] Testar página inicial carrega
- [ ] Testar anamnese (enviar formulário)
- [ ] Testar login admin
- [ ] Verificar dados no Supabase

---

## 📝 Configurações Verificadas

### Supabase
- [x] Tabela `prontuarios` - Aceita anamneses públicas
- [x] Tabela `pacientes` - Dados dos pacientes
- [x] Tabela `sessoes` - Agendamentos
- [x] Tabela `convenios` - Convênios
- [x] Tabela `configuracoes` - Singleton com config da clínica
- [x] Tabela `mensagens_whatsapp` - Histórico de mensagens
- [x] Tabela `usuarios_admin` - Autenticação
- [x] RLS Policies - Públicos podem inserir, admin pode ler/escrever

### Código
- [x] index.html carrega supabase-client.js
- [x] anamnese/index.html carrega supabase-client.js
- [x] admin/* carregam supabase-client.js
- [x] Todos carregam config.js
- [x] Supabase SDK via CDN

### Netlify
- [x] netlify.toml existe e configurado
- [x] Redirecionamentos configurados para admin e anamnese
- [x] .netlify folder criada

---

## 🚀 Próximas Ações em Ordem:

1. **No Supabase SQL Editor:**
   ```sql
   -- 1. Aplicar schema completo
   -- Copie todo conteúdo de supabase/schema.sql
   
   -- 2. Mudar senha admin
   UPDATE public.usuarios_admin 
   SET senha = 'NOVA_SENHA_SEGURA'
   WHERE email = 'admin@terapiacrista.com';
   ```

2. **No Terminal (Git):**
   ```bash
   cd c:\Users\cledi\Downloads\terapia-crista-v2\terapia-crista
   git init
   git add .
   git commit -m "Deploy Terapia Cristã - Versão 1.0"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/terapia-crista.git
   git push -u origin main
   ```

3. **No Netlify Dashboard:**
   - Vá para app.netlify.com
   - Add new site → Import existing project
   - Conectar GitHub → selecionar terapia-crista
   - Deixar configurações padrão
   - Deploy site

4. **Teste completo:**
   - Homepage carrega?
   - Anamnese envia dados?
   - Login funciona?
   - Dados aparecem no Supabase?

---

## 📱 URLs Após Deploy

| Página | URL |
|--------|-----|
| Homepage | `https://seu-site.netlify.app/` |
| Anamnese | `https://seu-site.netlify.app/anamnese/` |
| Login | `https://seu-site.netlify.app/admin/login.html` |
| Dashboard | `https://seu-site.netlify.app/admin/dashboard.html` |
| Pacientes | `https://seu-site.netlify.app/admin/pacientes.html` |
| Agenda | `https://seu-site.netlify.app/admin/agenda.html` |
| Prontuários | `https://seu-site.netlify.app/admin/prontuarios.html` |

---

## ✨ Status Final

**Aplicação**: ✅ Pronta para Deploy  
**Banco de Dados**: ⏳ Aguardando aplicação do schema  
**Hosting**: ⏳ Aguardando deploy no Netlify  

---

**Última atualização**: 16 de Maio de 2026  
**Versão**: 1.0.0  
