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

    // Check if admin
    const userResult = await query(
      `SELECT is_admin FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (!userResult.rows[0]?.is_admin) {
      return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
    }

    // Get overall stats
    const statsResult = await query(`SELECT * FROM admin_referral_stats`);
    const stats = statsResult.rows[0];

    // Get settings
    const settingsResult = await query(
      `SELECT * FROM referral_settings ORDER BY id DESC LIMIT 1`
    );
    const settings = settingsResult.rows[0];

    // Get top performers
    const topPerformersResult = await query(
      `SELECT 
        u.id,
        u.email,
        u.referral_code,
        u.direct_referrals,
        u.total_referrals,
        u.network_size,
        u.referral_earnings,
        u.structure_bonus_earned
       FROM users u
       WHERE u.direct_referrals > 0
       ORDER BY u.network_size DESC, u.referral_earnings DESC
       LIMIT 10`
    );

    // Get recent commissions
    const recentCommissionsResult = await query(
      `SELECT 
        rc.*,
        u1.email as earner_email,
        u2.email as buyer_email
       FROM referral_commissions rc
       JOIN users u1 ON u1.id = rc.user_id
       JOIN users u2 ON u2.id = rc.from_user_id
       ORDER BY rc.created_at DESC
       LIMIT 50`
    );

    // Get structure bonuses
    const bonusesResult = await query(
      `SELECT 
        sb.*,
        u.email,
        u.network_size
       FROM structure_bonuses sb
       JOIN users u ON u.id = sb.user_id
       ORDER BY sb.awarded_at DESC
       LIMIT 20`
    );

    return NextResponse.json({
      success: true,
      stats,
      settings,
      topPerformers: topPerformersResult.rows,
      recentCommissions: recentCommissionsResult.rows,
      structureBonuses: bonusesResult.rows
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Errore' }, { status: 500 });
  }
}
