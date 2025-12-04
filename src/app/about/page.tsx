export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-50 py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold mb-4 gradient-text">About HashBurst</h1>
        <p className="text-white/70 mb-12">Real Bitcoin mining, tokenized</p>
        
        <div className="card-dark p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-white/70">
            HashBurst democratizes Bitcoin mining by tokenizing real mining hardware. 
            Every token represents ownership of actual mining equipment generating Bitcoin 24/7.
          </p>
        </div>

        <div className="card-dark p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Why HashBurst?</h2>
          <ul className="space-y-3 text-white/70">
            <li>✅ Real hardware ownership</li>
            <li>✅ Transparent operations</li>
            <li>✅ Deflationary tokenomics</li>
            <li>✅ Community-driven</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
