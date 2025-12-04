'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  it: {
    // Navigation
    'nav.login': 'Accedi',
    'nav.signup': 'Registrati',
    'nav.getStarted': 'Inizia Ora',
    'nav.dashboard': 'Dashboard',
    
    // Homepage
    'home.hero.title1': 'Compra Token.',
    'home.hero.title2': 'Possiedi Hardware Reale.',
    'home.hero.subtitle': 'I possessori di token HashBurst possiedono vero hardware per il mining di Bitcoin. I tuoi token rappresentano reale potenza di mining che genera Bitcoin 24/7.',
    'home.hero.buyNow': 'Compra Token Ora',
    'home.hero.viewDashboard': 'Vedi Dashboard',
    
    // Stats
    'stats.revenue': 'Fatturato Totale',
    'stats.hashPower': 'Potenza Hash',
    'stats.tokensBurned': 'Token Bruciati',
    'stats.holders': 'Possessori Token',
    
    // How it works
    'home.how.title': 'Semplice. Trasparente. Redditizio.',
    'home.how.subtitle': 'Compra token HashBurst e possiedi automaticamente una quota di vero hardware per mining Bitcoin.',
    'home.how.step1.title': '1. Compra Token',
    'home.how.step1.desc': 'Acquista token HashBurst durante la vendita. Prezzo iniziale $0.06 per token.',
    'home.how.step2.title': '2. Possiedi Hardware',
    'home.how.step2.desc': 'I tuoi token rappresentano proprietà di vero equipaggiamento mining che genera Bitcoin.',
    'home.how.step3.title': '3. Guadagna Bitcoin',
    'home.how.step3.desc': 'I ricavi del mining vengono usati per riacquistare e bruciare token, aumentando il valore della tua quota.',
    
    // CTA
    'home.cta.title': 'Pronto a Iniziare a Minare Bitcoin?',
    'home.cta.subtitle': 'Unisciti a {count} possessori di token che possiedono vero hardware per mining Bitcoin.',
    'home.cta.getStarted': 'Inizia Ora',
    
    // Footer
    'footer.product': 'Prodotto',
    'footer.affiliates': 'Affiliati',
    'footer.staking': 'Staking',
    'footer.resources': 'Risorse',
    'footer.faq': 'FAQ',
    'footer.docs': 'Documentazione',
    'footer.company': 'Azienda',
    'footer.about': 'Chi Siamo',
    'footer.contact': 'Contatti',
    'footer.terms': 'Termini',
    'footer.tagline': 'Vero hardware per mining Bitcoin tokenizzato per tutti.',
    'footer.rights': '© 2024 HashBurst. Tutti i diritti riservati.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Bentornato, {email}',
    'dashboard.totalInvested': 'Investimento Totale',
    'dashboard.tokensOwned': 'Token Posseduti',
    'dashboard.currentValue': 'Valore Attuale',
    'dashboard.referralEarnings': 'Guadagni Referral',
    'dashboard.buyMore': 'Compra Altri Token',
    'dashboard.buyMore.desc': 'Aumenta la tua potenza di mining',
    'dashboard.buyMore.cta': 'Compra Ora',
    'dashboard.referral': 'Programma Referral',
    'dashboard.referral.desc': 'Guadagna fino al 17.5%',
    'dashboard.referral.cta': 'Vedi Dettagli',
    'dashboard.staking': 'Metti in Staking i Token',
    'dashboard.staking.desc': 'Blocca per ricevere bonus',
    'dashboard.staking.cta': 'Inizia Staking',
    'dashboard.activity': 'Attività Recente',
    'dashboard.noActivity': 'Nessuna attività recente',
    
    // Staking
    'staking.title': 'Staking Token',
    'staking.subtitle': 'Blocca i tuoi token per ricevere bonus',
    'staking.months': 'Mesi',
    'staking.bonus': 'Bonus sulle distribuzioni di mining',
    'staking.stakeNow': 'Metti in Staking',
    'staking.howItWorks': 'Come Funziona',
    'staking.lock.title': 'Blocca i Tuoi Token',
    'staking.lock.desc': 'Scegli un periodo di staking e blocca i tuoi token',
    'staking.earn.title': 'Guadagna Bonus',
    'staking.earn.desc': 'Ricevi distribuzioni di mining moltiplicate',
    
    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Domande frequenti',
    'faq.q1': 'Cos\'è HashBurst?',
    'faq.a1': 'HashBurst tokenizza vero hardware per mining Bitcoin. Ogni token rappresenta proprietà di equipaggiamento mining reale che genera Bitcoin 24/7.',
    'faq.q2': 'Come compro i token?',
    'faq.a2': 'Registrati, collega il wallet e acquista token durante la vendita. Prezzo iniziale $0.06 per token.',
    'faq.q3': 'Cos\'è il programma referral?',
    'faq.a3': 'Guadagna 10% sui referral diretti, 5% sul livello 2 e 2.5% sul livello 3. Plus bonus struttura quando la tua rete raggiunge 50 persone.',
    'faq.q4': 'Posso mettere in staking i token?',
    'faq.a4': 'Sì! Blocca token per 3, 6 o 12 mesi per guadagnare moltiplicatori bonus sulle distribuzioni di mining (25%, 50%, o 100%).',
    'faq.q5': 'Come vengono bruciati i token?',
    'faq.a5': 'I ricavi del mining vengono usati per riacquistare e bruciare token dal mercato, riducendo l\'offerta e aumentando il valore per i possessori.',
    
    // About
    'about.title': 'Chi Siamo',
    'about.subtitle': 'Vero mining Bitcoin, tokenizzato',
    'about.mission': 'La Nostra Missione',
    'about.mission.text': 'HashBurst democratizza il mining di Bitcoin tokenizzando vero hardware da mining. Ogni token rappresenta proprietà di equipaggiamento mining reale che genera Bitcoin 24/7.',
    'about.why': 'Perché HashBurst?',
    'about.why.1': 'Proprietà hardware reale',
    'about.why.2': 'Operazioni trasparenti',
    'about.why.3': 'Tokenomics deflazionistica',
    'about.why.4': 'Guidato dalla community',
    
    // Contact
    'contact.title': 'Contattaci',
    'contact.subtitle': 'Mettiti in contatto',
    'contact.name': 'Nome',
    'contact.name.placeholder': 'Il tuo nome',
    'contact.email': 'Email',
    'contact.email.placeholder': 'tua@email.com',
    'contact.message': 'Messaggio',
    'contact.message.placeholder': 'Il tuo messaggio...',
    'contact.send': 'Invia Messaggio',
    
    // Terms
    'terms.title': 'Termini di Servizio',
    'terms.updated': 'Ultimo aggiornamento: Dicembre 2024',
    'terms.1.title': '1. Accettazione dei Termini',
    'terms.1.text': 'Accedendo a HashBurst, accetti questi termini.',
    'terms.2.title': '2. Vendita Token',
    'terms.2.text': 'I token sono venduti così come sono. Nessun rimborso dopo l\'acquisto.',
    'terms.3.title': '3. Operazioni di Mining',
    'terms.3.text': 'I ricavi del mining possono variare. Nessun ritorno garantito.',
    'terms.4.title': '4. Programma Referral',
    'terms.4.text': 'I guadagni referral sono soggetti alle regole del programma e possono cambiare.',
    
    // Docs
    'docs.title': 'Documentazione',
    'docs.subtitle': 'Documentazione tecnica',
    'docs.getting.title': 'Per Iniziare',
    'docs.getting.text': 'HashBurst è una piattaforma di mining Bitcoin tokenizzata.',
    'docs.getting.step1': 'Crea un account',
    'docs.getting.step2': 'Acquista token',
    'docs.getting.step3': 'Inizia a guadagnare dal mining',
    'docs.api.title': 'Documentazione API',
    'docs.api.text': 'Prossimamente',
    
    // Admin
    'admin.title': 'Pannello Admin',
    'admin.subtitle': 'Panoramica e gestione del sistema',
    'admin.totalUsers': 'Utenti Totali',
    'admin.totalRevenue': 'Fatturato Totale',
    'admin.referralEarnings': 'Guadagni Referral',
    'admin.activeReferrers': 'Referrer Attivi',
    'admin.settings': 'Impostazioni Referral',
    'admin.settings.desc': 'Configura tassi commissione e bonus',
    'admin.settings.cta': 'Vedi Impostazioni',
    'admin.users': 'Gestione Utenti',
    'admin.users.desc': 'Gestisci utenti e permessi',
    'admin.users.cta': 'Vedi Utenti',
    
    // Affiliates
    'affiliates.title': 'Programma Affiliati',
    'affiliates.yourLink': 'Il Tuo Link Referral',
    'affiliates.copy': 'Copia Link',
    'affiliates.copied': 'Copiato!',
    'affiliates.stats': 'Le Tue Statistiche',
    'affiliates.direct': 'Referral Diretti',
    'affiliates.network': 'Dimensione Rete',
    'affiliates.earnings': 'Guadagni Totali',
    'affiliates.bonus': 'Bonus Struttura',
    'affiliates.commissions': 'Commissioni per Livello',
    'affiliates.level': 'Livello',
    'affiliates.rate': 'Tasso',
    'affiliates.earned': 'Guadagnato',
    'affiliates.progress': 'Progresso Premio Struttura',
    'affiliates.progress.text': '{count} di {target} persone',
    'affiliates.bonusEarned': 'Bonus Struttura Guadagnato',
    'affiliates.tree': 'Il Tuo Albero Referral',
    'affiliates.recent': 'Commissioni Recenti',
    'affiliates.from': 'Da',
    'affiliates.amount': 'Importo',
    'affiliates.date': 'Data',
    'affiliates.noCommissions': 'Nessuna commissione ancora',
    'affiliates.warning': 'Il programma referral non è attualmente attivo',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.success': 'Successo',
  },
  
  en: {
    // Navigation
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.getStarted': 'Get Started',
    'nav.dashboard': 'Dashboard',
    
    // Homepage
    'home.hero.title1': 'Buy Tokens.',
    'home.hero.title2': 'Own Real Hardware.',
    'home.hero.subtitle': 'HashBurst token holders own real Bitcoin mining hardware. Your tokens represent actual mining power generating Bitcoin 24/7.',
    'home.hero.buyNow': 'Buy Tokens Now',
    'home.hero.viewDashboard': 'View Dashboard',
    
    // Stats
    'stats.revenue': 'Total Revenue',
    'stats.hashPower': 'Hash Power',
    'stats.tokensBurned': 'Tokens Burned',
    'stats.holders': 'Token Holders',
    
    // How it works
    'home.how.title': 'Simple. Transparent. Profitable.',
    'home.how.subtitle': 'Buy HashBurst tokens and automatically own a share of real Bitcoin mining hardware.',
    'home.how.step1.title': '1. Buy Tokens',
    'home.how.step1.desc': 'Purchase HashBurst tokens during our token sale. Starting at $0.06 per token.',
    'home.how.step2.title': '2. Own Hardware',
    'home.how.step2.desc': 'Your tokens represent ownership of real mining equipment generating Bitcoin.',
    'home.how.step3.title': '3. Earn Bitcoin',
    'home.how.step3.desc': 'Mining revenue is used to buy back and burn tokens, increasing your share value.',
    
    // CTA
    'home.cta.title': 'Ready to Start Mining Bitcoin?',
    'home.cta.subtitle': 'Join {count} token holders who own real Bitcoin mining hardware.',
    'home.cta.getStarted': 'Get Started Now',
    
    // Footer
    'footer.product': 'Product',
    'footer.affiliates': 'Affiliates',
    'footer.staking': 'Staking',
    'footer.resources': 'Resources',
    'footer.faq': 'FAQ',
    'footer.docs': 'Documentation',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms',
    'footer.tagline': 'Real Bitcoin mining hardware tokenized for everyone.',
    'footer.rights': '© 2024 HashBurst. All rights reserved.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back, {email}',
    'dashboard.totalInvested': 'Total Invested',
    'dashboard.tokensOwned': 'Tokens Owned',
    'dashboard.currentValue': 'Current Value',
    'dashboard.referralEarnings': 'Referral Earnings',
    'dashboard.buyMore': 'Buy More Tokens',
    'dashboard.buyMore.desc': 'Increase your mining power',
    'dashboard.buyMore.cta': 'Buy Now',
    'dashboard.referral': 'Referral Program',
    'dashboard.referral.desc': 'Earn up to 17.5%',
    'dashboard.referral.cta': 'View Details',
    'dashboard.staking': 'Stake Tokens',
    'dashboard.staking.desc': 'Lock for bonus rewards',
    'dashboard.staking.cta': 'Start Staking',
    'dashboard.activity': 'Recent Activity',
    'dashboard.noActivity': 'No recent activity',
    
    // Staking
    'staking.title': 'Token Staking',
    'staking.subtitle': 'Lock your tokens for bonus rewards',
    'staking.months': 'Months',
    'staking.bonus': 'Bonus on mining distributions',
    'staking.stakeNow': 'Stake Now',
    'staking.howItWorks': 'How It Works',
    'staking.lock.title': 'Lock Your Tokens',
    'staking.lock.desc': 'Choose a staking period and lock your tokens',
    'staking.earn.title': 'Earn Bonus Rewards',
    'staking.earn.desc': 'Receive multiplied mining distributions',
    
    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Frequently asked questions',
    'faq.q1': 'What is HashBurst?',
    'faq.a1': 'HashBurst tokenizes real Bitcoin mining hardware. Each token represents ownership of actual mining equipment generating Bitcoin 24/7.',
    'faq.q2': 'How do I buy tokens?',
    'faq.a2': 'Sign up, connect your wallet, and purchase tokens during the token sale. Starting price is $0.06 per token.',
    'faq.q3': 'What is the referral program?',
    'faq.a3': 'Earn 10% on direct referrals, 5% on level 2, and 2.5% on level 3. Plus structure bonuses when your network reaches 50 people.',
    'faq.q4': 'Can I stake my tokens?',
    'faq.a4': 'Yes! Lock tokens for 3, 6, or 12 months to earn bonus multipliers on mining distributions (25%, 50%, or 100%).',
    'faq.q5': 'How are tokens burned?',
    'faq.a5': 'Mining revenue is used to buy back and burn tokens from the market, reducing supply and increasing value for holders.',
    
    // About
    'about.title': 'About HashBurst',
    'about.subtitle': 'Real Bitcoin mining, tokenized',
    'about.mission': 'Our Mission',
    'about.mission.text': 'HashBurst democratizes Bitcoin mining by tokenizing real mining hardware. Every token represents ownership of actual mining equipment generating Bitcoin 24/7.',
    'about.why': 'Why HashBurst?',
    'about.why.1': 'Real hardware ownership',
    'about.why.2': 'Transparent operations',
    'about.why.3': 'Deflationary tokenomics',
    'about.why.4': 'Community-driven',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch',
    'contact.name': 'Name',
    'contact.name.placeholder': 'Your name',
    'contact.email': 'Email',
    'contact.email.placeholder': 'your@email.com',
    'contact.message': 'Message',
    'contact.message.placeholder': 'Your message...',
    'contact.send': 'Send Message',
    
    // Terms
    'terms.title': 'Terms of Service',
    'terms.updated': 'Last updated: December 2024',
    'terms.1.title': '1. Acceptance of Terms',
    'terms.1.text': 'By accessing HashBurst, you agree to these terms.',
    'terms.2.title': '2. Token Sale',
    'terms.2.text': 'Tokens are sold as-is. No refunds after purchase.',
    'terms.3.title': '3. Mining Operations',
    'terms.3.text': 'Mining revenue may vary. No guaranteed returns.',
    'terms.4.title': '4. Referral Program',
    'terms.4.text': 'Referral earnings are subject to program rules and may change.',
    
    // Docs
    'docs.title': 'Documentation',
    'docs.subtitle': 'Technical documentation',
    'docs.getting.title': 'Getting Started',
    'docs.getting.text': 'HashBurst is a tokenized Bitcoin mining platform.',
    'docs.getting.step1': 'Create an account',
    'docs.getting.step2': 'Purchase tokens',
    'docs.getting.step3': 'Start earning from mining',
    'docs.api.title': 'API Documentation',
    'docs.api.text': 'Coming soon',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.subtitle': 'System overview and management',
    'admin.totalUsers': 'Total Users',
    'admin.totalRevenue': 'Total Revenue',
    'admin.referralEarnings': 'Referral Earnings',
    'admin.activeReferrers': 'Active Referrers',
    'admin.settings': 'Referral Settings',
    'admin.settings.desc': 'Configure commission rates and bonuses',
    'admin.settings.cta': 'View Settings',
    'admin.users': 'User Management',
    'admin.users.desc': 'Manage users and permissions',
    'admin.users.cta': 'View Users',
    
    // Affiliates
    'affiliates.title': 'Affiliate Program',
    'affiliates.yourLink': 'Your Referral Link',
    'affiliates.copy': 'Copy Link',
    'affiliates.copied': 'Copied!',
    'affiliates.stats': 'Your Stats',
    'affiliates.direct': 'Direct Referrals',
    'affiliates.network': 'Network Size',
    'affiliates.earnings': 'Total Earnings',
    'affiliates.bonus': 'Structure Bonus',
    'affiliates.commissions': 'Commission Breakdown',
    'affiliates.level': 'Level',
    'affiliates.rate': 'Rate',
    'affiliates.earned': 'Earned',
    'affiliates.progress': 'Structure Bonus Progress',
    'affiliates.progress.text': '{count} of {target} people',
    'affiliates.bonusEarned': 'Structure Bonus Earned',
    'affiliates.tree': 'Your Referral Tree',
    'affiliates.recent': 'Recent Commissions',
    'affiliates.from': 'From',
    'affiliates.amount': 'Amount',
    'affiliates.date': 'Date',
    'affiliates.noCommissions': 'No commissions yet',
    'affiliates.warning': 'Referral program is not currently active',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('it');

  useEffect(() => {
    // Load saved language
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'it' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[language][key as keyof typeof translations['it']] || key;
    
    // Replace parameters
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, String(params[param]));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
