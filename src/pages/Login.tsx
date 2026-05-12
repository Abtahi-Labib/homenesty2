import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#fefdfb] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl border border-stone-100 shadow-sm"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-stone-500 font-sans text-sm tracking-wide">Continue your journey with HomeNesty</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl font-sans flex items-center">
             <span className="w-1 h-1 bg-red-600 rounded-full mr-3" />
             {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block font-sans">
                Password
              </label>
              <Link to="#" className="text-[10px] uppercase font-bold tracking-widest text-stone-900 hover:text-amber-700 transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="password"
                required
                className="w-full bg-stone-50 border border-stone-100 rounded-xl px-12 py-3.5 outline-none transition-all focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 font-sans placeholder-stone-400 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
                Sign In
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-stone-100 text-center">
          <p className="text-sm text-stone-500 font-sans tracking-wide">
            Don't have an account?{' '}
            <Link to="/register" className="text-stone-900 font-bold hover:text-amber-700 transition-colors ml-1">
              Join HomeNesty
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
