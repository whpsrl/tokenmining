export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-50 py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold mb-4 gradient-text">Terms of Service</h1>
        <p className="text-white/70 mb-12">Last updated: December 2024</p>
        
        <div className="card-dark p-8 space-y-6 text-white/70">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing HashBurst, you agree to these terms.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">2. Token Sale</h2>
            <p>Tokens are sold as-is. No refunds after purchase.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">3. Mining Operations</h2>
            <p>Mining revenue may vary. No guaranteed returns.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">4. Referral Program</h2>
            <p>Referral earnings are subject to program rules and may change.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
