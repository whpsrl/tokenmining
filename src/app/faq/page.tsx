export default function FAQPage() {
  const faqs = [
    {
      q: "What is HashBurst?",
      a: "HashBurst tokenizes real Bitcoin mining hardware. Each token represents ownership of actual mining equipment generating Bitcoin 24/7."
    },
    {
      q: "How do I buy tokens?",
      a: "Sign up, connect your wallet, and purchase tokens during the token sale. Starting price is $0.06 per token."
    },
    {
      q: "What is the referral program?",
      a: "Earn 10% on direct referrals, 5% on level 2, and 2.5% on level 3. Plus structure bonuses when your network reaches 50 people."
    },
    {
      q: "Can I stake my tokens?",
      a: "Yes! Lock tokens for 3, 6, or 12 months to earn bonus multipliers on mining distributions (25%, 50%, or 100%)."
    },
    {
      q: "How are tokens burned?",
      a: "Mining revenue is used to buy back and burn tokens from the market, reducing supply and increasing value for holders."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-50 py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold mb-4 gradient-text">FAQ</h1>
        <p className="text-white/70 mb-12">Frequently asked questions</p>
        
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="card-dark p-6">
              <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
              <p className="text-white/70">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
