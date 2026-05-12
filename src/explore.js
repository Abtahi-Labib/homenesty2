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
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = "group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300";
      card.innerHTML = `
        <a href="/property.html?id=${p.id}" class="block relative aspect-[4/3] overflow-hidden bg-stone-100">
          <img src="${p.image_url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-900 shadow-sm">
            ${p.category}
          </div>
        </a>
        <div class="p-6">
          <div class="flex items-center text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-2 font-sans">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
             ${p.location}
          </div>
          <h3 class="text-xl font-serif text-stone-900 mb-4 group-hover:text-amber-700 transition-colors line-clamp-1">${p.title}</h3>
          <div class="flex justify-between items-center pt-4 border-t border-stone-50">
            <div>
               <span class="block text-[10px] font-bold uppercase tracking-widest text-stone-400 font-sans mb-1">Monthly Rent</span>
               <span class="text-xl font-serif text-stone-900 leading-none">৳ ${p.rent.toLocaleString()}</span>
            </div>
            <a href="/property.html?id=${p.id}" class="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-900 hover:bg-stone-900 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
}

categoryBtns.forEach(btn => {
  btn.onclick = () => {
    categoryBtns.forEach(b => {
      b.classList.remove('bg-stone-900', 'text-white', 'shadow-lg');
      b.classList.add('bg-white', 'border', 'border-stone-100', 'text-stone-500');
    });
    btn.classList.remove('bg-white', 'border', 'border-stone-100', 'text-stone-500');
    btn.classList.add('bg-stone-900', 'text-white', 'shadow-lg');
    currentCategory = btn.dataset.cat;
    fetchProperties();
  };
});

searchInput.oninput = renderProperties;

fetchProperties();
