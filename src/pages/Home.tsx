import { Link } from 'react-router-dom';
import { Search, MapPin, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=2000"
            alt="Hero background"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight">
              Home is where your <br />
              <span className="italic font-normal">story begins.</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto font-sans leading-relaxed font-light">
              HomeNesty connects you directly with verified landlords. No middlemen, no hidden fees, just your next home.
            </p>

            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="flex-1 w-full bg-white rounded-xl flex items-center px-4 py-3">
                  <Search className="text-stone-400 mr-3" size={20} />
                  <input
                    type="text"
                    placeholder="Where are you looking for?"
                    className="w-full outline-none text-stone-900 bg-transparent text-sm placeholder-stone-400 font-sans"
                  />
                </div>
                <Link
                  to="/explore"
                  className="w-full md:w-auto bg-stone-900 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-all uppercase tracking-widest"
                >
                  Search
                </Link>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center space-x-6 text-stone-300 text-xs font-sans uppercase tracking-[0.2em]">
              <span className="flex items-center"><CheckCircle2 className="mr-2 text-amber-500" size={12} /> Verified Listings</span>
              <span className="flex items-center"><CheckCircle2 className="mr-2 text-amber-500" size={12} /> Direct Contact</span>
              <span className="flex items-center"><CheckCircle2 className="mr-2 text-amber-500" size={12} /> Easy Maps</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-stone-50 py-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
            {/* These would be logos of partners or trust indicators */}
            <span className="text-xl font-serif tracking-widest">TRANSPARENCY</span>
            <span className="text-xl font-serif tracking-widest">SECURITY</span>
            <span className="text-xl font-serif tracking-widest">COMMUNITY</span>
            <span className="text-xl font-serif tracking-widest">TRUST</span>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-[#fefdfb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3 block">Collections</span>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Featured Homes</h2>
            </div>
            <Link to="/explore" className="group flex items-center text-sm font-semibold uppercase tracking-widest text-stone-900 hover:text-amber-700 transition-colors">
              Explore All <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-stone-100">
                  <img
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1502672260266-1c1ef2d93688' : i === 2 ? '1522708323590-d24dbb6b0267' : '1560448204-61dc36dc98b8'}?auto=format&fit=crop&q=80&w=800`}
                    alt="Property"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-900">
                    Featured
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-serif mb-2 group-hover:text-amber-700 transition-colors">Luxurious Apartment in Dhanmondi</h3>
                  <div className="flex items-center text-stone-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    <span>Dhanmondi, Dhaka</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                    <span className="text-sm font-sans text-stone-500 uppercase tracking-widest">Rent</span>
                    <span className="text-xl font-serif text-stone-900">৳ 25,000 <span className="text-xs font-sans text-stone-400">/mo</span></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-stone-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3 block">Why HomeNesty</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 tracking-tight leading-tight">A better way to find <br />your next living space.</h2>
              
              <div className="space-y-10">
                <div className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif mb-2">Verified Information</h4>
                    <p className="text-sm text-stone-500 font-sans leading-relaxed">Our admin team manually verifies every listing to ensure accuracy and prevent scams.</p>
                  </div>
                </div>
                <div className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif mb-2">Google Maps Integration</h4>
                    <p className="text-sm text-stone-500 font-sans leading-relaxed">Get precise locations and direct navigation to your potential future home.</p>
                  </div>
                </div>
                <div className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif mb-2">No Commission</h4>
                    <p className="text-sm text-stone-500 font-sans leading-relaxed">Direct interaction between tenants and landlords. We don't take a cut.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
                  alt="Modern House"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl max-w-xs border border-stone-100">
                <p className="text-xl font-serif text-stone-900 leading-tight mb-4 italic">"HomeNesty made finding my student flat incredibly easy and safe."</p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200" />
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Nabila R., Student</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-stone-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-600/10 skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-10 tracking-tight">Ready to list your house?</h2>
          <p className="text-stone-300 text-lg mb-12 max-w-xl mx-auto font-sans font-light">Join thousands of landlords who trust HomeNesty to find respectful tenants.</p>
          <Link
            to="/register"
            className="inline-block bg-white text-stone-900 px-12 py-5 rounded-full text-sm font-bold hover:bg-stone-100 transition-all uppercase tracking-[0.2em] shadow-lg shadow-black/20"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
