import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
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

    const body = await request.json();
    const {
      level1_commission,
      level2_commission,
      level3_commission,
      structure_bonus_threshold,
      structure_bonus_amount,
      program_active,
      program_end_date
    } = body;

    // Update settings
    const result = await query(
      `UPDATE referral_settings
       SET level1_commission = $1,
           level2_commission = $2,
           level3_commission = $3,
           structure_bonus_threshold = $4,
           structure_bonus_amount = $5,
           program_active = $6,
           program_end_date = $7,
           updated_at = NOW()
       WHERE id = 1
       RETURNING *`,
      [
        level1_commission,
        level2_commission,
        level3_commission,
        structure_bonus_threshold,
        structure_bonus_amount,
        program_active,
        program_end_date
      ]
    );

    return NextResponse.json({
      success: true,
      settings: result.rows[0],
      message: 'Impostazioni aggiornate con successo'
    });
  } catch (error) {
    console.error('Error updating referral settings:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento delle impostazioni' },
      { status: 500 }
    );
  }
}
