import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/auth-utils';

// Force dynamic rendering per questa route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Token non valido' },
        { status: 401 }
      );
    }

    // Ottieni dati utente aggiornati
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, referral_code, wallet_address, is_admin, created_at')
      .eq('id', payload.id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Ottieni stats referral
    const { count: referralCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id);

    const { data: commissionData } = await supabase
      .from('referrals')
      .select('commission_earned')
      .eq('referrer_id', user.id);

    const totalCommission = commissionData?.reduce(
      (sum, ref) => sum + (Number(ref.commission_earned) || 0),
      0
    ) || 0;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        referralCode: user.referral_code,
        walletAddress: user.wallet_address,
        isAdmin: user.is_admin || false,
        totalReferrals: referralCount || 0,
        totalCommission,
        joinedAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json(
      { error: 'Errore del server' },
      { status: 500 }
    );
  }
}
