import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PropertyCardProps {
  property: Property;
  key?: React.Key;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300"
    >
      <Link to={`/property/${property.id}`} className="block relative aspect-[4/3] overflow-hidden bg-stone-100">
        {property.image_url ? (
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
             <MapPin size={48} />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-900 shadow-sm">
          {property.category}
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-2 font-sans">
           <MapPin size={12} className="mr-1" />
           {property.location}
        </div>
        <h3 className="text-xl font-serif text-stone-900 mb-4 group-hover:text-amber-700 transition-colors line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex justify-between items-center pt-4 border-t border-stone-50">
          <div>
             <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 font-sans mb-1">Monthly Rent</span>
             <span className="text-xl font-serif text-stone-900 leading-none">৳ {property.rent.toLocaleString()}</span>
          </div>
          <Link 
            to={`/property/${property.id}`}
            className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-900 hover:bg-stone-900 hover:text-white transition-all shadow-sm"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
