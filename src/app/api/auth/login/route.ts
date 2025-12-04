import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, is_admin, referral_code')
      .eq('email', email)
      .eq('password_hash', passwordHash)
      .single();

    if (error || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email o password errati' 
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      referralCode: user.referral_code
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
