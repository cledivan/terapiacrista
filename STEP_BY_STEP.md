# 🎬 INSTRUÇÕES PASSO A PASSO COM IMAGENS

## 📌 Leia Primeiro: Qual Sistema Operacional?

### 🪟 Windows
1. Clique em [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
2. Ou execute PowerShell: `.\deploy.ps1`

### 🍎 Mac / 🐧 Linux
1. Clique em [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
2. Ou execute Bash: `bash deploy.sh`

---

## 🎯 COMEÇO RÁPIDO (Menos de 15 minutos)

### PASSO 1️⃣ : APLICAR SCHEMA NO SUPABASE

**O que é**: Criar as tabelas do banco de dados

**Como fazer:**
1. Abra https://supabase.com e faça login
2. Clique no projeto: `scymeuswlwhwosdpkawd`
3. No menu à esquerda, clique em **SQL Editor**
4. Clique em **+ New Query**
5. Abra o arquivo `supabase/schema.sql` **deste projeto**
   - Dica: Clique com mouse direito → "Open with" → Bloco de notas
   - Ou abra com VSCode (Ctrl+K Ctrl+O)
6. Selecione **TUDO** (Ctrl+A)
7. Copie (Ctrl+C)
8. Volta para Supabase, no editor SQL
9. Cole (Ctrl+V)
10. Clique em **▶ RUN** (ou Ctrl+Enter)

**Resultado esperado:**
- ✅ Sem erros em vermelho
- ✅ Mensagem "Success" aparece
- ✅ No Table Editor, você vê as tabelas criadas

---

### PASSO 2️⃣ : ALTERAR SENHA ADMIN

**Por que**: A senha padrão `admin123` é fraca

**Como fazer:**
1. No Supabase, vá para **SQL Editor**
2. Clique em **+ New Query** novamente
3. Cole este código, substituindo `SUA_SENHA_FORTE`:
```sql
UPDATE public.usuarios_admin 
SET senha = 'SUA_SENHA_FORTE_COM_NUMERO_E_SIMBOLO@123'
WHERE email = 'admin@terapiacrista.com';
```
4. Clique em **Run**

**Dica de senha forte:**
- ✅ Mínimo 8 caracteres
- ✅ Com letras, números e símbolos
- ✅ Exemplos: `Terapia@2024!Crista` ou `Clayton#Paz2024`

---

### PASSO 3️⃣ : FAZER PUSH PARA GITHUB

**O que é**: Enviar seu código para a nuvem

**Como fazer:**

**Opção A: Via Terminal (Recomendado)**
```bash
# Abra Terminal ou PowerShell nesta pasta
git init
git add .
git commit -m "Deploy Terapia Cristã v2.0"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/terapia-crista.git
git push -u origin main
```

**Substitua:**
- `SEU_USUARIO` → seu usuário do GitHub (ex: `clayton-paula`)

**Opção B: Via Script Automático (Windows)**
```powershell
# Execute este comando na pasta do projeto
.\deploy.ps1
```

**Opção C: Via Script Automático (Mac/Linux)**
```bash
bash deploy.sh
```

---

### PASSO 4️⃣ : DEPLOY NO NETLIFY

**O que é**: Colocar seu site no ar

**Como fazer:**

#### Opção A: Automática (Via CLI)
```bash
# Se você tem Netlify CLI instalado
netlify deploy --prod
```

#### Opção B: Manual (Via Dashboard) - MAIS FÁCIL
1. Vá para https://app.netlify.com
2. Faça login com GitHub (se não tem conta, crie)
3. Clique em **Add new site**
4. Selecione **Import an existing project**
5. Escolha **GitHub** como provedor
6. Autorize o Netlify acessar GitHub
7. Selecione seu repositório `terapia-crista`
8. Configure:
   - **Build command**: (deixar VAZIO)
   - **Publish directory**: `.` (apenas um ponto)
9. Clique em **Deploy site**

**Pronto!** Em ~2 minutos seu site estará no ar! 🎉

---

### PASSO 5️⃣ : TESTAR

**Testando a Homepage:**
1. Abra a URL fornecida pelo Netlify (ex: `https://terapia-crista-12345.netlify.app`)
2. Verifique:
   - ✅ Página carrega sem erros
   - ✅ Logo aparece
   - ✅ Menu funciona

**Testando Formulário Anamnese:**
1. Na homepage, clique em **Preencher Anamnese**
2. Preencha alguns campos
3. Clique em **Enviar**
4. Verifique no Supabase:
   - SQL Editor → `SELECT * FROM prontuarios;`
   - Ou Table Editor → Abra a tabela `prontuarios`
   - ✅ Seu registro deve aparecer!

**Testando Login Admin:**
1. Acesse `/admin/login.html` no seu site
   - Ex: `https://seu-site.netlify.app/admin/login.html`
2. Use:
   - Email: `admin@terapiacrista.com`
   - Senha: (a que você definiu no Passo 2)
3. Clique em **Login**
4. ✅ Deve entrar no dashboard

---

## ⚠️ SE DEU ERRO?

### "Erro ao fazer push para GitHub"
**Solução:**
1. Você tem conta no GitHub? (https://github.com/signup)
2. Você tem Git instalado? (`git --version` no terminal)
3. Já configurou Git localmente?
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```

### "Netlify não acha meu repositório"
**Solução:**
1. Confirme que você fez `git push` com sucesso
2. Refresque a página do Netlify (F5)
3. Tente novamente em Import an existing project

### "Formulário não envia / Login não funciona"
**Solução:**
1. Abra DevTools: Clique com botão direito → **Inspect** (ou F12)
2. Vá para a aba **Console**
3. Procure por mensagens em vermelho
4. Se ver erro de conexão Supabase:
   - Verifique `config.js` tem URL e KEY corretos
   - Confirme que o schema foi aplicado no Supabase

### "Não consigo alterar senha admin"
**Solução:**
1. No Supabase SQL Editor
2. Execute:
   ```sql
   SELECT * FROM public.usuarios_admin;
   ```
3. Confirme que vê a linha do admin
4. Se não vê, execute novamente o schema completo

---

## 🎓 Próximas Ações (Recomendadas)

Depois que seu site está no ar:

### 🔒 Segurança
- [ ] Leia [SECURITY.md](SECURITY.md) completamente
- [ ] Revise as RLS Policies no Supabase
- [ ] Considere usar domínio customizado

### 📊 Analytics
- [ ] Ative Netlify Analytics
- [ ] Monitore tráfego e performance

### 📧 Comunicação
- [ ] Configure email automático (SendGrid)
- [ ] Personalize mensagens WhatsApp

### 🧪 Testes
- [ ] Teste em diferentes navegadores
- [ ] Teste em diferentes dispositivos (mobile, tablet)
- [ ] Peça feedback para amigos

---

## 📱 URLs Após Deploy

| Página | URL |
|--------|-----|
| **Homepage** | `https://seu-site.netlify.app/` |
| **Anamnese** | `https://seu-site.netlify.app/anamnese/` |
| **Admin Login** | `https://seu-site.netlify.app/admin/login.html` |
| **Dashboard** | `https://seu-site.netlify.app/admin/dashboard.html` |
| **Pacientes** | `https://seu-site.netlify.app/admin/pacientes.html` |
| **Agenda** | `https://seu-site.netlify.app/admin/agenda.html` |

---

## 📞 Precisa de Ajuda?

| Tipo de Dúvida | Resposta |
|---|---|
| **Como comece?** | Você está no lugar certo! |
| **Não sei Git** | Veja o vídeo: https://www.youtube.com/watch?v=USjZcfj8yxE |
| **Não sei Supabase** | Documentação: https://supabase.com/docs |
| **Não sei Netlify** | Documentação: https://docs.netlify.com |
| **Dúvida específica** | Procure em [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting |

---

## ✅ Checklist Final

Quando você terminar os 5 passos:

- [ ] Schema aplicado no Supabase (sem erros)
- [ ] Senha admin alterada
- [ ] Código fez push para GitHub (com sucesso)
- [ ] Site no ar no Netlify (URL funciona)
- [ ] Homepage carrega sem erros
- [ ] Anamnese submete dados
- [ ] Login admin funciona
- [ ] Dados aparecem no Supabase

**Se todos os itens estão marcados: PARABÉNS! 🎉 Seu sistema está 100% funcional!**

---

## 🚀 Últimas Dicas

- ✅ Compartilhe a URL com seus pacientes
- ✅ Monitore constantemente se dados estão chegando
- ✅ Faça backups regulares (Supabase já faz automático)
- ✅ Atualize informações de contato regularmente

---

**Documento atualizado**: 16 de Maio de 2026  
**Versão**: 2.0  
**Status**: Pronto para Produção ✅

**BORA COLOCAR NO AR! 🎉🚀**
