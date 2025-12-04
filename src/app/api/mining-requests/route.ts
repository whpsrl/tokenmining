import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, wallet, message } = body;

    // Validazione
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome ed email sono obbligatori' },
        { status: 400 }
      );
    }

    // Inserisci richiesta nel database
    const { data, error } = await supabase
      .from('mining_requests')
      .insert([
        {
          name,
          email,
          wallet_address: wallet || null,
          message: message || null,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Errore durante il salvataggio' },
        { status: 500 }
      );
    }

    // TODO: Invia email di conferma (opzionale)
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore del server' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('mining_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Errore del server' },
      { status: 500 }
    );
  }
}
