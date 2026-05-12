import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, LogOut, Search, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-serif tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">
                HomeNesty
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider">
              Explore
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-xs font-semibold text-stone-900 uppercase tracking-tighter">
                      {profile?.role}
                    </span>
                    <span className="text-xs text-stone-500 whitespace-nowrap">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-stone-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-stone-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all uppercase tracking-widest shadow-sm"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/explore" className="block text-lg font-serif" onClick={() => setIsOpen(false)}>Explore</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block text-lg font-serif" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-600 pt-4"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-4 pt-4">
                  <Link to="/login" className="text-center py-2 border border-stone-200 rounded-full" onClick={() => setIsOpen(false)}>Sign In</Link>
                  <Link to="/register" className="text-center py-2 bg-stone-900 text-white rounded-full" onClick={() => setIsOpen(false)}>Join</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
