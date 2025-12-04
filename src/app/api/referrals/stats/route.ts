import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: stats, error } = await supabaseAdmin
      .from('user_referral_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return NextResponse.json({
        success: true,
        stats: {
          directReferrals: 0,
          level2Referrals: 0,
          level3Referrals: 0,
          networkSize: 0,
          level1Earnings: 0,
          level2Earnings: 0,
          level3Earnings: 0,
          totalEarnings: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        directReferrals: stats?.direct_referrals || 0,
        level2Referrals: stats?.level_2_referrals || 0,
        level3Referrals: stats?.level_3_referrals || 0,
        networkSize: stats?.network_size || 0,
        level1Earnings: parseFloat(stats?.level_1_earnings || 0),
        level2Earnings: parseFloat(stats?.level_2_earnings || 0),
        level3Earnings: parseFloat(stats?.level_3_earnings || 0),
        totalEarnings: parseFloat(stats?.total_earnings || 0)
      }
    });
  } catch (error: any) {
    console.error('Referral stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
