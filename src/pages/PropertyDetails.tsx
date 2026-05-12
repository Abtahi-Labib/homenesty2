import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Property, Profile } from '../types';
import { MapPin, Phone, User, Calendar, Home as House, Maximize2, ShieldCheck, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  async function fetchProperty() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProperty(data);

      if (data) {
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.owner_id)
          .single();
        setOwner(ownerData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefdfb]">
        <div className="flex flex-col items-center">
           <Loader2 className="animate-spin text-stone-200 mb-4" size={48} />
           <p className="text-stone-400 font-serif italic text-xl tracking-tight">Fetching sanctuary details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefdfb]">
        <div className="text-center max-w-md px-4">
           <span className="text-6xl mb-6 block">🍂</span>
           <h2 className="text-3xl font-serif mb-4">Space Not Found</h2>
           <p className="text-stone-500 font-sans mb-8 leading-relaxed">The home you are looking for might have been moved or taken off the registry.</p>
           <Link to="/explore" className="inline-block bg-stone-900 text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-stone-200">
             Explore Available Homes
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Link to="/explore" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors group">
           <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
           Back to Registry
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-16 pb-24">
        {/* Gallery Section */}
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[16/10] bg-stone-100 rounded-3xl overflow-hidden shadow-2xl shadow-stone-200/50 relative group"
          >
            {property.image_url ? (
              <img src={property.image_url} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-200">
                <House size={120} weight="light" />
              </div>
            )}
            <div className="absolute top-8 left-8">
               <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-stone-900 shadow-sm border border-stone-100">
                 {property.category}
               </span>
            </div>
          </motion.div>

          <div className="mt-12">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 mb-6">{property.title}</h1>
            <div className="flex items-center text-stone-500 mb-10 pb-8 border-b border-stone-100">
               <MapPin size={18} className="mr-2 text-amber-600" />
               <span className="text-lg font-sans">{property.location}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
               <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Structure</span>
                  <span className="text-lg font-serif text-stone-900">{property.rooms} Rooms</span>
               </div>
               <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Category</span>
                  <span className="text-lg font-serif text-stone-900 capitalize">{property.category}</span>
               </div>
               <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Rent</span>
                  <span className="text-lg font-serif text-stone-900 whitespace-nowrap">৳ {property.rent.toLocaleString()}</span>
               </div>
               <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Security</span>
                  <span className="text-lg font-serif text-stone-900 flex items-center">
                    Verified <ShieldCheck size={14} className="ml-1 text-green-600" />
                  </span>
               </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-serif tracking-tight text-stone-900">About this haven</h3>
              <p className="text-stone-500 font-sans leading-loose text-lg whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-32 space-y-8">
            {/* Booking Card */}
            <div className="bg-white border border-stone-100 p-8 rounded-3xl shadow-xl shadow-stone-200/40">
               <div className="mb-8 pb-6 border-b border-stone-50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Monthly Rent</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-serif text-stone-900">৳ {property.rent.toLocaleString()}</span>
                    <span className="text-stone-400 text-sm font-sans uppercase tracking-widest">/mo</span>
                  </div>
               </div>

               <div className="space-y-6">
                  {property.map_link && (
                    <a
                      href={property.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-stone-50 text-stone-900 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-stone-100 transition-all border border-stone-100"
                    >
                      <MapPin size={16} className="mr-2" />
                      View on Google Maps
                    </a>
                  )}

                  <button className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 flex items-center justify-center">
                    Request Visitation
                  </button>
                  
                  <p className="text-[10px] text-center text-stone-400 font-sans uppercase tracking-[0.15em]">
                    * Identity verification required for visits
                  </p>
               </div>
            </div>

            {/* Owner Card */}
            {owner && (
              <div className="bg-stone-900 p-8 rounded-3xl text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-6 font-sans relative z-10">Landlord Details</h4>
                <div className="flex items-center mb-8 relative z-10">
                   <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center border border-white/10 mr-4">
                      <User size={28} className="text-stone-500" />
                   </div>
                   <div>
                      <h5 className="text-xl font-serif leading-tight">{owner.full_name}</h5>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 opacity-80">Verified Owner</span>
                   </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-white/10 relative z-10">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-stone-400">Direct Contact</span>
                      <a href={`tel:${owner.phone}`} className="text-sm font-bold uppercase tracking-widest flex items-center hover:text-amber-500 transition-colors">
                        <Phone size={14} className="mr-2" />
                        {owner.phone}
                      </a>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-stone-400">Response Rate</span>
                      <span className="text-xs font-bold uppercase tracking-widest">98% High</span>
                   </div>
                </div>
              </div>
            )}
            
            {/* Guide Info */}
            <div className="p-8 border border-stone-100 rounded-3xl bg-[#fdfdfd]">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 font-sans">Verification Stamp</h4>
               <p className="text-xs text-stone-500 font-sans leading-relaxed mb-6">
                 This property has been vetted by the HomeNesty editorial team for accuracy, location, and landlord reputation.
               </p>
               <div className="flex items-center text-stone-900 group cursor-pointer">
                  <span className="text-[10px] font-bold uppercase tracking-widest border-b border-stone-200 group-hover:border-stone-900 transition-colors py-1">
                    Read Safety Guidelines
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
