#!/bin/bash

# HashBurst Token - Setup Script
# Questo script configura rapidamente il progetto

echo "🚀 HashBurst Token - Setup Iniziale"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trovato. Installalo da nodejs.org"
    exit 1
fi

echo "✅ Node.js trovato: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installazione dipendenze..."
npm install

# Check .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  File .env.local non trovato"
    echo "📝 Creazione da .env.local.example..."
    cp .env.local.example .env.local
    echo "✅ File .env.local creato"
    echo ""
    echo "🔧 IMPORTANTE: Modifica .env.local con le tue credenziali:"
    echo "   - Supabase URL e Keys"
    echo "   - Polygon RPC URL"
    echo "   - JWT Secret"
    echo ""
else
    echo "✅ File .env.local esistente"
fi

echo ""
echo "✅ Setup completato!"
echo ""
echo "📋 Prossimi passi:"
echo "   1. Configura Supabase (vedi DEPLOYMENT.md)"
echo "   2. Modifica .env.local con le tue credenziali"
echo "   3. Esegui: npm run dev"
echo "   4. Apri http://localhost:3000"
echo ""
echo "📚 Documentazione completa in README.md"
echo "🚀 Guida deployment in DEPLOYMENT.md"
echo ""
