#!/bin/bash
# 🚀 Script de Deploy Automático - Terapia Cristã

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🚀 TERAPIA CRISTÃ - Deploy Automático v2.0             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não está instalado. Instale primeiro: https://git-scm.com${NC}"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Node.js/npm não está instalado. Instale primeiro: https://nodejs.org${NC}"
    exit 1
fi

echo -e "${BLUE}ℹ️  Verificações iniciais:${NC}"
echo "✓ Git instalado"
echo "✓ Node.js/npm instalado"
echo ""

# Passo 1: Instalar dependências
echo -e "${BLUE}📦 Passo 1: Instalando dependências npm...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependências instaladas${NC}"
echo ""

# Passo 2: Inicializar Git (se ainda não estiver)
if [ ! -d .git ]; then
    echo -e "${BLUE}📝 Passo 2: Inicializando repositório Git...${NC}"
    git init
    echo -e "${YELLOW}ℹ️  Digite seu usuário GitHub: ${NC}"
    read GITHUB_USER
    echo -e "${YELLOW}ℹ️  Digite o nome do repositório (ex: terapia-crista): ${NC}"
    read REPO_NAME
    
    git add .
    git commit -m "Initial commit - Terapia Cristã v2.0"
    git branch -M main
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    
    echo -e "${GREEN}✓ Git configurado${NC}"
else
    echo -e "${BLUE}📝 Passo 2: Git já está inicializado, pulando...${NC}"
fi
echo ""

# Passo 3: Fazer push para GitHub
echo -e "${BLUE}🔄 Passo 3: Fazendo push para GitHub...${NC}"
git add .
git commit -m "Deploy Terapia Cristã - $(date '+%Y-%m-%d %H:%M:%S')" || true
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Push para GitHub concluído${NC}"
else
    echo -e "${YELLOW}⚠️  Push para GitHub falhou. Tente manualmente:${NC}"
    echo "   git push -u origin main"
fi
echo ""

# Passo 4: Instalar Netlify CLI
echo -e "${BLUE}🌐 Passo 4: Verificando Netlify CLI...${NC}"
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI não está instalado. Instalando...${NC}"
    npm install -g netlify-cli
fi
echo -e "${GREEN}✓ Netlify CLI pronto${NC}"
echo ""

# Passo 5: Deploy com Netlify
echo -e "${BLUE}🚀 Passo 5: Fazendo deploy no Netlify...${NC}"
echo -e "${YELLOW}ℹ️  Você será redirecionado para fazer login no Netlify${NC}"
echo ""

netlify deploy --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗"
    echo "║   ✅ DEPLOY CONCLUÍDO COM SUCESSO!                        ║"
    echo -e "╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Próximas ações:${NC}"
    echo "1. ✅ Seu site está no ar no Netlify!"
    echo "2. ⚠️  IMPORTANTE: Altere a senha admin no Supabase"
    echo "3. 📋 Leia SECURITY.md para configurações de produção"
    echo "4. 🧪 Teste todas as funcionalidades"
    echo ""
    echo -e "${BLUE}URLs úteis:${NC}"
    echo "• Supabase: https://supabase.com"
    echo "• GitHub: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "• Netlify: https://app.netlify.com"
else
    echo -e "${RED}❌ Erro no deploy do Netlify${NC}"
    echo -e "${YELLOW}ℹ️  Tente fazer deploy manualmente:${NC}"
    echo "   netlify deploy --prod"
    exit 1
fi
