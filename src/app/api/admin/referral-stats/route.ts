// src/app/api/admin/referral-stats/route.ts
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

    // Verifica admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get admin stats dalla view
    const { data: stats } = await supabase
      .from('admin_referral_stats')
      .select('*')
      .single();

    // Get settings
    const { data: settings } = await supabase
      .from('referral_settings')
      .select('*')
      .single();

    // Get top performers
    const { data: topPerformers } = await supabase
      .from('user_referral_stats')
      .select('*')
      .order('network_size', { ascending: false })
      .limit(10);

    // Get recent commissions
    const { data: recentCommissions } = await supabase
      .from('referral_commissions')
      .select(`
        *,
        earner:users!referral_commissions_user_id_fkey(email),
        buyer:users!referral_commissions_from_user_id_fkey(email)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get structure bonuses
    const { data: structureBonuses } = await supabase
      .from('structure_bonuses')
      .select(`
        *,
        user:users(email, referral_code)
      `)
      .order('awarded_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      stats: stats || {
        total_users: 0,
        referred_users: 0,
        total_commissions: 0,
        total_commissions_paid: 0,
        structure_bonuses_awarded: 0,
        total_bonuses_paid: 0,
        level1_connections: 0,
        level2_connections: 0,
        level3_connections: 0
      },
      settings: settings || {
        level1_commission: 10,
        level2_commission: 5,
        level3_commission: 2.5,
        program_active: true,
        structure_bonus_threshold: 50,
        structure_bonus_amount: 500
      },
      topPerformers: topPerformers || [],
      recentCommissions: recentCommissions || [],
      structureBonuses: structureBonuses || []
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
