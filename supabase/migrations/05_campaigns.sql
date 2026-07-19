-- Cria a tabela de Campanhas
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  budget NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Ativa',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adiciona a referência na tabela deals (Funil)
-- Usamos DROP COLUMN IF EXISTS para ser seguro em caso de reexecução
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL;

-- Habilita RLS (Row Level Security) para segurança (padrão em projetos Supabase Next.js)
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Politicas de acesso para a tabela de campanhas
-- Como é um app MVP sem login complexo de times, deixamos as politicas abertas para usuarios autenticados
CREATE POLICY "Enable all actions for authenticated users" ON public.campaigns
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
  
-- Insere alguns dados de exemplo
INSERT INTO public.campaigns (name, budget, status) VALUES
  ('Facebook Ads - Escolas Particulares', 500, 'Ativa'),
  ('Panfletagem Bairro', 150, 'Ativa'),
  ('Indicações Diretas', 0, 'Ativa')
ON CONFLICT DO NOTHING;
