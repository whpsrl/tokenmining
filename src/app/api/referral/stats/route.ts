import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token non valido' }, { status: 401 });
    }

    const userId = decoded.userId;

    // Get user referral stats
    const statsResult = await query(
      `SELECT * FROM user_referral_stats WHERE user_id = $1`,
      [userId]
    );

    const stats = statsResult.rows[0] || {
      direct_referrals: 0,
      total_referrals: 0,
      network_size: 0,
      referral_earnings: 0,
      level1_earnings: 0,
      level2_earnings: 0,
      level3_earnings: 0,
      structure_bonus_earned: false,
      structure_bonus_amount: 0
    };

    // Get referral tree (3 levels)
    const treeResult = await query(
      `SELECT * FROM get_referral_tree($1, 3)`,
      [userId]
    );

    // Organize tree by levels
    const tree = {
      level1: treeResult.rows.filter(r => r.level === 1),
      level2: treeResult.rows.filter(r => r.level === 2),
      level3: treeResult.rows.filter(r => r.level === 3)
    };

    // Get recent commissions
    const commissionsResult = await query(
      `SELECT 
        rc.*,
        u.email as from_email,
        u.referral_code as from_code
       FROM referral_commissions rc
       JOIN users u ON u.id = rc.from_user_id
       WHERE rc.user_id = $1
       ORDER BY rc.created_at DESC
       LIMIT 20`,
      [userId]
    );

    // Get referral settings
    const settingsResult = await query(
      `SELECT * FROM referral_settings ORDER BY id DESC LIMIT 1`
    );

    const settings = settingsResult.rows[0] || {
      program_active: false,
      program_end_date: null,
      structure_bonus_threshold: 50,
      structure_bonus_amount: 500
    };

    // Get user referral code
    const userResult = await query(
      `SELECT referral_code FROM users WHERE id = $1`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      referral_code: userResult.rows[0]?.referral_code,
      stats,
      tree,
      commissions: commissionsResult.rows,
      settings,
      referral_link: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register?ref=${userResult.rows[0]?.referral_code}`
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero statistiche' },
      { status: 500 }
    );
  }
}
