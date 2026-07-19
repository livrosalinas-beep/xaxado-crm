-- Tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  monthly_goal NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilita RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Politicas
CREATE POLICY "Enable all actions for authenticated users" ON public.settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
  
-- Insere o registro único de configurações (se não existir)
INSERT INTO public.settings (monthly_goal) VALUES (50000)
ON CONFLICT DO NOTHING;
