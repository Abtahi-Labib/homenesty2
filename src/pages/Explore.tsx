import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, Loader2, House } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Explore() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', label: 'All Homes' },
    { id: 'family', label: 'Family' },
    { id: 'student', label: 'Student' },
    { id: 'bachelor', label: 'Bachelor' },
    { id: 'job-holder', label: 'Job Holder' },
  ];

  useEffect(() => {
    fetchProperties();
  }, [category]);

  async function fetchProperties() {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'approved');

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fefdfb] pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-4 block">Discovery</span>
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-stone-900 mb-8">Find your next space.</h1>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div className="relative w-full lg:max-w-md bg-white border border-stone-100 rounded-2xl p-1 shadow-sm flex items-center transition-all focus-within:shadow-xl focus-within:shadow-stone-200/50">
              <Search className="text-stone-400 mx-4" size={20} />
              <input
                type="text"
                placeholder="Search by area or title..."
                className="w-full py-4 text-sm font-sans outline-none text-stone-900 placeholder-stone-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${category === cat.id ? 'bg-stone-900 text-white shadow-lg shadow-stone-200' : 'bg-white border border-stone-100 text-stone-500 hover:border-stone-300'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-stone-400 mb-4" size={40} />
            <p className="text-stone-400 font-serif text-lg italic">Searching the registry...</p>
          </div>
        ) : (
          <>
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-stone-50 rounded-3xl border border-stone-100 italic">
                <House size={48} className="mx-auto text-stone-300 mb-6" />
                <p className="text-stone-500 font-serif text-xl">No properties found. Try a different search or filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
