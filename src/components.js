import { getCurrentProfile, supabase } from './auth.js';

export async function injectNavbar() {
  const data = await getCurrentProfile();
  const navbar = document.createElement('nav');
  navbar.className = "sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100";
  
  const authLinks = data?.user 
    ? `
      <a href="/dashboard.html" class="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider">Dashboard</a>
      <div class="flex items-center space-x-4">
        <div class="flex flex-col items-end mr-2">
          <span class="text-xs font-semibold text-stone-900 uppercase tracking-tighter">${data.profile?.role}</span>
          <span class="text-xs text-stone-500 whitespace-nowrap">${data.user.email}</span>
        </div>
        <button id="logout-btn" class="p-2 text-stone-500 hover:text-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </button>
      </div>
    `
    : `
      <a href="/login.html" class="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider">Sign In</a>
      <a href="/register.html" class="bg-stone-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all uppercase tracking-widest shadow-sm">Join</a>
    `;

  navbar.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20 items-center">
        <div class="flex items-center">
          <a href="/index.html" class="flex items-center space-x-2 group">
            <span class="text-2xl font-serif tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">HomeNesty</span>
          </a>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="/explore.html" class="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider">Explore</a>
          ${authLinks}
        </div>
      </div>
    </div>
  `;
  
  document.body.prepend(navbar);
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await supabase.auth.signOut();
      window.location.reload();
    };
  }
}

export function injectFooter() {
  const footer = document.createElement('footer');
  footer.className = "bg-stone-50 border-t border-stone-200 py-12";
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-xl font-serif mb-4 tracking-tight">HomeNesty</h3>
          <p class="text-stone-500 max-w-sm font-sans text-sm leading-relaxed">
            Reshaping the rental landscape in Bangladesh. A transparent, secure, and direct connection for landlords and tenants.
          </p>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 font-sans">Platform</h4>
          <ul class="space-y-4">
            <li><a href="/explore.html" class="text-sm text-stone-600 hover:text-stone-900 transition-colors">Explore Homes</a></li>
            <li><a href="#" class="text-sm text-stone-600 hover:text-stone-900 transition-colors">How it works</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 font-sans">Connect</h4>
          <ul class="space-y-4">
            <li><a href="#" class="text-sm text-stone-600 hover:text-stone-900 transition-colors">Support</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-16 pt-8 border-t border-stone-200 text-center">
        <p class="text-xs text-stone-400 font-sans tracking-wide">© ${new Date().getFullYear()} HomeNesty. All rights reserved.</p>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}
