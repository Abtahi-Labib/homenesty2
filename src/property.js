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

  details.innerHTML = `
    <div class="flex-1">
      <div class="aspect-[16/10] bg-stone-100 rounded-3xl overflow-hidden shadow-2xl relative">
        <img src="${p.image_url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'}" alt="${p.title}" class="w-full h-full object-cover">
        <div class="absolute top-8 left-8">
           <span class="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-stone-900 border border-stone-100">${p.category}</span>
        </div>
      </div>

      <div class="mt-12">
        <h1 class="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 mb-6">${p.title}</h1>
        <div class="flex items-center text-stone-500 mb-10 pb-8 border-b border-stone-100">
           <span class="text-lg font-sans">${p.location}</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
           <div class="p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center">
              <span class="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-sans">Rooms</span>
              <span class="text-lg font-serif text-stone-900">${p.rooms}</span>
           </div>
           <div class="p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center">
              <span class="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2 font-sans">Rent</span>
              <span class="text-lg font-serif text-stone-900">৳ ${p.rent.toLocaleString()}</span>
           </div>
        </div>

        <p class="text-stone-500 font-sans leading-loose text-lg whitespace-pre-line">${p.description}</p>
      </div>
    </div>

    <div class="w-full lg:w-[400px]">
      <div class="sticky top-32 space-y-8">
        <div class="bg-white border border-stone-100 p-8 rounded-3xl shadow-xl">
           <div class="mb-8 pb-6 border-b border-stone-50">
              <span class="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block font-sans">Monthly Rent</span>
              <span class="text-4xl font-serif text-stone-900">৳ ${p.rent.toLocaleString()}</span>
           </div>
           <a href="${p.map_link || '#'}" target="_blank" class="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center">View on Map</a>
        </div>

        ${owner ? `
          <div class="bg-stone-900 p-8 rounded-3xl text-white">
            <h4 class="text-xs font-bold uppercase tracking-widest text-stone-500 mb-6 font-sans">Landlord Details</h4>
            <h5 class="text-xl font-serif">${owner.full_name}</h5>
            <p class="text-sm mt-2 text-stone-400">${owner.phone}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

init();
