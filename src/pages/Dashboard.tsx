import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import { Plus, Eye, Edit, Trash2, Check, X, Loader2, User, Building2, MapPin, ExternalLink, ShieldCheck, Home as House } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Property Form State
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    location: '',
    rent: '',
    rooms: '',
    category: 'family',
    image_url: '',
    map_link: '',
  });

  useEffect(() => {
    if (profile) {
      if (profile.role === 'admin') {
        fetchAllProperties();
      } else {
        fetchUserProperties();
      }
    }
  }, [profile]);

  async function fetchUserProperties() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllProperties() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProperty(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('properties').insert({
        ...newProperty,
        rent: parseInt(newProperty.rent),
        rooms: parseInt(newProperty.rooms),
        owner_id: user.id,
        status: 'pending', // Always start as pending
      });

      if (error) throw error;
      
      setIsAdding(false);
      setNewProperty({
        title: '',
        description: '',
        location: '',
        rent: '',
        rooms: '',
        category: 'family',
        image_url: '',
        map_link: '',
      });
      fetchUserProperties();
    } catch (err) {
      alert('Error adding property: ' + (err as any).message);
    }
  }

  async function handleVerify(id: string, status: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      fetchAllProperties();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      profile?.role === 'admin' ? fetchAllProperties() : fetchUserProperties();
    } catch (err) {
        console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-2 block font-sans">
              Account
            </span>
            <h1 className="text-4xl font-serif tracking-tight text-stone-900">
              Welcome, {profile?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-stone-500 font-sans text-sm mt-1">Manage your rental listings and preferences</p>
          </div>

          {(profile?.role === 'landlord' || profile?.role === 'admin') && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-stone-900 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center shadow-lg shadow-stone-200"
            >
              <Plus size={18} className="mr-2" />
              Add Property
            </button>
          )}
        </div>

        {/* Admin/Landlord Content */}
        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center">
               <Loader2 className="animate-spin text-stone-400 mb-4" size={40} />
               <p className="text-stone-500 font-serif italic text-lg tracking-wide">Syncing your dashboard...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-stone-900 flex items-center">
                   <Building2 size={20} className="mr-3 text-stone-400" />
                   {profile?.role === 'admin' ? 'Recent Global Listings' : 'My Listings'}
                </h2>
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-white border border-stone-100 px-3 py-1 rounded-full">
                   {properties.length} Total
                </div>
              </div>

              {properties.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {properties.map((p) => (
                    <motion.div
                      layout
                      key={p.id}
                      className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center gap-6"
                    >
                      <div className="w-full md:w-24 h-24 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                         {p.image_url ? (
                            <img src={p.image_url} className="w-full h-full object-cover" />
                         ) : (
                            <House className="w-full h-full p-6 text-stone-300" />
                         )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="text-lg font-serif text-stone-900">{p.title}</h3>
                           <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                             p.status === 'approved' ? 'bg-green-50 text-green-700' : 
                             p.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                           }`}>
                             {p.status}
                           </span>
                        </div>
                        <div className="flex items-center text-xs text-stone-400 font-sans space-x-4">
                           <div className="flex items-center"><MapPin size={12} className="mr-1" /> {p.location}</div>
                           <div>৳ {p.rent.toLocaleString()}</div>
                           <div className="uppercase tracking-widest text-[10px]">{p.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-stone-50">
                        {profile?.role === 'admin' && p.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerify(p.id, 'approved')}
                              className="flex-1 md:flex-none p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              title="Approve"
                            >
                              <Check size={18} className="mx-auto" />
                            </button>
                            <button
                              onClick={() => handleVerify(p.id, 'rejected')}
                              className="flex-1 md:flex-none p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Reject"
                            >
                              <X size={18} className="mx-auto" />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/property/${p.id}`}
                          className="flex-1 md:flex-none p-2 bg-stone-50 text-stone-600 rounded-lg hover:bg-stone-900 hover:text-white transition-all shadow-sm"
                          title="View"
                        >
                          <Eye size={18} className="mx-auto" />
                        </Link>
                        <button
                           onClick={() => handleDelete(p.id)}
                           className="flex-1 md:flex-none p-2 text-stone-400 hover:text-red-600 transition-all"
                           title="Delete"
                        >
                           <Trash2 size={18} className="mx-auto" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 border-dashed">
                  <p className="text-stone-400 font-serif italic text-lg tracking-wide">No listings to display.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Property Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-stone-900/60 backdrop-blur-sm p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-12 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 p-2"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-2 block">Create Listing</span>
                <h2 className="text-3xl font-serif tracking-tight text-stone-900">Add New Property</h2>
                <p className="text-stone-500 font-sans text-sm mt-2">Every listing is verified by our team before going live</p>
              </div>

              <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Property Title</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 text-sm font-sans"
                      placeholder="e.g. Luxury 3BHK Flat in Bashundhara"
                      value={newProperty.title}
                      onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Location</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 text-sm font-sans"
                      placeholder="e.g. Block C, Bashundhara R/A, Dhaka"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Monthly Rent (৳)</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 text-sm font-sans"
                        placeholder="15000"
                        value={newProperty.rent}
                        onChange={(e) => setNewProperty({ ...newProperty, rent: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Total Rooms</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 text-sm font-sans"
                        placeholder="3"
                        value={newProperty.rooms}
                        onChange={(e) => setNewProperty({ ...newProperty, rooms: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Category</label>
                    <select
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 text-sm font-sans appearance-none"
                      value={newProperty.category}
                      onChange={(e) => setNewProperty({ ...newProperty, category: e.target.value })}
                    >
                      <option value="family">Family</option>
                      <option value="student">Student</option>
                      <option value="bachelor">Bachelor</option>
                      <option value="job-holder">Job Holder</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Description</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 text-sm font-sans resize-none"
                      placeholder="Detailed description of the property, features, and requirements..."
                      value={newProperty.description}
                      onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Image URL (Unsplash Link)</label>
                    <input
                      type="url"
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 text-sm font-sans"
                      placeholder="https://images.unsplash.com/..."
                      value={newProperty.image_url}
                      onChange={(e) => setNewProperty({ ...newProperty, image_url: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Google Maps Link</label>
                    <input
                      type="url"
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-stone-900 text-sm font-sans"
                      placeholder="https://goo.gl/maps/..."
                      value={newProperty.map_link}
                      onChange={(e) => setNewProperty({ ...newProperty, map_link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-6">
                  <button
                    type="submit"
                    className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
                  >
                    Submit for Verification
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
