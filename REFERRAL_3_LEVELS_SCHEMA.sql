-- ============================================
-- HASHBURST REFERRAL SYSTEM - 3 LIVELLI MLM
-- ============================================
-- Sistema completo multi-level marketing con:
-- - 3 livelli di commissioni
-- - Albero genealogico
-- - Premio struttura
-- - Admin settings
-- - Data fine programma
-- ============================================

-- ============================================
-- 1. TABELLA REFERRAL_SETTINGS (Admin Config)
-- ============================================
CREATE TABLE IF NOT EXISTS referral_settings (
  id SERIAL PRIMARY KEY,
  level1_commission DECIMAL(5,2) DEFAULT 10.00,  -- % commissione livello 1
  level2_commission DECIMAL(5,2) DEFAULT 5.00,   -- % commissione livello 2
  level3_commission DECIMAL(5,2) DEFAULT 2.50,   -- % commissione livello 3
  structure_bonus_threshold INTEGER DEFAULT 50,   -- Min referral per bonus
  structure_bonus_amount DECIMAL(10,2) DEFAULT 500.00,  -- Premio struttura in $
  program_active BOOLEAN DEFAULT true,            -- Programma attivo?
  program_end_date TIMESTAMP,                     -- Data fine programma
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserisci configurazione di default
INSERT INTO referral_settings (
  level1_commission, 
  level2_commission, 
  level3_commission,
  structure_bonus_threshold,
  structure_bonus_amount,
  program_active,
  program_end_date
) VALUES (
  10.00,  -- 10% livello 1
  5.00,   -- 5% livello 2
  2.50,   -- 2.5% livello 3
  50,     -- Bonus da 50 referral
  500.00, -- $500 bonus
  true,   -- Attivo
  '2025-12-31 23:59:59'  -- Finisce fine 2025
) ON CONFLICT DO NOTHING;


-- ============================================
-- 2. MODIFICA TABELLA USERS (Aggiungi referral tracking)
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS level1_parent INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS level2_parent INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS level3_parent INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS direct_referrals INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS network_size INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_earnings DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS structure_bonus_earned BOOLEAN DEFAULT false;

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_users_level1_parent ON users(level1_parent);
CREATE INDEX IF NOT EXISTS idx_users_level2_parent ON users(level2_parent);
CREATE INDEX IF NOT EXISTS idx_users_level3_parent ON users(level3_parent);

-- Genera referral code per utenti esistenti
UPDATE users 
SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT || id::TEXT) FROM 1 FOR 8))
WHERE referral_code IS NULL;


-- ============================================
-- 3. TABELLA REFERRAL_TREE (Albero completo)
-- ============================================
CREATE TABLE IF NOT EXISTS referral_tree (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_tree_user_id ON referral_tree(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_tree_parent_id ON referral_tree(parent_id);
CREATE INDEX IF NOT EXISTS idx_referral_tree_level ON referral_tree(level);


-- ============================================
-- 4. TABELLA REFERRAL_COMMISSIONS (Commissioni)
-- ============================================
CREATE TABLE IF NOT EXISTS referral_commissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  commission_rate DECIMAL(5,2),
  purchase_amount DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_commissions_user_id ON referral_commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_from_user_id ON referral_commissions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_status ON referral_commissions(status);


-- ============================================
-- 5. TABELLA STRUCTURE_BONUSES (Premi struttura)
-- ============================================
CREATE TABLE IF NOT EXISTS structure_bonuses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  network_size INTEGER NOT NULL,
  bonus_amount DECIMAL(10,2) NOT NULL,
  awarded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_structure_bonuses_user_id ON structure_bonuses(user_id);


-- ============================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================

-- Calcola network size
CREATE OR REPLACE FUNCTION calculate_network_size(user_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  total_size INTEGER;
BEGIN
  SELECT COUNT(DISTINCT rt.user_id) INTO total_size
  FROM referral_tree rt
  WHERE rt.parent_id = user_id_param;
  
  RETURN COALESCE(total_size, 0);
END;
$$ LANGUAGE plpgsql;


-- Crea commissioni su acquisto
CREATE OR REPLACE FUNCTION create_referral_commissions(purchase_id_param INTEGER)
RETURNS VOID AS $$
DECLARE
  buyer_id INTEGER;
  purchase_amt DECIMAL(10,2);
  settings RECORD;
  level1_user INTEGER;
  level2_user INTEGER;
  level3_user INTEGER;
BEGIN
  SELECT user_id, amount INTO buyer_id, purchase_amt
  FROM purchases WHERE id = purchase_id_param;
  
  IF buyer_id IS NULL THEN RETURN; END IF;
  
  SELECT * INTO settings FROM referral_settings ORDER BY id DESC LIMIT 1;
  
  IF NOT settings.program_active OR 
     (settings.program_end_date IS NOT NULL AND NOW() > settings.program_end_date) THEN
    RETURN;
  END IF;
  
  SELECT level1_parent, level2_parent, level3_parent 
  INTO level1_user, level2_user, level3_user
  FROM users WHERE id = buyer_id;
  
  -- LEVEL 1
  IF level1_user IS NOT NULL THEN
    INSERT INTO referral_commissions (
      user_id, from_user_id, purchase_id, level, 
      commission_rate, purchase_amount, commission_amount
    ) VALUES (
      level1_user, buyer_id, purchase_id_param, 1,
      settings.level1_commission, purchase_amt, 
      purchase_amt * (settings.level1_commission / 100)
    );
    
    UPDATE users 
    SET referral_earnings = referral_earnings + (purchase_amt * settings.level1_commission / 100)
    WHERE id = level1_user;
  END IF;
  
  -- LEVEL 2
  IF level2_user IS NOT NULL THEN
    INSERT INTO referral_commissions (
      user_id, from_user_id, purchase_id, level,
      commission_rate, purchase_amount, commission_amount
    ) VALUES (
      level2_user, buyer_id, purchase_id_param, 2,
      settings.level2_commission, purchase_amt,
      purchase_amt * (settings.level2_commission / 100)
    );
    
    UPDATE users 
    SET referral_earnings = referral_earnings + (purchase_amt * settings.level2_commission / 100)
    WHERE id = level2_user;
  END IF;
  
  -- LEVEL 3
  IF level3_user IS NOT NULL THEN
    INSERT INTO referral_commissions (
      user_id, from_user_id, purchase_id, level,
      commission_rate, purchase_amount, commission_amount
    ) VALUES (
      level3_user, buyer_id, purchase_id_param, 3,
      settings.level3_commission, purchase_amt,
      purchase_amt * (settings.level3_commission / 100)
    );
    
    UPDATE users 
    SET referral_earnings = referral_earnings + (purchase_amt * settings.level3_commission / 100)
    WHERE id = level3_user;
  END IF;
  
  PERFORM check_structure_bonus(level1_user);
  PERFORM check_structure_bonus(level2_user);
  PERFORM check_structure_bonus(level3_user);
END;
$$ LANGUAGE plpgsql;


-- Verifica e assegna structure bonus
CREATE OR REPLACE FUNCTION check_structure_bonus(user_id_param INTEGER)
RETURNS VOID AS $$
DECLARE
  settings RECORD;
  network_count INTEGER;
  already_earned BOOLEAN;
BEGIN
  IF user_id_param IS NULL THEN RETURN; END IF;
  
  SELECT * INTO settings FROM referral_settings ORDER BY id DESC LIMIT 1;
  
  SELECT structure_bonus_earned INTO already_earned
  FROM users WHERE id = user_id_param;
  
  IF already_earned THEN RETURN; END IF;
  
  network_count := calculate_network_size(user_id_param);
  
  UPDATE users SET network_size = network_count WHERE id = user_id_param;
  
  IF network_count >= settings.structure_bonus_threshold THEN
    INSERT INTO structure_bonuses (user_id, network_size, bonus_amount)
    VALUES (user_id_param, network_count, settings.structure_bonus_amount);
    
    UPDATE users 
    SET structure_bonus_earned = true,
        referral_earnings = referral_earnings + settings.structure_bonus_amount
    WHERE id = user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql;


-- Trigger: crea referral tree su nuovo utente
CREATE OR REPLACE FUNCTION trigger_create_referral_tree()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NEW.id::TEXT) FROM 1 FOR 8));
  END IF;
  
  IF NEW.referred_by IS NOT NULL THEN
    NEW.level1_parent := NEW.referred_by;
    
    SELECT level1_parent, level2_parent INTO NEW.level2_parent, NEW.level3_parent
    FROM users WHERE id = NEW.referred_by;
    
    UPDATE users 
    SET direct_referrals = direct_referrals + 1,
        total_referrals = total_referrals + 1
    WHERE id = NEW.referred_by;
    
    IF NEW.level2_parent IS NOT NULL THEN
      UPDATE users SET total_referrals = total_referrals + 1 WHERE id = NEW.level2_parent;
    END IF;
    IF NEW.level3_parent IS NOT NULL THEN
      UPDATE users SET total_referrals = total_referrals + 1 WHERE id = NEW.level3_parent;
    END IF;
    
    INSERT INTO referral_tree (user_id, parent_id, level, path)
    VALUES (NEW.id, NEW.level1_parent, 1, NEW.level1_parent::TEXT || '.' || NEW.id::TEXT);
    
    IF NEW.level2_parent IS NOT NULL THEN
      INSERT INTO referral_tree (user_id, parent_id, level, path)
      VALUES (NEW.id, NEW.level2_parent, 2, NEW.level2_parent::TEXT || '.' || NEW.level1_parent::TEXT || '.' || NEW.id::TEXT);
    END IF;
    
    IF NEW.level3_parent IS NOT NULL THEN
      INSERT INTO referral_tree (user_id, parent_id, level, path)
      VALUES (NEW.id, NEW.level3_parent, 3, NEW.level3_parent::TEXT || '.' || NEW.level2_parent::TEXT || '.' || NEW.level1_parent::TEXT || '.' || NEW.id::TEXT);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_referral_tree_on_insert ON users;
CREATE TRIGGER trigger_create_referral_tree_on_insert
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_referral_tree();


-- Trigger: crea commissioni su acquisto
CREATE OR REPLACE FUNCTION trigger_create_commissions_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' OR NEW.status = 'confirmed' THEN
    PERFORM create_referral_commissions(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_commissions_on_purchase_insert ON purchases;
CREATE TRIGGER trigger_commissions_on_purchase_insert
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_commissions_on_purchase();

DROP TRIGGER IF EXISTS trigger_commissions_on_purchase_update ON purchases;
CREATE TRIGGER trigger_commissions_on_purchase_update
  AFTER UPDATE ON purchases
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('completed', 'confirmed'))
  EXECUTE FUNCTION trigger_create_commissions_on_purchase();


-- ============================================
-- VIEWS per statistiche
-- ============================================

CREATE OR REPLACE VIEW user_referral_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.referral_code,
  u.direct_referrals,
  u.total_referrals,
  u.network_size,
  u.referral_earnings,
  u.structure_bonus_earned,
  COUNT(DISTINCT rc.id) as total_commissions,
  COALESCE(SUM(CASE WHEN rc.level = 1 THEN rc.commission_amount END), 0) as level1_earnings,
  COALESCE(SUM(CASE WHEN rc.level = 2 THEN rc.commission_amount END), 0) as level2_earnings,
  COALESCE(SUM(CASE WHEN rc.level = 3 THEN rc.commission_amount END), 0) as level3_earnings
FROM users u
LEFT JOIN referral_commissions rc ON rc.user_id = u.id
GROUP BY u.id;


-- ============================================
-- SCHEMA COMPLETO!
-- ============================================
