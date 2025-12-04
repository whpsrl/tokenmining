// src/app/api/referral/validate-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Codice referral mancante' 
      }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get referral settings
    const { data: settings, error: settingsError } = await supabase
      .from('referral_settings')
      .select('program_active, program_end_date')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (settingsError) {
      console.error('Settings error:', settingsError);
      return NextResponse.json({ 
        valid: false, 
        error: 'Errore nel recupero impostazioni' 
      }, { status: 500 });
    }

    // Check if program is active
    if (!settings?.program_active) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Programma referral non attivo' 
      });
    }

    // Check program end date
    if (settings.program_end_date) {
      const endDate = new Date(settings.program_end_date);
      if (endDate < new Date()) {
        return NextResponse.json({ 
          valid: false, 
          error: 'Programma referral terminato' 
        });
      }
    }

    // Validate referral code
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, referral_code')
      .eq('referral_code', code)
      .single();

    if (userError || !user) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Codice referral non valido' 
      });
    }

    return NextResponse.json({ 
      valid: true,
      referrer: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Validate code error:', error);
    return NextResponse.json({ 
      valid: false, 
      error: 'Errore interno del server' 
    }, { status: 500 });
  }
}
