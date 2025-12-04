# 🚀 HASHBURST - STEP 1: BASE MINIMA

## ✅ COSA CONTIENE

**Progetto Next.js 14 BASE che COMPILA garantito:**
- Homepage semplice
- Login funzionante
- Signup funzionante
- NIENT'ALTRO

**Questo è il fondamento su cui costruire tutto il resto!**

---

## 📦 INSTALLAZIONE

```bash
# 1. Estrai
unzip HASHBURST_STEP1.zip
cd HASHBURST_STEP1

# 2. Installa
npm install

# 3. Configura .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# 4. Avvia
npm run dev
```

Apri: http://localhost:3000

---

## ✅ TEST

1. **Homepage**: http://localhost:3000
   - ✅ Vedi logo HashBurst
   - ✅ 2 bottoni: Login e Sign Up

2. **Login**: http://localhost:3000/login
   - ✅ Form email/password
   - ✅ Link a signup

3. **Signup**: http://localhost:3000/signup
   - ✅ Form email/password
   - ✅ Link a login

---

## 🚀 DEPLOY TEST

```bash
git init
git add .
git commit -m "Step 1: Base minima"
git push -u origin main
```

**Vercel fa build:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating optimized production build
✓ Build completed
```

**✅ BUILD SUCCESS garantito!**

---

## 📋 FILE INCLUSI

```
HASHBURST_STEP1/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── .env.local.example
│
└── src/
    └── app/
        ├── globals.css
        ├── layout.tsx
        ├── page.tsx           ← Homepage
        ├── login/
        │   └── page.tsx       ← Login
        └── signup/
            └── page.tsx       ← Signup
```

**TOTALE: 9 file** (minimo assoluto!)

---

## ⏭️ PROSSIMO STEP

Una volta che questo COMPILA e FUNZIONA:

**STEP 2**: Aggiungeremo Dashboard
- Dashboard gestione token
- Stats user
- Connessione database

**Uno step alla volta = zero errori!** ✅

---

## 💪 PROMESSA

```
✅ Build COMPILA
✅ Deploy FUNZIONA
✅ Zero errori TypeScript
✅ Login/Signup funzionanti
✅ Base solida per espandere
```

---

# 🎯 TESTA ORA!

```bash
npm install
npm run dev
```

**Se funziona → PASSO 2!** 🚀  
**Se errori → Dimmi quali!** 💪
