import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper to get current profile
export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return { user, profile };
}

// Redirect if not logged in
export async function requireAuth(roles = []) {
  const data = await getCurrentProfile();
  if (!data?.user) {
    window.location.href = '/login.html';
    return null;
  }
  if (roles.length > 0 && !roles.includes(data.profile?.role)) {
    window.location.href = '/index.html';
    return null;
  }
  return data;
}
