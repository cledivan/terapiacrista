# 🚀 SUPABASE DEPLOY - Instruções Finais

## ✅ STATUS ATUAL

- ✅ GitHub: Código enviado para https://github.com/cledivan/terapiacrista
- ⏳ Netlify: Deploy em progresso...
- ⏳ Supabase: Schema pronto para aplicar

---

## 📋 PRÓXIMOS PASSOS

### PASSO 1: Aplicar Schema no Supabase

1. Acesse: https://supabase.com
2. Faça login na sua conta
3. Clique no projeto: **scymeuswlwhwosdpkawd**
4. Menu esquerdo: **SQL Editor**
5. Clique em **+ New Query**
6. **Copie TODO o conteúdo** de `supabase/schema.sql` (arquivo neste projeto)
7. **Cole** no SQL Editor do Supabase
8. Clique em **▶ RUN** (ou Ctrl+Enter)
9. Aguarde completar (deve aparecer "Success")

---

### PASSO 2: Alterar Senha Admin

No SQL Editor do Supabase, execute:

```sql
UPDATE public.usuarios_admin 
SET senha = 'COLOQUE_UMA_SENHA_FORTE_AQUI'
WHERE email = 'admin@terapiacrista.com';
```

**Dica de senha**: Use algo como `Clayton@Paz2024!` (maiúsculas, números, símbolos)

---

### PASSO 3: Verificar Dados

Após aplicar o schema:

1. No Supabase, clique em **Table Editor**
2. Você deve ver as 8 tabelas:
   - ✅ usuarios_admin
   - ✅ prontuarios
   - ✅ pacientes
   - ✅ sessoes
   - ✅ convenios
   - ✅ configuracoes
   - ✅ mensagens_whatsapp
   - ✅ Triggers

---

## 🌐 URLs Após Deploys Completos

**GitHub:**
- https://github.com/cledivan/terapiacrista

**Netlify:**
- Será gerada uma URL tipo: `https://xxx.netlify.app`
- Você receberá a URL ao concluir o deploy

**Supabase:**
- https://scymeuswlwhwosdpkawd.supabase.co

---

## 📝 Credenciais

```
SUPABASE
├── URL: https://scymeuswlwhwosdpkawd.supabase.co
├── Chave Pública: sb_publishable_xsmK7QU_43UmwjUlVxQD_g_TykAl6e9
└── Admin: admin@terapiacrista.com / (sua senha)

GITHUB
└── https://github.com/cledivan/terapiacrista

NETLIFY
└── (URL será gerada após deploy)
```

---

## 🎯 Checklist Final

- [ ] Schema aplicado no Supabase (sem erros)
- [ ] Senha admin alterada
- [ ] GitHub recebeu o push
- [ ] Netlify deploy completo
- [ ] Site no ar em Netlify
- [ ] Homepage carrega
- [ ] Anamnese funciona
- [ ] Login admin funciona

---

**Quando todos os itens estão ✅: Seu sistema está 100% funcional!** 🎉
