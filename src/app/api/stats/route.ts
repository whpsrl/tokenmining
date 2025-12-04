import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Count total users (registrati)
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Count total token purchases
    const { count: totalPurchases, error: purchasesError } = await supabase
      .from('token_purchases')
      .select('*', { count: 'exact', head: true });

    if (purchasesError) throw purchasesError;

    // Sum total raised (amount in USD from purchases)
    const { data: purchasesData, error: sumError } = await supabase
      .from('token_purchases')
      .select('total_cost')
      .eq('status', 'completed');

    if (sumError) throw sumError;

    const totalRaised = purchasesData?.reduce((sum, p) => sum + (p.total_cost || 0), 0) || 0;

    // Sum total tokens sold
    const { data: tokenData, error: tokenError } = await supabase
      .from('token_purchases')
      .select('amount')
      .eq('status', 'completed');

    if (tokenError) throw tokenError;

    const totalTokensSold = tokenData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    // Count active referrals
    const { count: totalReferrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true });

    if (referralsError) throw referralsError;

    // Count mining requests
    const { count: miningRequests, error: miningError } = await supabase
      .from('mining_requests')
      .select('*', { count: 'exact', head: true });

    if (miningError) throw miningError;

    // Count approved mining
    const { count: activeMining, error: activeMiningError } = await supabase
      .from('mining_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    if (activeMiningError) throw activeMiningError;

    // Affiliate clicks
    const { count: affiliateClicks, error: clicksError } = await supabase
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true });

    if (clicksError) throw clicksError;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalUsers ?? 0,
        totalHolders: totalUsers ?? 0,
        totalPurchases: totalPurchases ?? 0,
        totalRaised: totalRaised,
        totalTokensSold: totalTokensSold,
        totalReferrals: totalReferrals ?? 0,
        miningRequests: miningRequests ?? 0,
        activeMining: activeMining ?? 0,
        affiliateClicks: affiliateClicks ?? 0,
        // Calcoli derivati
        avgPurchaseSize: (totalPurchases ?? 0) > 0 ? totalRaised / (totalPurchases ?? 0) : 0,
        tokenPrice: 0.10, // Current price from config
        presaleTarget: 5000000, // $5M target
        presaleProgress: (totalRaised / 5000000) * 100,
      }
    });
  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
