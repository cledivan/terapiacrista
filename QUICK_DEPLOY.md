# 🚀 GUIA RÁPIDO - Deploy Terapia Cristã

## ✨ O que foi feito:

✅ Schema Supabase completo (com tabela `usuarios_admin`)  
✅ Autenticação configurada  
✅ Dependências npm instaladas  
✅ Arquivos JS carregando corretamente  
✅ Configuração Netlify pronta  

---

## 🎯 PRÓXIMAS AÇÕES (Em Ordem):

### 1️⃣ **APLICAR SCHEMA NO SUPABASE** (IMPORTANTE!)

**Acesse Supabase SQL Editor:**
- Vá para: https://supabase.com → seu projeto
- Clique em **SQL Editor**
- Clique em **New Query**
- Copie TODO conteúdo de `supabase/schema.sql` deste projeto
- Cole no editor
- Clique em **Execute** (Ctrl+Enter)
- Aguarde completar

✅ **Resultado esperado**: Nenhum erro, e você verá as tabelas criadas

---

### 2️⃣ **ALTERAR SENHA ADMIN**

**Execute este SQL no Supabase:**
```sql
UPDATE public.usuarios_admin 
SET senha = 'SUA_SENHA_FORTE_AQUI'
WHERE email = 'admin@terapiacrista.com';
```

⚠️ Substitua `SUA_SENHA_FORTE_AQUI` por uma senha segura!

---

### 3️⃣ **FAZER PUSH PARA GITHUB**

```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Deploy Terapia Cristã - v1.0"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/terapia-crista.git
git push -u origin main
```

---

### 4️⃣ **DEPLOY NO NETLIFY**

**Opção A - Via Netlify Dashboard (Mais fácil):**
1. Acesse https://app.netlify.com
2. Clique em **Add new site** → **Import an existing project**
3. Escolha **GitHub**
4. Autorize e selecione `terapia-crista`
5. Configure:
   - **Build command**: (deixar em branco)
   - **Publish directory**: `.`
6. Clique em **Deploy site**

**Opção B - Via CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

### 5️⃣ **TESTAR**

Após deployment:

1. **Página inicial:**
   - Acesse `https://seu-site.netlify.app`
   - Deve carregar sem erros

2. **Formulário de anamnese:**
   - Clique em "Preencher Anamnese"
   - Preencha e envie
   - Verifique no Supabase se apareceu na tabela `prontuarios`

3. **Login admin:**
   - Acesse `/admin/login.html`
   - Use: `admin@terapiacrista.com` + senha que você definiu
   - Deve entrar no dashboard

---

## 📊 Estrutura do Projeto

```
terapia-crista/
├── index.html                 # Homepage
├── anamnese/
│   └── index.html            # Formulário de anamnese
├── admin/
│   ├── login.html            # Login
│   ├── dashboard.html        # Dashboard
│   ├── pacientes.html        # Gestão de pacientes
│   ├── agenda.html           # Agenda
│   ├── prontuarios.html      # Anamneses recebidas
│   ├── whatsapp.html         # Enviar mensagens
│   ├── convenios.html        # Convênios
│   └── configuracoes.html    # Configurações
├── assets/
│   ├── js/
│   │   ├── config.js         # Configurações Supabase
│   │   ├── supabase-client.js # Cliente Supabase
│   │   ├── ui.js             # Componentes UI
│   │   └── main.js           # Lógica principal
│   └── css/
│       └── style.css         # Estilos
├── supabase/
│   └── schema.sql            # Schema do banco
└── netlify.toml              # Configuração Netlify
```

---

## 🔐 Credenciais Importantes

| Item | Valor |
|------|-------|
| **Supabase URL** | `https://scymeuswlwhwosdpkawd.supabase.co` |
| **Supabase Key** | `sb_publishable_xsmK7QU_43UmwjUlVxQD_g_TykAl6e9` |
| **Admin Email** | `admin@terapiacrista.com` |
| **Admin Senha** | (a que você definir) |

---

## 🐛 Se der erro:

### "Erro de conexão com Supabase"
- ✓ Verifique se o schema foi aplicado
- ✓ Confirme as credenciais em `config.js`
- ✓ Abra DevTools (F12) → Console para mais detalhes

### "Usuário/senha incorretos"
- ✓ Verifique a senha no SQL
- ✓ Confirme `ativo = true` na tabela

### "Formulário não envia"
- ✓ F12 → Console para ver erros específicos
- ✓ Verifique RLS policies no Supabase

---

## 📞 Links Úteis

- 🔗 Supabase: https://supabase.com
- 🔗 Netlify: https://netlify.com
- 🔗 Documentação: https://supabase.com/docs

---

**🎉 Tudo pronto! Siga os 5 passos e seu site estará no ar!**
