-- =====================================================
-- TERAPIA CRISTÃ — Schema Supabase
-- Execute este SQL no SQL Editor do Supabase
-- =====================================================

-- Extensões úteis
create extension if not exists "pgcrypto";

-- =====================================================
-- TABELA: prontuarios (anamneses enviadas pelo site)
-- =====================================================
create table if not exists public.prontuarios (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  nome text not null,
  email text,
  telefone text,
  cpf text,
  data_nascimento date,
  origem text,
  status text not null default 'novo', -- novo | em_atendimento | concluido | arquivado
  dados jsonb not null default '{}'::jsonb
);
create index if not exists idx_prontuarios_status on public.prontuarios(status);
create index if not exists idx_prontuarios_criado on public.prontuarios(criado_em desc);

-- =====================================================
-- TABELA: pacientes
-- =====================================================
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  prontuario_id uuid references public.prontuarios(id) on delete set null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  nome text not null,
  email text,
  telefone text,
  cpf text,
  data_nascimento date,
  endereco text,
  origem text,
  status text not null default 'ativo', -- ativo | inativo | alta
  observacoes text,
  anamnese jsonb default '{}'::jsonb
);
create index if not exists idx_pacientes_nome on public.pacientes(nome);
create index if not exists idx_pacientes_status on public.pacientes(status);

-- =====================================================
-- TABELA: sessoes (agenda)
-- =====================================================
create table if not exists public.sessoes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references public.pacientes(id) on delete cascade,
  criado_em timestamptz not null default now(),
  data date not null,
  hora time not null,
  duracao_min int not null default 50,
  modalidade text default 'presencial', -- presencial | online
  tipo text default 'individual',       -- individual | casal | familia | grupo
  status text default 'agendado',       -- agendado | realizado | cancelado | faltou
  valor numeric(10,2),
  pago boolean default false,
  notas text
);
create index if not exists idx_sessoes_data on public.sessoes(data, hora);
create index if not exists idx_sessoes_paciente on public.sessoes(paciente_id);

-- =====================================================
-- TABELA: convenios / parceiros
-- =====================================================
create table if not exists public.convenios (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  nome text not null,
  tipo text default 'empresa', -- empresa | igreja | escola | hospital | convenio
  contato_nome text,
  contato_telefone text,
  contato_email text,
  cnpj text,
  endereco text,
  desconto_percent numeric(5,2) default 0,
  ativo boolean default true,
  observacoes text
);

-- =====================================================
-- TABELA: configuracoes (singleton)
-- =====================================================
create table if not exists public.configuracoes (
  id int primary key default 1,
  clinica_nome text default 'Terapia Cristã',
  terapeuta_nome text default 'Clayton de Paula',
  whatsapp text default '5512996184359',
  email text default 'contato@terapiacrista.com',
  endereco text,
  horario_funcionamento text default 'Seg-Sex 8h-20h | Sáb 8h-12h',
  valor_sessao numeric(10,2) default 150,
  duracao_sessao_min int default 50,
  mensagem_boas_vindas text default 'Olá! Sou da Terapia Cristã. Como posso te ajudar?',
  mensagem_pos_anamnese text default 'Olá {NOME}! Recebemos sua anamnese 🙏 Em breve entraremos em contato para agendar sua primeira sessão.',
  mensagem_lembrete text default 'Olá {NOME}, lembrete da sua sessão amanhã às {HORA}. Confirma presença?',
  atualizado_em timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into public.configuracoes (id) values (1) on conflict (id) do nothing;

-- =====================================================
-- TABELA: usuarios_admin (autenticação)
-- =====================================================
create table if not exists public.usuarios_admin (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  senha text not null,
  nome text not null,
  ativo boolean default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists idx_usuarios_admin_email on public.usuarios_admin(email);

-- Inserir usuário admin padrão (MUDE A SENHA!)
insert into public.usuarios_admin (email, senha, nome, ativo) 
values ('admin@terapiacrista.com', 'admin123', 'Administrador', true)
on conflict (email) do nothing;

-- =====================================================
-- TABELA: mensagens_whatsapp (registro)
-- =====================================================
create table if not exists public.mensagens_whatsapp (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  paciente_id uuid references public.pacientes(id) on delete set null,
  destinatario text not null,
  mensagem text not null,
  tipo text default 'manual', -- manual | boas_vindas | lembrete | pos_anamnese
  status text default 'enviado'
);

-- =====================================================
-- TRIGGER: atualizar atualizado_em
-- =====================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists trg_prontuarios_touch on public.prontuarios;
create trigger trg_prontuarios_touch before update on public.prontuarios
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_pacientes_touch on public.pacientes;
create trigger trg_pacientes_touch before update on public.pacientes
  for each row execute function public.touch_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Habilita RLS em todas as tabelas
alter table public.usuarios_admin enable row level security;
alter table public.prontuarios enable row level security;
alter table public.pacientes enable row level security;
alter table public.sessoes enable row level security;
alter table public.convenios enable row level security;
alter table public.configuracoes enable row level security;
alter table public.mensagens_whatsapp enable row level security;

-- POLICIES:
-- 0) Usuários Admin: somente autenticado (admin)
drop policy if exists "auth_all_usuarios_admin" on public.usuarios_admin;
create policy "auth_all_usuarios_admin" on public.usuarios_admin for all to authenticated using (true) with check (true);

-- 1) Qualquer pessoa (anon) pode INSERIR prontuários (anamnese pública)
drop policy if exists "anon_insert_prontuarios" on public.prontuarios;
create policy "anon_insert_prontuarios"
  on public.prontuarios for insert
  to anon, authenticated
  with check (true);

-- 2) Apenas usuários autenticados (admin) podem ler/atualizar/deletar prontuários
drop policy if exists "auth_read_prontuarios" on public.prontuarios;
create policy "auth_read_prontuarios"
  on public.prontuarios for select
  to authenticated
  using (true);

drop policy if exists "auth_update_prontuarios" on public.prontuarios;
create policy "auth_update_prontuarios"
  on public.prontuarios for update
  to authenticated
  using (true);

drop policy if exists "auth_delete_prontuarios" on public.prontuarios;
create policy "auth_delete_prontuarios"
  on public.prontuarios for delete
  to authenticated
  using (true);

-- 3) Pacientes, Sessões, Convênios, Mensagens: somente autenticado (admin)
do $$
declare t text;
begin
  for t in select unnest(array['pacientes','sessoes','convenios','mensagens_whatsapp']) loop
    execute format('drop policy if exists "auth_all_%I" on public.%I;', t, t);
    execute format('create policy "auth_all_%I" on public.%I for all to authenticated using (true) with check (true);', t, t);
  end loop;
end$$;

-- 4) Configurações: leitura pública (para mostrar WhatsApp etc. no site), escrita só admin
drop policy if exists "public_read_config" on public.configuracoes;
create policy "public_read_config"
  on public.configuracoes for select
  to anon, authenticated
  using (true);

drop policy if exists "auth_update_config" on public.configuracoes;
create policy "auth_update_config"
  on public.configuracoes for update
  to authenticated
  using (true)
  with check (true);

-- =====================================================
-- REALTIME (opcional — habilite no painel se desejar)
-- alter publication supabase_realtime add table public.prontuarios;
-- alter publication supabase_realtime add table public.sessoes;
-- =====================================================

-- =====================================================
-- USUÁRIO ADMIN
-- O admin é criado via Auth do Supabase
-- 1) No painel: Authentication → Users → Add user
-- 2) Email: admin@terapiacrista.com  Senha: (escolha)
-- 3) Marque "Auto Confirm User"
-- =====================================================
