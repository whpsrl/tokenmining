// src/app/api/referral/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Verifica auth (opzionale per settings pubbliche)
    const authHeader = request.headers.get('authorization');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Get settings
    const { data: settings, error } = await supabase
      .from('referral_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Settings error:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    return NextResponse.json({ 
      settings: settings || {
        level1_commission: 10,
        level2_commission: 5,
        level3_commission: 2.5,
        program_active: true,
        structure_bonus_threshold: 50,
        structure_bonus_amount: 500
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
