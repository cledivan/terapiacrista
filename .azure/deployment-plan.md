# Plano de Implantação - Terapia Cristã (Netlify + Supabase)

Este documento descreve o plano para implantar o projeto **Terapia Cristã** utilizando Netlify para o frontend e Supabase para o backend.

## Status: Configurando Netlify

## 1. Análise do Projeto
- **Frontend:** Site Estático (HTML/JS/CSS)
- **Backend:** Supabase (Banco de Dados e Autenticação)
- **Plataforma de Deploy:** Netlify

## 2. Configuração do Netlify
- **Arquivo de Configuração:** `netlify.toml`
- **Diretório de Publicação:** Raiz (`.`)
- **Variáveis de Ambiente:**
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

## 3. Configuração do Supabase
- **Banco de Dados:** Tabelas `prontuarios`, `pacientes`, `sessoes` (conforme [schema.sql](file:///c:/Users/cledi/Downloads/terapia-crista-v2/terapia-crista/supabase/schema.sql)).
- **Autenticação:** Configurar provedores e URL de redirecionamento no painel do Supabase.

## 4. Fluxo de Trabalho
1. Criar `netlify.toml`.
2. Instalar Netlify CLI.
3. Fazer login no Netlify (`netlify login`).
4. Vincular o projeto e configurar variáveis de ambiente.
5. Executar o deploy (`netlify deploy --prod`).

## 5. Próximos Passos
- [x] Criar `netlify.toml`.
- [ ] Guia de login no Netlify.
- [ ] Configurar variáveis no painel do Netlify.
- [ ] Deploy final.
