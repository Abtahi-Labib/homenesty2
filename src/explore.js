import { supabase } from './auth.js';
import { injectNavbar, injectFooter } from './components.js';

injectNavbar();
injectFooter();

const grid = document.getElementById('property-grid');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const categoryBtns = document.querySelectorAll('.cat-btn');

let properties = [];
let currentCategory = 'all';

async function fetchProperties() {
  grid.innerHTML = '';
  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');

  try {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved');

    if (currentCategory !== 'all') {
      query = query.eq('category', currentCategory);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    properties = data || [];
    renderProperties();
  } catch (err) {
    console.error(err);
  } finally {
    loadingState.classList.add('hidden');
  }
}

function renderProperties() {
  const search = searchInput.value.toLowerCase();
  const filtered = properties.filter(p => 
    p.title.toLowerCase().includes(search) || 
    p.location.toLowerCase().includes(search)
  );

  grid.innerHTML = '';
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    const categoryLabels = {
      'family': 'Family Estate',
      'student': 'Student Studio',
      'bachelor': 'Professional Suite',
      'hotel': 'Vacation & Hotel'
    };

    filtered.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = "card-luxury overflow-hidden group animate-reveal";
      card.style.animationDelay = `${idx * 0.1}s`;
      card.innerHTML = `
        <a href="/property.html?id=${p.id}" class="block relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img src="${p.image_url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-primary-navy shadow-sm border border-slate-100">
            ${categoryLabels[p.category] || p.category}
          </div>
          <button class="fav-btn absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-white/20 shadow-lg" data-id="${p.id}">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.046 3 5.5L12 21l7-7Z"/></svg>
          </button>
        </a>
        <div class="p-8">
          <div class="flex items-center text-luxury-gold text-[9px] font-bold uppercase tracking-[0.2em] mb-3 font-sans opacity-80">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 opacity-50"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
             ${p.location}
          </div>
          <h3 class="text-xl font-serif text-primary-navy mb-5 group-hover:text-luxury-accent transition-colors line-clamp-1">${p.title}</h3>
          <div class="flex justify-between items-center pt-6 border-t border-slate-50">
            <div>
               <span class="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 font-sans mb-1">Monthly Investment</span>
               <span class="text-xl font-serif text-primary-navy font-medium">৳ ${p.rent.toLocaleString()}</span>
            </div>
            <a href="/property.html?id=${p.id}" class="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-primary-navy hover:bg-primary-navy hover:text-white transition-all duration-500 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Favorite Logic
    document.querySelectorAll('.fav-btn').forEach(btn => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.dataset.id;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return window.location.href = '/login.html';

        const { error } = await supabase.from('favorites').insert([{ user_id: user.id, property_id: pid }]);
        if (error && error.code === '23505') {
          await supabase.from('favorites').delete().match({ user_id: user.id, property_id: pid });
          btn.classList.remove('text-red-500');
        } else {
          btn.classList.add('text-red-500', 'animate-pulse');
          setTimeout(() => btn.classList.remove('animate-pulse'), 500);
        }
      };
    });
  }
}

categoryBtns.forEach(btn => {
  btn.onclick = () => {
    categoryBtns.forEach(b => {
      b.classList.remove('bg-primary-navy', 'text-white', 'shadow-lg', 'shadow-primary-navy/20');
      b.classList.add('bg-white', 'border', 'border-slate-100', 'text-slate-500');
    });
    btn.classList.remove('bg-white', 'border', 'border-slate-100', 'text-slate-500');
    btn.classList.add('bg-primary-navy', 'text-white', 'shadow-lg', 'shadow-primary-navy/20');
    currentCategory = btn.dataset.cat;
    fetchProperties();
  };
});

searchInput.oninput = renderProperties;

// Get query from URL if exists
const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get('q');
if (initialQuery) {
  searchInput.value = initialQuery;
}

fetchProperties();
