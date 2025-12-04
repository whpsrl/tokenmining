// src/lib/auth.ts
// Verifica autenticazione JWT

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header', user: null };
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { error: 'Invalid token', user: null };
    }

    return { error: null, user };
  } catch (error) {
    return { error: 'Authentication failed', user: null };
  }
}

export async function verifyAdmin(request: NextRequest) {
  const { error, user } = await verifyAuth(request);
  
  if (error || !user) {
    return { error: error || 'Unauthorized', user: null, isAdmin: false };
  }

  // Query per verificare se user è admin
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error: dbError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (dbError || !data?.is_admin) {
    return { error: 'Not an admin', user, isAdmin: false };
  }

  return { error: null, user, isAdmin: true };
}
