# ⚖️ DOMMA Jurídico — Sistema de Controle Jurídico

Aplicação web completa para gestão de processos jurídicos da DOMMA Incorporações.

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + React 18 |
| Estilização | Tailwind CSS + CSS Variables (Dark Mode exato do original) |
| Banco de Dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Storage | Supabase Storage (documentos PDF) |
| Realtime | Supabase Realtime Channels (comentários) |
| Gráficos | Chart.js + react-chartjs-2 |
| Excel | xlsx (SheetJS) |
| Ícones | Lucide React |

## 🚀 Configuração do Ambiente

### 1. Clonar e instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 3. Configurar o Supabase

#### a) Executar a migration SQL

No Supabase Dashboard → **SQL Editor**, execute todo o conteúdo de:
```
supabase-migration.sql
```

Isso cria:
- Tabela `user_profiles` (perfis + cargo)
- Tabela `processos` (todos os campos do sistema)
- Tabela `comentarios` (histórico de notas)
- Tabela `audit_logs` (quem alterou o quê)
- Tabela `documentos_anexos` (metadados dos arquivos)
- Políticas RLS para controle de acesso por cargo
- Trigger para criar perfil automaticamente no signup
- Índices para performance

#### b) Criar bucket de Storage

No Supabase Dashboard → **Storage** → New Bucket:
- Nome: `documentos-processos`
- Tipo: **Private** (acesso apenas autenticado)

#### c) Habilitar Realtime

No Supabase Dashboard → **Database** → **Replication**:
- Ativar para tabela `comentarios`
- Ativar para tabela `processos`

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 👥 Criando o Primeiro Usuário (TI)

1. Acesse a tela de login
2. Faça signup com o email do admin de TI  
   *(ou use o painel de Gerenciar Usuários após o primeiro login)*
3. No Supabase SQL Editor, execute:

```sql
UPDATE public.user_profiles
SET role = 'ti'
WHERE email = 'email-do-admin@domma.com.br';
```

4. Faça login — agora você tem acesso completo

## 🔐 Níveis de Acesso

| Cargo | Acesso |
|-------|--------|
| `ti` | Total: gerencia usuários, pode deletar processos |
| `diretoria` | Pode deletar processos, visualiza tudo |
| `juridico` | Cria, edita e comenta processos |
| `advogada_terceirizada` | Cria, edita e comenta processos |

## 📊 Funcionalidades

### Dashboard
- Estatísticas em tempo real (total, andamento, vitórias, condenações)
- Gráfico de donut: distribuição por status
- Gráfico de barras: processos por área
- Tabela de empreendimentos com totais e valores

### Áreas de Processos (Trabalhista, Civil, Controles, Registro)
- Listagem paginada (15 por página)
- Busca em tempo real por texto livre
- Filtros por status, prioridade e empreendimento
- Ordenação em todas as colunas
- **Novo/Editar Processo**: formulário completo com:
  - Aba Dados: todos os campos do sistema original
  - Aba Documentos: checklist por área + upload real de PDFs
  - Aba Auditoria: histórico de alterações com usuário e timestamp
  - Painel lateral de Comentários com Realtime
- **Importação Excel**: compatível com planilhas existentes da DOMMA
- **Exportação Excel**: download da tabela atual formatada

### Cronologia de Prazos
- Todas as audiências e prazos em ordem cronológica
- Alertas visuais: hoje (🔥), críticos (≤7 dias), vencidos
- Contadores no topo por categoria

### Gerenciar Usuários (apenas TI)
- Criar novos usuários com email, senha e cargo
- Editar nome e cargo de usuários existentes
- Visualização com badges coloridos por cargo

## 🆕 Funcionalidades Novas (vs. HTML original)

| Feature | Descrição |
|---------|-----------|
| **Upload Real de PDF** | Supabase Storage — anexar e baixar documentos no processo |
| **Audit Trail** | Log automático de toda alteração: quem, quando, o quê |
| **Realtime** | Comentários aparecem em tempo real para todos os usuários |
| **Paginação** | Listas grandes agora paginadas com 15 itens/página |
| **Busca Global** | Busca por texto livre em qualquer campo do processo |
| **Ordenação** | Clique em qualquer coluna para ordenar asc/desc |

## 🚀 Deploy (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Adicione as variáveis de ambiente no painel da Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz com fonts e globals
│   ├── page.tsx            # Página principal (router de tabs)
│   └── globals.css         # Estilos globais + variáveis CSS
├── components/
│   ├── auth/
│   │   └── LoginScreen.tsx     # Tela de login
│   ├── layout/
│   │   └── Header.tsx          # Header + navegação por tabs
│   ├── dashboard/
│   │   ├── Dashboard.tsx       # Gráficos + estatísticas + tabela empreendimentos
│   │   ├── PrazosTab.tsx       # Cronologia de prazos
│   │   └── UsuariosTab.tsx     # Gerenciar usuários (TI)
│   └── processos/
│       ├── ProcessosTable.tsx  # Tabela filtrada/paginada por área
│       └── ProcessoModal.tsx   # Modal de criação/edição completo
├── hooks/
│   ├── useAuth.tsx         # Context de autenticação
│   └── useProcessos.ts     # CRUD + Realtime de processos
├── lib/
│   ├── supabase.ts         # Client Supabase
│   └── utils.ts            # Helpers: formatMoney, formatDate, etc.
└── types/
    └── index.ts            # Tipos TypeScript + constantes
```
