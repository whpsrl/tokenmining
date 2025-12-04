// src/app/api/referral/tree/route.ts
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

    // Get referral tree usando RPC
    const { data: treeData, error } = await supabase
      .rpc('get_referral_tree', { root_user_id: user.id, max_level: 3 });

    if (error) {
      console.error('Tree error:', error);
      return NextResponse.json({ error: 'Failed to fetch tree' }, { status: 500 });
    }

    // Organizza per livelli
    const tree = {
      level1: treeData?.filter((r: any) => r.level === 1) || [],
      level2: treeData?.filter((r: any) => r.level === 2) || [],
      level3: treeData?.filter((r: any) => r.level === 3) || []
    };

    return NextResponse.json({ tree });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
