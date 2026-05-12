export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-serif mb-4 tracking-tight">HomeNesty</h3>
            <p className="text-stone-500 max-w-sm font-sans text-sm leading-relaxed">
              Reshaping the rental landscape in Bangladesh. A transparent, secure, and direct connection for landlords and tenants.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 font-sans">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Explore Homes</a></li>
              <li><a href="#" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">How it works</a></li>
              <li><a href="#" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">List your property</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 font-sans">Connect</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Support</a></li>
              <li><a href="#" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-stone-400 font-sans tracking-wide">
            © {new Date().getFullYear()} HomeNesty. All rights reserved.
          </p>
          <div className="flex space-x-6">
             <span className="text-xs text-stone-400 border-b border-transparent">Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
