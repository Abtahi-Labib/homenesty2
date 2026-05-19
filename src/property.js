import { supabase } from './auth.js';
import { injectNavbar, injectFooter } from './components.js';

injectNavbar();
injectFooter();

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) {
    window.location.href = '/explore.html';
    return;
  }

  try {
    const { data: p, error } = await supabase
      .from('properties')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    renderProperty(p);
  } catch (err) {
    console.error(err);
    document.getElementById('loading').innerHTML = '<p class="text-red-500">Property not found.</p>';
  }
}

function renderProperty(p) {
  const details = document.getElementById('property-details');
  const loading = document.getElementById('loading');
  loading.classList.add('hidden');

  const owner = p.profiles;
  const categoryLabels = {
    'family': 'Family Estate',
    'student': 'Student Studio',
    'bachelor': 'Professional Suite',
    'hotel': 'Vacation & Hotel'
  };
 
   details.innerHTML = `
     <div class="flex-1">
      <div class="aspect-[16/10] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative group">
        <img src="${p.image_url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
        <div class="absolute top-8 left-8">
           <span class="bg-white/90 backdrop-blur px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-primary-navy border border-slate-100 shadow-sm">${categoryLabels[p.category] || p.category}</span>
        </div>
      </div>

      <div class="mt-16">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-10 border-b border-slate-100">
          <div>
            <h1 class="text-5xl md:text-6xl font-serif tracking-tight text-primary-navy mb-4">${p.title}</h1>
            <p class="text-xl font-sans text-slate-400 flex items-center">
              <svg class="w-5 h-5 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              ${p.location}
            </p>
          </div>
          <div class="text-right">
             <span class="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Monthly Investment</span>
             <span class="text-4xl font-serif text-primary-navy">৳ ${p.rent.toLocaleString()}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-16">
           <div class="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center group hover:bg-primary-navy transition-all duration-500">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-3 font-sans group-hover:text-white/50">Accommodations</span>
              <span class="text-2xl font-serif text-primary-navy group-hover:text-white">${p.rooms} Rooms</span>
           </div>
           <div class="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center group hover:bg-primary-navy transition-all duration-500">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-3 font-sans group-hover:text-white/50">Classification</span>
              <span class="text-2xl font-serif text-primary-navy group-hover:text-white capitalize">${categoryLabels[p.category] || p.category}</span>
           </div>
        </div>

        <div class="prose prose-slate max-w-none">
          <h3 class="text-2xl font-serif text-primary-navy mb-6">About this Sanctuary</h3>
          <p class="text-slate-500 font-sans leading-[2] text-lg whitespace-pre-line font-light">${p.description}</p>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-[400px]">
      <div class="sticky top-32 space-y-10">
        <div class="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
           <div class="mb-10 pb-8 border-b border-slate-50">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 block font-sans">Lease Premium</span>
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-serif text-primary-navy">৳ ${p.rent.toLocaleString()}</span>
                <span class="text-sm text-slate-400 font-sans">/mo</span>
              </div>
           </div>
           <a href="${p.map_link || '#'}" target="_blank" class="w-full btn-luxury py-5 flex items-center justify-center gap-3">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
             Locate on Map
           </a>
           <button id="book-btn" class="w-full mt-6 bg-[#b89130] text-white py-5 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-[#a67d26] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-luxury-gold/20">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
             Request Booking
           </button>
           <button id="favorite-btn" class="w-full mt-4 border border-slate-200 text-slate-500 py-4 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
             <svg id="fav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.046 3 5.5L12 21l7-7Z"/></svg>
             <span id="fav-text">Curate to Portfolio</span>
           </button>
        </div>

        ${owner ? `
          <div class="luxury-gradient p-10 rounded-[2.5rem] text-white shadow-xl">
            <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-8 block font-sans">Proprietor Details</span>
            <div class="flex items-center gap-5 mb-6">
              <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-serif border border-white/5 uppercase">
                ${owner.full_name[0]}
              </div>
              <div>
                <h5 class="text-2xl font-serif text-white tracking-tight">${owner.full_name}</h5>
                <p class="text-xs text-luxury-silver uppercase tracking-widest mt-1">Verified Landlord</p>
              </div>
            </div>
            <a href="tel:${owner.phone}" class="flex items-center text-sm text-slate-300 hover:text-white transition-colors gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              ${owner.phone}
            </a>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Listeners
  const bookBtn = document.getElementById('book-btn');
  const favBtn = document.getElementById('favorite-btn');

  bookBtn.onclick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.location.href = '/login.html';

    const { error } = await supabase.from('bookings').insert([{ 
      property_id: p.id, 
      user_id: user.id 
    }]);

    if (error) alert('Booking request failed.');
    else {
      bookBtn.innerHTML = 'Request Sent';
      bookBtn.disabled = true;
      bookBtn.classList.add('bg-green-600');
    }
  };

  favBtn.onclick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.location.href = '/login.html';

    const pid = p.id;
    const { error } = await supabase.from('favorites').insert([{ user_id: user.id, property_id: pid }]);
    
    if (error && error.code === '23505') {
      await supabase.from('favorites').delete().match({ user_id: user.id, property_id: pid });
      document.getElementById('fav-icon').classList.remove('text-red-500');
      document.getElementById('fav-text').innerText = 'Curate to Portfolio';
    } else {
      document.getElementById('fav-icon').classList.add('text-red-500');
      document.getElementById('fav-text').innerText = 'In Portfolio';
    }
  };
}

init();
