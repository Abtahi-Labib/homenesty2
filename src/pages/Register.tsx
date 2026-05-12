import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User as UserIcon, Phone, UserCircle, Briefcase, GraduationCap, Users, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName,
        phone,
        role,
      });

      if (profileError) {
        setError('Error creating profile: ' + profileError.message);
        setLoading(false);
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#fefdfb] px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white p-10 rounded-3xl border border-stone-100 shadow-sm"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-2 tracking-tight">Create Account</h1>
          <p className="text-stone-500 font-sans text-sm tracking-wide">Join our community and find your next home</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl font-sans flex items-center">
             <span className="w-1 h-1 bg-red-600 rounded-full mr-3" />
             {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-12 py-3.5 outline-none transition-all focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-sans placeholder-stone-400 text-sm"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="tel"
                  required
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-12 py-3.5 outline-none transition-all focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-sans placeholder-stone-400 text-sm"
                  placeholder="+880 1XXX-XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-12 py-3.5 outline-none transition-all focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-sans placeholder-stone-400 text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="password"
                  required
                  min={6}
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-12 py-3.5 outline-none transition-all focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-sans placeholder-stone-400 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
             <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 block font-sans text-center">
                I am a...
             </label>
             <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button
                   type="button"
                   onClick={() => setRole('tenant')}
                   className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all space-y-3 ${role === 'tenant' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-100 text-stone-500 hover:border-stone-300'}`}
                >
                   <UserCircle size={32} />
                   <span className="text-sm font-bold uppercase tracking-wider">Tenant</span>
                </button>
                <button
                   type="button"
                   onClick={() => setRole('landlord')}
                   className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all space-y-3 ${role === 'landlord' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-100 text-stone-500 hover:border-stone-300'}`}
                >
                   <Briefcase size={32} />
                   <span className="text-sm font-bold uppercase tracking-wider">Landlord</span>
                </button>
             </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-4 rounded-xl font-semibold uppercase tracking-widest text-sm hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center group"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-stone-100 text-center">
          <p className="text-sm text-stone-500 font-sans tracking-wide">
            Already have an account?{' '}
            <Link to="/login" className="text-stone-900 font-bold hover:text-amber-700 transition-colors ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
