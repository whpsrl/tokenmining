import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: commissions, error } = await supabaseAdmin
      .from('referrals')
      .select(\`
        id,
        commission_earned,
        purchase_amount,
        level,
        created_at,
        referred:users!referrals_referred_id_fkey(email)
      \`)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      commissions: commissions || []
    });
  } catch (error: any) {
    console.error('Commissions error:', error);
    return NextResponse.json({ 
      success: true, 
      commissions: [] 
    });
  }
}
