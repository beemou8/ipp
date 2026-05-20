import { createClient } from '@supabase/supabase-js';

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase server environment variables are not configured. Set SUPABASE_URL and a Supabase key.');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export function getSupabaseTableName() {
  return process.env.SUPABASE_TABLE_NAME ?? 'sertim';
}
