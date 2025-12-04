import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, password, referralCode } = await req.json();

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const newReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    let parentId = null;
    if (referralCode) {
      const { data: parent } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', referralCode)
        .single();
      
      if (parent) parentId = parent.id;
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        referral_code: newReferralCode,
        referred_by: parentId
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email già registrata' 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Registrazione completata',
      referralCode: newReferralCode
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
