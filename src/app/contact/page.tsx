export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-50 py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold mb-4 gradient-text">Contact Us</h1>
        <p className="text-white/70 mb-12">Get in touch</p>
        
        <div className="card-dark p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input 
                type="text" 
                className="w-full bg-dark-100 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Email</label>
              <input 
                type="email" 
                className="w-full bg-dark-100 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Message</label>
              <textarea 
                rows={5}
                className="w-full bg-dark-100 border border-white/10 rounded-lg px-4 py-3 text-white"
                placeholder="Your message..."
              />
            </div>
            <button type="submit" className="btn-primary px-8 py-3 rounded-lg">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
