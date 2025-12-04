import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: tree, error } = await supabaseAdmin.rpc('get_referral_tree', {
      user_uuid: userId
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      tree: tree || { level1: [], level2: [], level3: [] }
    });
  } catch (error: any) {
    console.error('Referral tree error:', error);
    return NextResponse.json({ 
      success: true,
      tree: { level1: [], level2: [], level3: [] }
    });
  }
}
