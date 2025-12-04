import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/auth-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verifica token JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No authorization token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user's token purchases
    const { data: purchases, error: purchasesError } = await supabase
      .from('token_purchases')
      .select('*')
      .eq('user_id', payload.id)
      .order('created_at', { ascending: false });

    if (purchasesError) throw purchasesError;

    // Calculate totals from purchases
    const totalPurchased = purchases?.reduce((sum, p) => sum + (p.total_cost || 0), 0) || 0;
    const totalTokens = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const currentPrice = 0.12; // Current market price
    const currentValue = totalTokens * currentPrice;
    const profitLoss = currentValue - totalPurchased;
    const profitLossPercent = totalPurchased > 0 ? ((profitLoss / totalPurchased) * 100) : 0;

    // Fetch user's referrals (as referrer)
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        *,
        referred_user:users!referrals_referred_id_fkey(
          id,
          email,
          created_at
        )
      `)
      .eq('referrer_id', payload.id)
      .order('created_at', { ascending: false });

    if (referralsError) throw referralsError;

    const totalReferrals = referrals?.length || 0;
    const totalCommission = referrals?.reduce((sum, r) => sum + (r.commission_earned || 0), 0) || 0;

    // Fetch affiliate clicks for user's referral code
    const { count: clicksCount, error: clicksError } = await supabase
      .from('affiliate_clicks')
      .select('*', { count: 'only', head: true })
      .eq('referral_code', user.referral_code);

    if (clicksError) throw clicksError;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          walletAddress: user.wallet_address,
          referralCode: user.referral_code,
          kycVerified: user.kyc_verified,
          isAdmin: user.is_admin,
          joinedAt: user.created_at,
        },
        balance: {
          tokenBalance: totalTokens,
          totalPurchased: totalPurchased,
          currentValue: currentValue,
          profitLoss: profitLoss,
          profitLossPercent: profitLossPercent,
        },
        referrals: {
          totalReferrals: totalReferrals,
          totalCommission: totalCommission,
          affiliateClicks: clicksCount || 0,
          referralList: referrals?.map(r => ({
            id: r.id,
            email: r.referred_user?.email || 'N/A',
            joinedAt: r.referred_user?.created_at || r.created_at,
            commission: r.commission_earned,
            purchaseAmount: r.purchase_amount,
          })) || []
        },
        transactions: purchases?.map(p => ({
          id: p.id,
          type: 'purchase',
          amount: p.amount,
          price: p.price_per_token,
          total: p.total_cost,
          status: p.status,
          txHash: p.tx_hash,
          date: p.created_at,
        })) || []
      }
    });
  } catch (error: any) {
    console.error('Dashboard data API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
