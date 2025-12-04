import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

// GET settings
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token non valido' },
        { status: 401 }
      );
    }

    // Verify admin
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!userResult.rows[0]?.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Accesso negato' },
        { status: 403 }
      );
    }

    // Get current settings
    const settingsResult = await pool.query(
      `SELECT * FROM referral_settings ORDER BY id DESC LIMIT 1`
    );

    const settings = settingsResult.rows[0] || {};

    return NextResponse.json({
      success: true,
      settings: {
        level1Commission: parseFloat(settings.level1_commission || 10),
        level2Commission: parseFloat(settings.level2_commission || 5),
        level3Commission: parseFloat(settings.level3_commission || 2.5),
        structureBonusThreshold: settings.structure_bonus_threshold || 50,
        structureBonusAmount: parseFloat(settings.structure_bonus_amount || 500),
        programActive: settings.program_active !== false,
        programEndDate: settings.program_end_date
      }
    });

  } catch (error) {
    console.error('Error fetching referral settings:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno' },
      { status: 500 }
    );
  }
}

// POST - Update settings
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token non valido' },
        { status: 401 }
      );
    }

    // Verify admin
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!userResult.rows[0]?.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Accesso negato' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate input
    const {
      level1Commission,
      level2Commission,
      level3Commission,
      structureBonusThreshold,
      structureBonusAmount,
      programActive,
      programEndDate
    } = data;

    // Validation
    if (level1Commission < 0 || level1Commission > 100) {
      return NextResponse.json(
        { success: false, error: 'Commissione livello 1 deve essere tra 0 e 100%' },
        { status: 400 }
      );
    }

    if (level2Commission < 0 || level2Commission > 100) {
      return NextResponse.json(
        { success: false, error: 'Commissione livello 2 deve essere tra 0 e 100%' },
        { status: 400 }
      );
    }

    if (level3Commission < 0 || level3Commission > 100) {
      return NextResponse.json(
        { success: false, error: 'Commissione livello 3 deve essere tra 0 e 100%' },
        { status: 400 }
      );
    }

    // Update settings (sempre solo 1 record)
    const updateResult = await pool.query(
      `UPDATE referral_settings SET
        level1_commission = $1,
        level2_commission = $2,
        level3_commission = $3,
        structure_bonus_threshold = $4,
        structure_bonus_amount = $5,
        program_active = $6,
        program_end_date = $7,
        updated_at = NOW()
      WHERE id = (SELECT id FROM referral_settings ORDER BY id DESC LIMIT 1)
      RETURNING *`,
      [
        level1Commission,
        level2Commission,
        level3Commission,
        structureBonusThreshold,
        structureBonusAmount,
        programActive,
        programEndDate || null
      ]
    );

    if (updateResult.rows.length === 0) {
      // Se non esiste, crea
      const insertResult = await pool.query(
        `INSERT INTO referral_settings (
          level1_commission,
          level2_commission,
          level3_commission,
          structure_bonus_threshold,
          structure_bonus_amount,
          program_active,
          program_end_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          level1Commission,
          level2Commission,
          level3Commission,
          structureBonusThreshold,
          structureBonusAmount,
          programActive,
          programEndDate || null
        ]
      );

      return NextResponse.json({
        success: true,
        message: 'Settings creati con successo',
        settings: insertResult.rows[0]
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings aggiornati con successo',
      settings: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Error updating referral settings:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno' },
      { status: 500 }
    );
  }
}
