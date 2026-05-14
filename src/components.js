import { getCurrentProfile, supabase } from './auth.js';

export async function injectNavbar() {
  const data = await getCurrentProfile();
  const navbar = document.createElement('nav');
  navbar.className = "sticky top-0 z-50 nav-blur";
  
  const authLinks = data?.user 
    ? `
      <a href="/dashboard.html" class="text-sm font-medium text-slate-600 hover:text-primary-navy transition-colors uppercase tracking-wider">Dashboard</a>
      <div class="flex items-center space-x-4">
        <div class="flex flex-col items-end mr-2">
          <span class="text-xs font-semibold text-primary-navy uppercase tracking-tighter">${data.profile?.role}</span>
          <span class="text-xs text-slate-500 whitespace-nowrap">${data.user.email}</span>
        </div>
        <button id="logout-btn" class="p-2 text-slate-500 hover:text-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </button>
      </div>
    `
    : `
      <a href="/login.html" class="text-sm font-medium text-slate-600 hover:text-primary-navy transition-colors uppercase tracking-wider">Sign In</a>
      <a href="/register.html" class="btn-luxury px-6 py-2">Join</a>
    `;

  navbar.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20 items-center">
        <div class="flex items-center">
          <a href="/index.html" class="flex items-center space-x-2 group">
            <span class="text-2xl font-serif tracking-tight text-primary-navy group-hover:text-luxury-accent transition-colors">HomeNesty</span>
          </a>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="/explore.html" class="text-sm font-medium text-slate-600 hover:text-primary-navy transition-colors uppercase tracking-wider">Explore</a>
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
  footer.className = "bg-primary-navy text-white/90 py-20 mt-auto";
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-3xl font-serif mb-6 tracking-tight text-white">HomeNesty</h3>
          <p class="text-luxury-silver max-w-sm font-sans text-sm leading-relaxed">
            The premium rental platform for Bangladesh. Experience a seamless connection between elite landlords and verified tenants.
          </p>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-6 font-sans">Discover</h4>
          <ul class="space-y-4 font-light opacity-80">
            <li><a href="/explore.html" class="text-sm hover:text-white transition-colors">Fine Properties</a></li>
            <li><a href="#" class="text-sm hover:text-white transition-colors">The Process</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-6 font-sans">Contact</h4>
          <ul class="space-y-4 font-light opacity-80">
            <li><a href="#" class="text-sm hover:text-white transition-colors">Concierge</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-20 pt-8 border-t border-white/5 text-center">
        <p class="text-[10px] text-luxury-silver font-sans tracking-widest uppercase">© ${new Date().getFullYear()} HomeNesty. Excellence in Real Estate.</p>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}
