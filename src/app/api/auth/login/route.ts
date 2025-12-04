import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword, generateToken } from '@/lib/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validazione
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono obbligatori' },
        { status: 400 }
      );
    }

    // Trova utente
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, referral_code, wallet_address, is_admin')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Email o password non corretti' },
        { status: 401 }
      );
    }

    // Verifica password
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email o password non corretti' },
        { status: 401 }
      );
    }

    // Genera JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      referralCode: user.referral_code,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        referralCode: user.referral_code,
        walletAddress: user.wallet_address,
        isAdmin: user.is_admin || false,
      },
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Errore del server' },
      { status: 500 }
    );
  }
}
