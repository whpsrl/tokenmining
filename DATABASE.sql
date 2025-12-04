-- ===================================================================
-- HASHBURST DATABASE COMPLETO - 3 LIVELLI REFERRAL
-- ===================================================================

-- Tabella users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_users_email ON users(email);

-- Tabella purchases
CREATE TABLE token_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tokens DECIMAL(18,8) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_purchases_user_id ON token_purchases(user_id);
CREATE INDEX idx_purchases_status ON token_purchases(status);

-- Tabella referral_settings
CREATE TABLE referral_settings (
  id SERIAL PRIMARY KEY,
  level_1_percentage DECIMAL(5,2) DEFAULT 10.00,
  level_2_percentage DECIMAL(5,2) DEFAULT 5.00,
  level_3_percentage DECIMAL(5,2) DEFAULT 2.50,
  program_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO referral_settings (level_1_percentage, level_2_percentage, level_3_percentage)
VALUES (10.00, 5.00, 2.50);

-- Tabella referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  purchase_id UUID REFERENCES token_purchases(id) ON DELETE CASCADE,
  commission_earned DECIMAL(10,2) DEFAULT 0,
  purchase_amount DECIMAL(10,2) DEFAULT 0,
  level INTEGER DEFAULT 1 CHECK (level IN (1, 2, 3)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_level ON referrals(level);

-- Vista stats
CREATE VIEW user_referral_stats AS
SELECT 
  u.id AS user_id,
  u.email,
  u.referral_code,
  COUNT(DISTINCT l1.id) AS direct_referrals,
  COUNT(DISTINCT l2.id) AS level_2_referrals,
  COUNT(DISTINCT l3.id) AS level_3_referrals,
  (COUNT(DISTINCT l1.id) + COUNT(DISTINCT l2.id) + COUNT(DISTINCT l3.id)) AS network_size,
  COALESCE(SUM(CASE WHEN r.level = 1 THEN r.commission_earned ELSE 0 END), 0) AS level_1_earnings,
  COALESCE(SUM(CASE WHEN r.level = 2 THEN r.commission_earned ELSE 0 END), 0) AS level_2_earnings,
  COALESCE(SUM(CASE WHEN r.level = 3 THEN r.commission_earned ELSE 0 END), 0) AS level_3_earnings,
  COALESCE(SUM(r.commission_earned), 0) AS total_earnings
FROM users u
LEFT JOIN users l1 ON l1.referred_by = u.id
LEFT JOIN users l2 ON l2.referred_by = l1.id
LEFT JOIN users l3 ON l3.referred_by = l2.id
LEFT JOIN referrals r ON r.referrer_id = u.id
GROUP BY u.id, u.email, u.referral_code;

-- Function calcolo commissioni
CREATE OR REPLACE FUNCTION calculate_3_level_commissions(
  purchase_uuid UUID,
  buyer_uuid UUID,
  purchase_amt DECIMAL
) RETURNS VOID AS \$\$
DECLARE
  settings RECORD;
  parent1 UUID; parent2 UUID; parent3 UUID;
BEGIN
  SELECT * INTO settings FROM referral_settings ORDER BY id DESC LIMIT 1;
  IF NOT settings.program_active THEN RETURN; END IF;
  
  SELECT referred_by INTO parent1 FROM users WHERE id = buyer_uuid;
  
  IF parent1 IS NOT NULL THEN
    INSERT INTO referrals (referrer_id, referred_id, purchase_id, commission_earned, purchase_amount, level)
    VALUES (parent1, buyer_uuid, purchase_uuid, purchase_amt * settings.level_1_percentage / 100, purchase_amt, 1);
    
    SELECT referred_by INTO parent2 FROM users WHERE id = parent1;
    IF parent2 IS NOT NULL THEN
      INSERT INTO referrals (referrer_id, referred_id, purchase_id, commission_earned, purchase_amount, level)
      VALUES (parent2, buyer_uuid, purchase_uuid, purchase_amt * settings.level_2_percentage / 100, purchase_amt, 2);
      
      SELECT referred_by INTO parent3 FROM users WHERE id = parent2;
      IF parent3 IS NOT NULL THEN
        INSERT INTO referrals (referrer_id, referred_id, purchase_id, commission_earned, purchase_amount, level)
        VALUES (parent3, buyer_uuid, purchase_uuid, purchase_amt * settings.level_3_percentage / 100, purchase_amt, 3);
      END IF;
    END IF;
  END IF;
END;
\$\$ LANGUAGE plpgsql;

-- Trigger automatico
CREATE OR REPLACE FUNCTION trigger_3_level_commissions() RETURNS TRIGGER AS \$\$
BEGIN
  IF NEW.status = 'completed' THEN
    PERFORM calculate_3_level_commissions(NEW.id, NEW.user_id, NEW.total_cost);
  END IF;
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

CREATE TRIGGER after_purchase_complete
AFTER INSERT OR UPDATE ON token_purchases
FOR EACH ROW WHEN (NEW.status = 'completed')
EXECUTE FUNCTION trigger_3_level_commissions();
