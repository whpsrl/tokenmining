# 🚀 Guida Deployment Rapido

## Setup Veloce (5 minuti)

### 1️⃣ Supabase Setup

1. Vai su [supabase.com](https://supabase.com)
2. Crea nuovo progetto
3. Vai su SQL Editor
4. Copia e incolla lo schema SQL da `src/lib/supabase.ts`
5. Esegui lo script
6. Copia URL e API Keys dalle Settings

### 2️⃣ Environment Variables

Crea file `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=HashBurst Token

# Blockchain (usa testnet per testing)
NEXT_PUBLIC_POLYGON_RPC=https://polygon-mumbai-bor.publicnode.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CHAIN_ID=80001

# JWT
JWT_SECRET=your-super-secret-key-change-this

# Private Sale
PRIVATE_SALE_WALLET=0x0000000000000000000000000000000000000000
PRIVATE_SALE_START_DATE=2025-01-01
PRIVATE_SALE_END_DATE=2025-03-31
```

### 3️⃣ Install & Run

```bash
npm install
npm run dev
```

Apri browser su `http://localhost:3000`

### 4️⃣ Deploy su Vercel

**Opzione A: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

**Opzione B: GitHub Integration**
1. Push codice su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Seleziona repository
5. Aggiungi tutte le Environment Variables
6. Click "Deploy"

**IMPORTANTE:** Aggiungi TUTTE le variabili d'ambiente su Vercel!

### 5️⃣ Smart Contract Deploy (Opzionale)

Se vuoi deployare lo smart contract:

```bash
# Install Hardhat
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Create hardhat.config.js
npx hardhat

# Deploy su Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Copia contract address in .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

## ✅ Checklist Pre-Deploy

- [ ] Supabase database creato e configurato
- [ ] Tutte le environment variables settate
- [ ] `npm run build` funziona senza errori
- [ ] Test in locale completati
- [ ] Domain configurato (opzionale)
- [ ] Analytics configurato (opzionale)

## 🔧 Troubleshooting

### Build Error: "Module not found"
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Supabase Connection Error
- Verifica URL e Keys in `.env.local`
- Controlla che le tabelle esistano
- Verifica RLS policies se attive

### Vercel Deploy Failed
- Controlla logs su Vercel dashboard
- Verifica che tutte le env vars siano settate
- Assicurati che `npm run build` funzioni in locale

## 📞 Supporto

Hai problemi? Apri issue su GitHub o contatta:
- Email: dev@hashburst.io
- Telegram: [@hashburst_dev](https://t.me/hashburst_dev)

---

**Tempo stimato setup completo:** 5-10 minuti ⚡
