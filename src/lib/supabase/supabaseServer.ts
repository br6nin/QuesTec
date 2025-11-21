// src/lib/supabase/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

// Importante: Usa a Service Role Key para garantir que o Webhook
// possa escrever no banco de dados, ignorando RLS (Row Level Security).
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // Use a URL pública aqui
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use a chave secreta
);