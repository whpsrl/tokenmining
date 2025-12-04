# 🚀 HashBurst Token - Complete Platform

Sistema completo con referral a 3 livelli, mining AI-powered e dashboard professionale.

## ✨ Features

- ✅ **Referral 3 Livelli** (10%, 5%, 2.5%)
- ✅ **Commissioni Automatiche** (trigger SQL)
- ✅ **Dashboard Completa**
- ✅ **Homepage Professionale**
- ✅ **Admin Panel**
- ✅ **API Routes Complete**
- ✅ **Database Ottimizzato**

## 📦 Installazione Rapida

```bash
# 1. Install dependencies
npm install

# 2. Setup Supabase
# - Vai su supabase.com
# - Crea nuovo progetto
# - SQL Editor → Esegui DATABASE.sql

# 3. Configure environment
cp .env.local.example .env.local
# Modifica .env.local con le tue credenziali

# 4. Run development
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 🗄️ Database

Il file `DATABASE.sql` crea:
- ✅ 4 Tabelle (users, token_purchases, referral_settings, referrals)
- ✅ Vista user_referral_stats
- ✅ Function calculate_3_level_commissions
- ✅ Trigger automatico
- ✅ Indexes per performance

## 🚀 Deploy su Vercel

```bash
npm i -g vercel
vercel
```

Oppure push su GitHub e importa su vercel.com

## 📁 Struttura

```
hashburst-new/
├── DATABASE.sql              ← Esegui su Supabase
├── src/
│   ├── app/
│   │   ├── page.tsx         ← Homepage
│   │   ├── dashboard/       ← Dashboard
│   │   ├── affiliates/      ← 3 Livelli
│   │   └── api/             ← API Routes
│   └── lib/
│       └── supabase.ts      ← Config
```

## 🎯 API Routes

- `POST /api/auth/signup` - Registrazione
- `POST /api/auth/login` - Login
- `GET /api/referrals/stats` - Stats 3 livelli
- `GET /api/referrals/tree` - Albero referral
- `GET /api/referrals/commissions` - Commissioni

## ⚙️ Configurazione

Modifica percentuali in Supabase:

```sql
UPDATE referral_settings SET
  level_1_percentage = 15.00,
  level_2_percentage = 7.50,
  level_3_percentage = 3.00
WHERE id = 1;
```

## 📞 Support

- GitHub Issues
- Email: support@hashburst.io

## 📝 License

MIT License

---

**Made with ❤️ by HashBurst Team** 🚀💰
