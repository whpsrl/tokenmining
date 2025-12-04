# 🚀 HashBurst Token - Complete Platform

![HashBurst Banner](https://via.placeholder.com/1200x300/0ea5e9/ffffff?text=HashBurst+Token)

> Token rivoluzionario basato su mining reale con tecnologia AI-powered e rete geo-distribuita

## 📋 Indice

- [Panoramica](#panoramica)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Deploy su Vercel](#deploy-su-vercel)
- [Smart Contract](#smart-contract)
- [Struttura Progetto](#struttura-progetto)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)

## 🎯 Panoramica

HashBurst Token (HBT) è un ecosistema completo che combina:

- **Token ERC-20** su Polygon con meccanismi anti-dump/whale
- **Cloud Mining AI-powered** con 950+ macchine attive
- **Programma Affiliati** con commissioni fino al 20%
- **Dashboard Professionale** per gestione token e mining
- **Admin Panel** completo per amministrazione

## ✨ Features

### 🔒 Smart Contract Security
- ✅ Anti-Dump: vendita max 5% mensile
- ✅ Anti-Whale: acquisto max 0.1% supply/12 mesi
- ✅ Private Sale con whitelist
- ✅ Mining Rewards automatici
- ✅ Audit-ready code

### 💼 Piattaforma Web
- ✅ Homepage straordinaria con animazioni
- ✅ Dashboard completa per utenti
- ✅ Sistema affiliazione con tracking
- ✅ Form mining gratuito / webinar
- ✅ Whitepaper integrato
- ✅ Admin panel completo
- ✅ Wallet integration (WalletConnect, MetaMask)
- ✅ Real-time stats & notifications

### 📊 Backend & Database
- ✅ Supabase per database e auth
- ✅ API Routes per gestione dati
- ✅ Tracking clicks affiliati
- ✅ Gestione mining requests
- ✅ Sistema commissioni automatico

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (Design system custom)
- **Framer Motion** (Animazioni)
- **Lucide React** (Icons)

### Blockchain
- **Solidity 0.8.20**
- **Polygon Network**
- **ethers.js / wagmi**
- **RainbowKit**

### Backend
- **Next.js API Routes**
- **Supabase** (PostgreSQL)
- **JWT Authentication**

### Deploy
- **Vercel** (Hosting & CI/CD)
- **Polygon RPC** (Blockchain)

## 📦 Installazione

```bash
# Clone repository
git clone https://github.com/your-username/hashburst-token.git
cd hashburst-token

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Modifica .env.local con le tue credenziali

# Run development server
npm run dev
```

Il sito sarà disponibile su `http://localhost:3000`

## ⚙️ Configurazione

### 1. Supabase Setup

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Copia URL e Anon Key in `.env.local`
3. Esegui SQL in `src/lib/supabase.ts` per creare le tabelle

### 2. Smart Contract Deploy

```bash
# Compila contract
npx hardhat compile

# Deploy su Polygon Mumbai (testnet)
npx hardhat run scripts/deploy.ts --network mumbai

# Deploy su Polygon Mainnet
npx hardhat run scripts/deploy.ts --network polygon
```

### 3. Environment Variables

```env
# Site
NEXT_PUBLIC_SITE_URL=https://hashburst.io
NEXT_PUBLIC_SITE_NAME=HashBurst Token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Blockchain
NEXT_PUBLIC_POLYGON_RPC=https://polygon-rpc.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=137

# JWT
JWT_SECRET=your_secret_key
```

## 🚀 Deploy su Vercel

### Metodo 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Metodo 2: GitHub Integration

1. Push su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. Importa repository
4. Aggiungi Environment Variables
5. Deploy automatico ad ogni push

### Configurazione Vercel

**Framework Preset:** Next.js  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm install`

## 📜 Smart Contract

### HashBurstToken.sol

Caratteristiche principali:

```solidity
// Supply totale
uint256 constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;

// Anti-Whale: max 0.1% supply
uint256 maxBuyPercentage = 100; // basis points

// Anti-Dump: max 5% vendita mensile
uint256 constant DUMP_PERCENTAGE = 5;
uint256 constant DUMP_PERIOD = 30 days;
```

### Funzioni Principali

- `_update()` - Override con controlli anti-dump/whale
- `distributeMiningRewards()` - Distribuzione rewards
- `setPrivateSaleStatus()` - Gestione private sale
- `addToWhitelist()` - Whitelist management
- `getSellInfo()` - Info vendita utente
- `getBuyInfo()` - Info acquisto utente

## 📁 Struttura Progetto

```
hashburst-token/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard utente
│   │   ├── affiliates/
│   │   │   └── page.tsx          # Programma affiliati
│   │   ├── join/
│   │   │   └── page.tsx          # Form mining gratuito
│   │   ├── whitepaper/
│   │   │   └── page.tsx          # Whitepaper
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin panel
│   │   └── api/
│   │       └── mining-requests/
│   │           └── route.ts      # API mining requests
│   ├── components/
│   │   ├── ui/                   # Componenti UI
│   │   ├── sections/             # Sezioni pagine
│   │   └── layout/               # Layout components
│   ├── lib/
│   │   └── supabase.ts           # Supabase config
│   ├── hooks/                    # Custom hooks
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── contracts/
│       └── HashBurstToken.sol    # Smart contract
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🔌 API Routes

### POST `/api/mining-requests`
Crea nuova richiesta mining gratuito

```typescript
Body: {
  name: string;
  email: string;
  wallet?: string;
  message?: string;
}
```

### GET `/api/mining-requests`
Recupera richieste (admin only)

Query params: `?status=pending|approved|rejected`

## 💾 Database Schema

### users
```sql
id            UUID PRIMARY KEY
email         TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
wallet_address TEXT
referral_code TEXT UNIQUE NOT NULL
referred_by   UUID REFERENCES users(id)
kyc_verified  BOOLEAN DEFAULT FALSE
created_at    TIMESTAMPTZ DEFAULT NOW()
```

### token_purchases
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
amount          DECIMAL NOT NULL
price_per_token DECIMAL NOT NULL
total_cost      DECIMAL NOT NULL
tx_hash         TEXT
status          TEXT DEFAULT 'pending'
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### referrals
```sql
id               UUID PRIMARY KEY
referrer_id      UUID REFERENCES users(id)
referred_id      UUID REFERENCES users(id)
commission_earned DECIMAL DEFAULT 0
purchase_amount  DECIMAL DEFAULT 0
created_at       TIMESTAMPTZ DEFAULT NOW()
```

### mining_requests
```sql
id             UUID PRIMARY KEY
name           TEXT NOT NULL
email          TEXT NOT NULL
wallet_address TEXT
message        TEXT
status         TEXT DEFAULT 'pending'
created_at     TIMESTAMPTZ DEFAULT NOW()
```

## 📈 Roadmap

### ✅ Phase 1 - Launch (Q1 2025)
- Smart Contract deployment
- Website & Dashboard
- Private Sale
- Mining operations

### 🔄 Phase 2 - Expansion (Q2 2025)
- DEX listings
- Staking platform
- Mobile app
- 1500+ mining machines

### 🎯 Phase 3 - Optimization (Q3 2025)
- CEX listings
- DAO governance
- AI algorithms v2
- Multi-chain bridge

### 🎯 Phase 4 - Ecosystem (Q4 2025)
- NFT mining machines
- Marketplace
- Institutional partnerships
- Global marketing

## 📝 License

MIT License - see LICENSE file

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR.

## 📞 Support

- Email: support@hashburst.io
- Twitter: [@HashBurstToken](https://twitter.com/hashburst)
- Telegram: [t.me/hashburst](https://t.me/hashburst)

---

**Made with ❤️ by the HashBurst Team**
