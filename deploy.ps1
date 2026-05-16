# 🚀 Script de Deploy Automático - Terapia Cristã (Windows PowerShell)
# Para usar: Abra PowerShell nesta pasta e execute: .\deploy.ps1

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🚀 TERAPIA CRISTÃ - Deploy Automático v2.0             ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git está instalado
try {
    git --version | Out-Null
    Write-Host "✓ Git instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não está instalado. Instale em: https://git-scm.com" -ForegroundColor Red
    exit 1
}

# Verificar se Node.js está instalado
try {
    npm --version | Out-Null
    Write-Host "✓ Node.js/npm instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não está instalado. Instale em: https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Passo 1: Instalar dependências
Write-Host "📦 Passo 1: Instalando dependências npm..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependências instaladas" -ForegroundColor Green
Write-Host ""

# Passo 2: Inicializar Git
if (-not (Test-Path ".git")) {
    Write-Host "📝 Passo 2: Inicializando repositório Git..." -ForegroundColor Cyan
    
    $github_user = Read-Host "Digite seu usuário GitHub"
    $repo_name = Read-Host "Digite o nome do repositório (ex: terapia-crista)"
    
    git init
    git add .
    git commit -m "Initial commit - Terapia Cristã v2.0"
    git branch -M main
    git remote add origin "https://github.com/$github_user/$repo_name.git"
    
    Write-Host "✓ Git configurado" -ForegroundColor Green
} else {
    Write-Host "📝 Passo 2: Git já está inicializado, pulando..." -ForegroundColor Cyan
}
Write-Host ""

# Passo 3: Git Push
Write-Host "🔄 Passo 3: Fazendo push para GitHub..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git add .
git commit -m "Deploy Terapia Cristã - $timestamp" -ErrorAction SilentlyContinue
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Push para GitHub concluído" -ForegroundColor Green
} else {
    Write-Host "⚠️  Push para GitHub falhou. Tente manualmente:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main"
}
Write-Host ""

# Passo 4: Instalar Netlify CLI
Write-Host "🌐 Passo 4: Verificando Netlify CLI..." -ForegroundColor Cyan
$netlify_check = npm list -g netlify-cli 2>$null
if ($netlify_check -like "*not installed*" -or $LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Netlify CLI não está instalado. Instalando..." -ForegroundColor Yellow
    npm install -g netlify-cli
}
Write-Host "✓ Netlify CLI pronto" -ForegroundColor Green
Write-Host ""

# Passo 5: Deploy
Write-Host "🚀 Passo 5: Fazendo deploy no Netlify..." -ForegroundColor Cyan
Write-Host "ℹ️  Você será redirecionado para fazer login no Netlify" -ForegroundColor Yellow
Write-Host ""

netlify deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║   ✅ DEPLOY CONCLUÍDO COM SUCESSO!                        ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximas ações:" -ForegroundColor Green
    Write-Host "1. ✅ Seu site está no ar no Netlify!"
    Write-Host "2. ⚠️  IMPORTANTE: Altere a senha admin no Supabase"
    Write-Host "3. 📋 Leia SECURITY.md para configurações de produção"
    Write-Host "4. 🧪 Teste todas as funcionalidades"
    Write-Host ""
    Write-Host "URLs úteis:" -ForegroundColor Cyan
    Write-Host "• Supabase: https://supabase.com"
    Write-Host "• GitHub: https://github.com/$github_user/$repo_name"
    Write-Host "• Netlify: https://app.netlify.com"
} else {
    Write-Host "❌ Erro no deploy do Netlify" -ForegroundColor Red
    Write-Host "ℹ️  Tente fazer deploy manualmente:" -ForegroundColor Yellow
    Write-Host "   netlify deploy --prod"
    exit 1
}
