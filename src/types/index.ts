// src/types/index.ts

export interface User {
  id: string;
  email: string;
  wallet_address?: string;
  referral_code: string;
  referred_by?: string;
  created_at: string;
  total_referrals: number;
  total_commission: number;
  kyc_verified: boolean;
  is_admin: boolean;
}

export interface TokenPurchase {
  id: string;
  user_id: string;
  amount: number;
  price_per_token: number;
  total_cost: number;
  tx_hash?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  commission_earned: number;
  purchase_amount: number;
  created_at: string;
  referred_user?: User;
}

export interface MiningRequest {
  id: string;
  name: string;
  email: string;
  wallet_address?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface TokenStats {
  totalSupply: bigint;
  circulatingSupply: bigint;
  privateSaleActive: boolean;
  holders: number;
  currentPrice: number;
  marketCap: number;
}

export interface AffiliateLinkClick {
  id: string;
  referral_code: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface DashboardStats {
  totalPurchased: number;
  totalReferrals: number;
  totalCommission: number;
  pendingCommission: number;
  tokenBalance: number;
  affiliateClicks: number;
}
