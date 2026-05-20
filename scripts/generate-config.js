const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'js', 'config.js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://scymeuswlwhwosdpkawd.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_xsmK7QU_43UmwjUlVxQD_g_TykAl6e9';

const content = `/* ============================================================
   TERAPIA CRISTÃ — Configuração Global
   ============================================================ */

window.TC_CONFIG = {
  // ---- SUPABASE ----
  SUPABASE_URL: ${JSON.stringify(supabaseUrl)},
  SUPABASE_ANON_KEY: ${JSON.stringify(supabaseAnonKey)},

  // ---- INFORMAÇÕES DA CLÍNICA ----
  clinica: {
    nome: 'Terapia Cristã',
    terapeuta: 'Clayton de Paula',
    whatsapp: '5512996184359',
    whatsappDisplay: '(12) 99618-4359',
    email: 'contato@terapiacrista.com',
    instagram: '@terapiacrista',
    cidade: 'São José dos Campos - SP'
  },

  // ---- FLAGS ----
  modoOffline: false,
  debug: false
};

(function() {
  const c = window.TC_CONFIG;
  if (c.SUPABASE_URL.includes('SEU-PROJETO') || c.SUPABASE_ANON_KEY.includes('SUA-ANON-KEY')) {
    console.warn('⚠️ TC_CONFIG: Credenciais padrão detectadas. Verifique assets/js/config.js');
  }
})();
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Generated config file at ${filePath}`);
