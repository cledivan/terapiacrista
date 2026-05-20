# 🚀 Guia de Deployment - Terapia Cristã

## ✅ Pré-requisitos

- ✔️ Conta no Netlify (https://netlify.com)
- ✔️ Projeto Supabase criado (https://supabase.com)
- ✔️ Git instalado na máquina
- ✔️ Node.js instalado

---

## 📋 PASSO 1: Aplicar Schema no Supabase

1. Acesse [Supabase](https://supabase.com) e faça login na sua conta
2. Abra seu projeto: **scymeuswlwhwosdpkawd**
3. Vá para **SQL Editor** (no menu esquerdo)
4. Clique em **New Query** e copie todo conteúdo do arquivo `supabase/schema.sql`
5. Cole no editor do SQL
6. Clique em **Execute** (ou `Ctrl + Enter`)
7. Aguarde a execução completar

✅ **O schema agora está aplicado!**

---

## 🔐 PASSO 2: Alterar Senha Admin Padrão

⚠️ **IMPORTANTE**: A senha padrão é `admin123`. Você DEVE mudá-la!

1. No Supabase, vá para **SQL Editor**
2. Execute este comando:
```sql
UPDATE public.usuarios_admin 
SET senha = 'SENHA_NOVA_SEGURA'
WHERE email = 'admin@terapiacrista.com';
```
3. Substitua `SENHA_NOVA_SEGURA` por uma senha forte

---

## 📦 PASSO 3: Instalar Dependências Localmente

```bash
npm install
```

---

## 🔧 PASSO 4: Validar Configurações

Verifique que `assets/js/config.js` tem:
- ✅ `SUPABASE_URL` correto
- ✅ `SUPABASE_ANON_KEY` correto

Se precisar atualizar, edite o arquivo:
```javascript
window.TC_CONFIG = {
  SUPABASE_URL: 'https://scymeuswlwhwosdpkawd.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_xsmK7QU_43UmwjUlVxQD_g_TykAl6e9',
  // ... resto da config
};
```

---

## 🌐 PASSO 5: Deploy no Netlify

### Opção A: Via Netlify CLI

```bash
# 1. Instale Netlify CLI globalmente
npm install -g netlify-cli

# 2. Autentique com sua conta Netlify
netlify login

# 3. Deploy do projeto
netlify deploy --prod
```

### Opção B: Via GitHub (Recomendado para atualizações frequentes)

1. **Faça push do projeto para GitHub**:
```bash
git init
git add .
git commit -m "Initial commit - Terapia Cristã"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/terapia-crista.git
git push -u origin main
```

2. **Adicione os secrets no GitHub Actions**:
   - Vá em `Settings` → `Secrets and variables` → `Actions`
   - Crie estes secrets:
     - `SUPABASE_ACCESS_TOKEN`
     - `SUPABASE_PROJECT_REF`
     - `NETLIFY_AUTH_TOKEN`
     - `NETLIFY_SITE_ID`

3. **Conecte no Netlify** (uma vez apenas):
   - Acesse https://app.netlify.com
   - Clique em **Add new site → Import an existing project**
   - Selecione **GitHub** como provedor
   - Autorize e selecione o repositório `terapia-crista`
   - Configure:
     - **Build command**: (deixe em branco - não há build)
     - **Publish directory**: `.` (raiz do projeto)
   - Clique em **Deploy site**

4. **Aguarde o deployment completar** (~1-2 minutos)

5. **A cada novo push em `main`**:
   - O GitHub Actions vai atualizar o schema do Supabase
   - E também vai fazer deploy no Netlify automaticamente

> O workflow está em `.github/workflows/supabase-sync.yml`.

---

## ✨ PASSO 6: Testar a Aplicação

1. Acesse a URL gerada pelo Netlify (exemplo: `https://terapia-crista-12345.netlify.app`)
2. Verifique:
   - ✅ Página inicial carrega sem erros
   - ✅ Link `/admin/login.html` funciona
   - ✅ Tente fazer login com:
     - Email: `admin@terapiacrista.com`
     - Senha: (a que você definiu)

### Testar Formulário de Anamnese (Público)

1. Acesse a página inicial
2. Preencha o formulário de anamnese
3. Clique em "Enviar"
4. Verifique que os dados foram salvos no Supabase:
   - Vá para **Supabase → Table Editor**
   - Abra a tabela `prontuarios`
   - Confirme que seu registro aparece

---

## 📱 Recursos Adicionais

### Dashboard Admin
- URL: `https://seu-site.netlify.app/admin/dashboard.html`
- Acesso: Requer login

### Páginas Disponíveis
- 🏠 Início: `/`
- 📋 Anamnese: `/anamnese/`
- 🔐 Login Admin: `/admin/login.html`
- 📊 Dashboard: `/admin/dashboard.html`
- 👥 Pacientes: `/admin/pacientes.html`
- 📅 Agenda: `/admin/agenda.html`
- 📄 Prontuários: `/admin/prontuarios.html`
- 💬 WhatsApp: `/admin/whatsapp.html`
- 🏢 Convênios: `/admin/convenios.html`
- ⚙️ Configurações: `/admin/configuracoes.html`

---

## 🐛 Troubleshooting

### "Erro de conexão com Supabase"
- Verifique se `config.js` tem as credenciais corretas
- Confirme que o schema foi aplicado no Supabase
- Verifique se o projeto Supabase está ativo

### "Usuário ou senha inválidos"
- Verifique a senha no banco (SQL Editor)
- Confirme que o usuário está com `ativo = true`

### "Formulário não envia"
- Abra o DevTools (F12)
- Verifique o console para erros
- Confirme que RLS policies permitem inserts públicos

---

## 🔒 Segurança em Produção

- ✅ Use sempre HTTPS (Netlify fornece automaticamente)
- ✅ Altere a senha admin padrão
- ✅ Revise as RLS policies no Supabase
- ✅ Ative backups automáticos no Supabase
- ✅ Considere usar variáveis de ambiente para credenciais sensíveis

---

## 📞 Suporte

Para dúvidas:
- Documentação Supabase: https://supabase.com/docs
- Documentação Netlify: https://docs.netlify.com
- Comunidade: https://community.supabase.com

---

**Deploy completado com sucesso! 🎉**
