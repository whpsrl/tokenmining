export default function DocsPage() {
  return (
    <div className="min-h-screen bg-dark-50 py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold mb-4 gradient-text">Documentation</h1>
        <p className="text-white/70 mb-12">Technical documentation</p>
        
        <div className="card-dark p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
          <p className="text-white/70 mb-4">HashBurst is a tokenized Bitcoin mining platform.</p>
          <ol className="list-decimal list-inside space-y-2 text-white/70">
            <li>Create an account</li>
            <li>Purchase tokens</li>
            <li>Start earning from mining</li>
          </ol>
        </div>

        <div className="card-dark p-8">
          <h2 className="text-2xl font-bold text-white mb-4">API Documentation</h2>
          <p className="text-white/70">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
