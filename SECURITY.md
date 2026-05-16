# 🔒 Segurança e Configuração para Produção

## ⚠️ Ações Críticas ANTES de ir para produção:

### 1. ALTERAR SENHA ADMIN
**Status**: ❌ OBRIGATÓRIO

A senha padrão é `admin123` e deve ser alterada **imediatamente**.

**No Supabase SQL Editor:**
```sql
UPDATE public.usuarios_admin 
SET senha = 'UmaSenhaForteComNumerosEsimbolo@123'
WHERE email = 'admin@terapiacrista.com';
```

---

### 2. PROTEGER AS CREDENCIAIS

⚠️ **AVISO**: As credenciais Supabase estão visíveis em `config.js`. 

Para produção segura:

**Opção A** (Recomendado): Usar Netlify Environment Variables
1. Vá em Netlify → Site settings → Build & Deploy → Environment
2. Adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Atualize `config.js`:
```javascript
window.TC_CONFIG = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://...',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_...',
  // ...
};
```

**Opção B** (Rápido): Deixar como está (a chave ANON_KEY é pública por natureza)
- As chaves são públicas mesmo em apps modernos
- Use Row Level Security (RLS) para proteger dados

---

### 3. REVISAR ROW LEVEL SECURITY (RLS)

Verifique que RLS policies estão corretas:

**Públicos podem fazer:**
- ✅ Inserir prontuários (anamneses)
- ❌ Ver/editar dados de outros usuários

**Admin autenticado pode fazer:**
- ✅ Ler todos os prontuários
- ✅ Editar pacientes
- ✅ Gerenciar agenda

**Verificar no Supabase:**
1. Vá para cada tabela
2. Clique em "RLS" policies
3. Confirme que estão configuradas

---

### 4. HABILITAR HTTPS (Automático no Netlify)

✅ Netlify fornece HTTPS automaticamente para domínios netlify.app
✅ Se usar domínio próprio, configure SSL no painel

---

### 5. FAZER BACKUP DO BANCO

**No Supabase Dashboard:**
1. Vá para Database → Backups
2. Habilite backups automáticos
3. Configure retenção (ex: 30 dias)

---

### 6. LIMPAR DADOS SENSÍVEIS

Verifique antes de fazer deploy:

```bash
# Procure por arquivos que não devem ir para Git:
grep -r "senha" *.html
grep -r "TODO" *.js
grep -r "FIXME" *.html
```

---

### 7. TESTAR SEGURANÇA

**Teste de Autenticação:**
- [ ] Tente acessar `/admin/` sem login → deve redirecionar
- [ ] Login funciona com credenciais corretas
- [ ] Logout limpa a sessão

**Teste de Dados:**
- [ ] Anônimo consegue enviar anamnese?
- [ ] Admin consegue ver prontuários?
- [ ] Um usuário vê dados de outro? (não deve!)

---

## 🛡️ Boas Práticas

### Senhas e Credenciais
- ✅ Use senhas fortes (mínimo 12 caracteres)
- ✅ Inclua números, letras e símbolos
- ✅ Não compartilhe em público
- ✅ Use ferramentas como 1Password para armazenar

### Backup e Desastre
- ✅ Faça backup automático no Supabase
- ✅ Teste recuperação de backups periodicamente
- ✅ Mantenha histórico de changes no GitHub

### Monitoramento
- ✅ Verifique logs de erro regularmente
- ✅ Configure alertas no Netlify para falhas de deploy
- ✅ Monitore tráfego no Supabase

### Updates
- ✅ Mantenha Supabase SDK atualizado
- ✅ Monitore security advisories
- ✅ Atualize npm packages regularmente

---

## 📧 Configurar Email (Futuro)

Se quiser enviar emails automáticos:

1. Use **SendGrid**, **Mailgun** ou **AWS SES**
2. Configure webhook no Netlify Functions
3. Envie emails quando:
   - Anamnese recebida
   - Lembrete de sessão
   - Confirmação de agendamento

---

## 📞 Suporte e Monitoramento

### Ferramentas Recomendadas
- **Supabase Dashboard** → Ver status do banco
- **Netlify Analytics** → Ver tráfego e performance
- **GitHub** → Histórico de changes
- **VS Code** → Manter código organizado

### Logs
- Netlify: Site settings → Logs
- Supabase: SQL Editor → Ver queries e erros
- Browser: F12 → Console para debugging

---

## ✨ Deploy Final

Quando tudo está seguro:

```bash
git add .
git commit -m "Production ready - Terapia Cristã v1.0"
git push origin main
# Netlify deploy automático!
```

---

## 📋 Checklist Final

- [ ] Senha admin alterada
- [ ] RLS policies revisadas
- [ ] HTTPS ativado (automático)
- [ ] Backup automático ativado
- [ ] Nenhuma senha no GitHub
- [ ] Todos os links testados
- [ ] Mobile responsivo testado
- [ ] Anamnese submete dados corretamente
- [ ] Admin consegue fazer login
- [ ] Dados aparecem no Supabase

**Após marcar todos os itens: SITE PRONTO PARA PRODUÇÃO! 🎉**

---

**Ultima atualização:** 16 de Maio de 2026  
**Status**: Pronto para deploy seguro
