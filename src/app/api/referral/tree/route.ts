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

    // Get Level 1 referrals (direct)
    const level1Result = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.referral_code,
        u.direct_referrals,
        u.total_referrals,
        u.created_at,
        COALESCE(SUM(p.amount), 0) as total_purchases,
        COUNT(DISTINCT p.id) as purchase_count
      FROM users u
      LEFT JOIN purchases p ON p.user_id = u.id AND p.status = 'completed'
      WHERE u.level1_parent = $1
      GROUP BY u.id
      ORDER BY u.created_at DESC`,
      [userId]
    );

    // Get Level 2 referrals (grandchildren)
    const level2Result = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.referral_code,
        u.level1_parent,
        u.direct_referrals,
        u.created_at,
        COALESCE(SUM(p.amount), 0) as total_purchases,
        COUNT(DISTINCT p.id) as purchase_count
      FROM users u
      LEFT JOIN purchases p ON p.user_id = u.id AND p.status = 'completed'
      WHERE u.level2_parent = $1
      GROUP BY u.id, u.level1_parent
      ORDER BY u.created_at DESC`,
      [userId]
    );

    // Get Level 3 referrals (great-grandchildren)
    const level3Result = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.referral_code,
        u.level1_parent,
        u.level2_parent,
        u.created_at,
        COALESCE(SUM(p.amount), 0) as total_purchases,
        COUNT(DISTINCT p.id) as purchase_count
      FROM users u
      LEFT JOIN purchases p ON p.user_id = u.id AND p.status = 'completed'
      WHERE u.level3_parent = $1
      GROUP BY u.id, u.level1_parent, u.level2_parent
      ORDER BY u.created_at DESC`,
      [userId]
    );

    // Build tree structure
    const tree = {
      level1: level1Result.rows.map(user => ({
        id: user.id,
        email: user.email,
        referralCode: user.referral_code,
        directReferrals: user.direct_referrals,
        totalReferrals: user.total_referrals,
        totalPurchases: parseFloat(user.total_purchases),
        purchaseCount: parseInt(user.purchase_count),
        joinedAt: user.created_at,
        children: [] // Will be populated with level 2
      })),
      level2: level2Result.rows.map(user => ({
        id: user.id,
        email: user.email,
        referralCode: user.referral_code,
        parentId: user.level1_parent,
        directReferrals: user.direct_referrals,
        totalPurchases: parseFloat(user.total_purchases),
        purchaseCount: parseInt(user.purchase_count),
        joinedAt: user.created_at,
        children: [] // Will be populated with level 3
      })),
      level3: level3Result.rows.map(user => ({
        id: user.id,
        email: user.email,
        referralCode: user.referral_code,
        parentId: user.level1_parent,
        grandparentId: user.level2_parent,
        totalPurchases: parseFloat(user.total_purchases),
        purchaseCount: parseInt(user.purchase_count),
        joinedAt: user.created_at
      }))
    };

    // Nest level 3 into level 2
    tree.level2.forEach(level2User => {
      level2User.children = tree.level3.filter(
        level3User => level3User.parentId === level2User.id
      );
    });

    // Nest level 2 into level 1
    tree.level1.forEach(level1User => {
      level1User.children = tree.level2.filter(
        level2User => level2User.parentId === level1User.id
      );
    });

    // Calculate totals
    const totals = {
      level1Count: tree.level1.length,
      level2Count: tree.level2.length,
      level3Count: tree.level3.length,
      totalNetwork: tree.level1.length + tree.level2.length + tree.level3.length
    };

    return NextResponse.json({
      success: true,
      tree: tree.level1, // Return only level1 with nested children
      totals
    });

  } catch (error) {
    console.error('Error fetching referral tree:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno' },
      { status: 500 }
    );
  }
}
