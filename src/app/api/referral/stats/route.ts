// src/app/api/referral/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Verifica auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user stats dalla view
    const { data: stats, error: statsError } = await supabase
      .from('user_referral_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError) {
      console.error('Stats error:', statsError);
    }

    // Get referral tree usando RPC
    const { data: treeData, error: treeError } = await supabase
      .rpc('get_referral_tree', { root_user_id: user.id, max_level: 3 });

    const tree = {
      level1: treeData?.filter((r: any) => r.level === 1) || [],
      level2: treeData?.filter((r: any) => r.level === 2) || [],
      level3: treeData?.filter((r: any) => r.level === 3) || []
    };

    // Get recent commissions
    const { data: commissions, error: commissionsError } = await supabase
      .from('referral_commissions')
      .select(`
        *,
        from_user:users!referral_commissions_from_user_id_fkey(email)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get settings
    const { data: settings, error: settingsError } = await supabase
      .from('referral_settings')
      .select('*')
      .single();

    // Get referral code
    const { data: userData } = await supabase
      .from('users')
      .select('referral_code')
      .eq('id', user.id)
      .single();

    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${userData?.referral_code}`;

    return NextResponse.json({
      referral_code: userData?.referral_code,
      referral_link: referralLink,
      stats: stats || {
        direct_referrals: 0,
        total_referrals: 0,
        network_size: 0,
        referral_earnings: 0,
        structure_bonus_earned: false,
        level1_earnings: 0,
        level2_earnings: 0,
        level3_earnings: 0,
        structure_bonus_amount: 0
      },
      tree,
      commissions: commissions || [],
      settings: settings || {
        level1_commission: 10,
        level2_commission: 5,
        level3_commission: 2.5,
        program_active: true,
        structure_bonus_threshold: 50,
        structure_bonus_amount: 500
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
