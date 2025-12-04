// src/lib/db.ts
// Connessione database Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client con service role per operazioni admin
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Query helper
export async function query(sql: string, params?: any[]) {
  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    query: sql,
    params: params || []
  });

  if (error) throw error;
  return data;
}

export default supabaseAdmin;
