-- ============================================
-- AGGIUNTA CAMPO is_admin ALLA TABELLA USERS
-- ============================================

-- 1. Aggiungi colonna is_admin
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Crea indice per performance
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- ============================================
-- RENDI ADMIN IL PRIMO UTENTE REGISTRATO
-- (Esegui DOPO aver fatto la prima registrazione)
-- ============================================

-- Metodo 1: Rendi admin il primo utente per data creazione
UPDATE users 
SET is_admin = true 
WHERE id = (
  SELECT id 
  FROM users 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Metodo 2: Rendi admin un utente specifico per email
-- (Decomenta e sostituisci con la tua email)
-- UPDATE users SET is_admin = true WHERE email = 'tua-email@example.com';

-- ============================================
-- VERIFICA ADMIN
-- ============================================

-- Controlla quali utenti sono admin
SELECT id, email, is_admin, created_at 
FROM users 
WHERE is_admin = true;
