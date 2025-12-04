import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Codice mancante' },
        { status: 400 }
      );
    }

    // Get referral settings
    const settingsResult = await pool.query(
      `SELECT program_active, program_end_date 
      FROM referral_settings 
      ORDER BY id DESC 
      LIMIT 1`
    );

    const settings = settingsResult.rows[0];

    // Check if program is active
    if (!settings || !settings.program_active) {
      return NextResponse.json(
        { success: false, error: 'Programma referral non attivo' },
        { status: 400 }
      );
    }

    // Check if program has ended
    if (settings.program_end_date && new Date() > new Date(settings.program_end_date)) {
      return NextResponse.json(
        { success: false, error: 'Programma referral terminato' },
        { status: 400 }
      );
    }

    // Find user with this referral code
    const userResult = await pool.query(
      `SELECT id, email, referral_code, direct_referrals 
      FROM users 
      WHERE referral_code = $1`,
      [code.toUpperCase()]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Codice referral non valido' },
        { status: 404 }
      );
    }

    const referrer = userResult.rows[0];

    return NextResponse.json({
      success: true,
      referrer: {
        id: referrer.id,
        email: referrer.email,
        referralCode: referrer.referral_code,
        directReferrals: referrer.direct_referrals
      }
    });

  } catch (error) {
    console.error('Error validating referral code:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno' },
      { status: 500 }
    );
  }
}
