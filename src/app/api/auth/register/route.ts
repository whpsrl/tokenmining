import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  hashPassword,
  generateToken,
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from '@/lib/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, referredBy } = body;

    // Validazione
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e password sono obbligatori' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password deve essere minimo 8 caratteri e contenere almeno 1 numero' },
        { status: 400 }
      );
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Numero di telefono non valido' },
        { status: 400 }
      );
    }

    // Verifica se email già esiste
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email già registrata' },
        { status: 400 }
      );
    }

    // Verifica referral code (se fornito)
    let referrerId = null;
    if (referredBy) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referredBy.toUpperCase())
        .single();

      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Crea utente (referral_code generato automaticamente dal trigger)
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          referred_by: referrerId,
        },
      ])
      .select('id, email, referral_code, is_admin')
      .single();

    if (createError || !newUser) {
      console.error('Create user error:', createError);
      return NextResponse.json(
        { error: 'Errore durante la registrazione' },
        { status: 500 }
      );
    }

    // Se c'è un referrer, crea record referral
    if (referrerId) {
      await supabase.from('referrals').insert([
        {
          referrer_id: referrerId,
          referred_id: newUser.id,
        },
      ]);
    }

    // Genera JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      referralCode: newUser.referral_code,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name,
        referralCode: newUser.referral_code,
        isAdmin: newUser.is_admin || false,
      },
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Errore del server' },
      { status: 500 }
    );
  }
}
