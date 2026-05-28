-- ==============================================
-- DOMMA JURÍDICO - Supabase Migration
-- Execute no SQL Editor do Supabase
-- ==============================================

-- 1. USER PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'juridico' CHECK (role IN ('ti', 'diretoria', 'juridico', 'advogada_terceirizada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-criar perfil ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'juridico'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PROCESSOS
CREATE TABLE IF NOT EXISTS public.processos (
  id BIGSERIAL PRIMARY KEY,
  area TEXT NOT NULL CHECK (area IN ('trabalhista', 'civil', 'controles', 'registro')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  empreendimento TEXT,
  autor TEXT,
  descricao TEXT,
  responsavel TEXT,
  prioridade TEXT DEFAULT 'Média' CHECK (prioridade IN ('Baixa', 'Média', 'Alta', 'Urgente')),
  status TEXT DEFAULT 'Em Andamento' CHECK (status IN ('Em Andamento', 'Arquivado', 'Vitória', 'Condenação')),
  processo TEXT,
  valor_envolvido NUMERIC(15,2) DEFAULT 0,
  desfecho TEXT,
  valor_desfecho NUMERIC(15,2) DEFAULT 0,
  data_inicio DATE,
  data_conclusao DATE,
  data_audiencia DATE,
  observacoes TEXT,
  tags TEXT,
  documentos TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMENTÁRIOS
CREATE TABLE IF NOT EXISTS public.comentarios (
  id BIGSERIAL PRIMARY KEY,
  processo_id BIGINT REFERENCES public.processos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  texto TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  processo_id BIGINT REFERENCES public.processos(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  campo TEXT NOT NULL,
  valor_anterior TEXT,
  valor_novo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DOCUMENTOS (Storage metadata)
CREATE TABLE IF NOT EXISTS public.documentos_anexos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  processo_id BIGINT REFERENCES public.processos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  tamanho BIGINT,
  tipo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_anexos ENABLE ROW LEVEL SECURITY;

-- USER PROFILES RLS
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "TI can update any profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'ti'
    )
  );

-- PROCESSOS RLS
CREATE POLICY "All authenticated can view processos" ON public.processos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated can insert processos" ON public.processos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated can update processos" ON public.processos
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Only ti/diretoria can delete processos" ON public.processos
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('ti', 'diretoria')
    )
  );

-- COMENTÁRIOS RLS
CREATE POLICY "All authenticated can view comentarios" ON public.comentarios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated can insert comentarios" ON public.comentarios
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only owner or ti can delete comentarios" ON public.comentarios
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'ti'
    )
  );

-- AUDIT LOGS RLS
CREATE POLICY "All authenticated can view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- DOCUMENTOS RLS
CREATE POLICY "All authenticated can view documentos" ON public.documentos_anexos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated can insert documentos" ON public.documentos_anexos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only owner or ti can delete documentos" ON public.documentos_anexos
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'ti'
    )
  );

-- ==============================================
-- STORAGE BUCKET (execute separadamente)
-- ==============================================
-- No Supabase Dashboard: Storage > New Bucket
-- Nome: documentos-processos
-- Private: true (acesso apenas autenticado)

-- ==============================================
-- REALTIME (execute separadamente)
-- ==============================================
-- No Supabase Dashboard: Database > Replication
-- Ativar para as tabelas: comentarios, processos

-- ==============================================
-- ÍNDICES para performance
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_processos_area ON public.processos(area);
CREATE INDEX IF NOT EXISTS idx_processos_empreendimento ON public.processos(empreendimento);
CREATE INDEX IF NOT EXISTS idx_processos_status ON public.processos(status);
CREATE INDEX IF NOT EXISTS idx_processos_data_audiencia ON public.processos(data_audiencia);
CREATE INDEX IF NOT EXISTS idx_comentarios_processo ON public.comentarios(processo_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_processo ON public.audit_logs(processo_id);
CREATE INDEX IF NOT EXISTS idx_documentos_processo ON public.documentos_anexos(processo_id);
