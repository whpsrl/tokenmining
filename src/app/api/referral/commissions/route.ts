import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

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

    const userId = decoded.userId;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Get commissions with user info
    const commissionsResult = await pool.query(
      `SELECT 
        rc.id,
        rc.level,
        rc.commission_rate,
        rc.purchase_amount,
        rc.commission_amount,
        rc.status,
        rc.created_at,
        rc.paid_at,
        u.email as from_user_email,
        u.referral_code as from_user_code
      FROM referral_commissions rc
      JOIN users u ON u.id = rc.from_user_id
      WHERE rc.user_id = $1
      ORDER BY rc.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total 
      FROM referral_commissions 
      WHERE user_id = $1`,
      [userId]
    );

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    const commissions = commissionsResult.rows.map(comm => ({
      id: comm.id,
      level: comm.level,
      commissionRate: parseFloat(comm.commission_rate),
      purchaseAmount: parseFloat(comm.purchase_amount),
      commissionAmount: parseFloat(comm.commission_amount),
      status: comm.status,
      fromUser: {
        email: comm.from_user_email,
        code: comm.from_user_code
      },
      createdAt: comm.created_at,
      paidAt: comm.paid_at
    }));

    return NextResponse.json({
      success: true,
      commissions,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno' },
      { status: 500 }
    );
  }
}
