import { createClient } from '@supabase/supabase-js';

// Tenta ler as variáveis de ambiente (Vercel ou .env)
// O uso do operador ?. evita o erro se import.meta.env for undefined no navegador
// Fix: Cast import.meta to any to bypass TypeScript error about missing env property
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Só cria o cliente se as chaves existirem
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;