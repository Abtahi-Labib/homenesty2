import { requireAuth, supabase } from './auth.js';
import { injectNavbar, injectFooter } from './components.js';

let currentUser = null;

async function init() {
  injectNavbar();
  injectFooter();
  
  const authData = await requireAuth();
  if (!authData) return;
  
  currentUser = authData;
  document.getElementById('welcome-msg').innerText = `Welcome, ${authData.profile?.full_name?.split(' ')[0]}`;
  
  if (authData.profile?.role === 'landlord' || authData.profile?.role === 'admin') {
    document.getElementById('open-modal-btn').classList.remove('hidden');
  }
  
  if (authData.profile?.role === 'admin') {
    document.getElementById('listings-title').innerText = 'Recent Global Listings';
  }

  fetchListings();
  fetchBookings();
  fetchFavorites();
}

async function fetchFavorites() {
  const listEl = document.getElementById('favorites-list');
  listEl.innerHTML = '<p class="text-xs text-slate-400">Opening vault...</p>';

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, properties(*)')
      .eq('user_id', currentUser.user.id);

    if (error) throw error;
    renderFavorites(data || []);
  } catch (err) {
    console.error(err);
  }
}

function renderFavorites(items) {
  const listEl = document.getElementById('favorites-list');
  listEl.innerHTML = '';

  if (items.length === 0) {
    listEl.innerHTML = '<div class="text-sm italic text-slate-400">Your portfolio is empty.</div>';
    return;
  }

  items.forEach(f => {
    const p = f.properties;
    if (!p) return;
    const card = document.createElement('div');
    card.className = "card-luxury overflow-hidden flex items-center p-4 gap-6 group hover:shadow-lg transition-all";
    card.innerHTML = `
      <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img src="${p.image_url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'}" class="w-full h-full object-cover transition-transform group-hover:scale-110">
      </div>
      <div class="flex-1">
        <h4 class="font-serif text-primary-navy leading-tight">${p.title}</h4>
        <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">${p.location}</p>
        <p class="text-xs font-bold text-luxury-gold mt-2">৳ ${p.rent.toLocaleString()}</p>
      </div>
      <a href="/property.html?id=${p.id}" class="p-3 bg-slate-50 text-primary-navy rounded-lg hover:bg-primary-navy hover:text-white transition-all">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
      </a>
    `;
    listEl.appendChild(card);
  });
}

async function fetchBookings() {
  const listEl = document.getElementById('bookings-list');
  listEl.innerHTML = '<p class="text-xs text-slate-400">Syncing registry...</p>';

  try {
    let query = supabase.from('bookings').select('*, properties(*), profiles(*)');
    
    // Landlord sees bookings for their properties
    // Tenant sees their own bookings
    if (currentUser.profile.role === 'tenant') {
       query = query.eq('user_id', currentUser.user.id);
    } else {
       // Filter in JS for simplicity or use join logic in Supabase
       // For now, let's just fetch all and filter if needed or assume landlord
    }

    const { data, error } = await query.order('booking_date', { ascending: false });
    if (error) throw error;
    
    renderBookings(data || []);
  } catch (err) {
    console.error(err);
  }
}

function renderBookings(items) {
  const listEl = document.getElementById('bookings-list');
  listEl.innerHTML = '';

  if (items.length === 0) {
    listEl.innerHTML = '<div class="text-sm italic text-slate-400">No active requests.</div>';
    return;
  }

  items.forEach(b => {
    const card = document.createElement('div');
    card.className = "bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow";
    card.innerHTML = `
      <div class="flex items-center gap-6">
        <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-serif text-primary-navy">
          ${b.properties?.title[0]}
        </div>
        <div>
          <h4 class="font-serif text-primary-navy">${b.properties?.title}</h4>
          <p class="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Requested by ${b.profiles?.full_name}</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${b.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}">${b.status}</span>
      </div>
    `;
    listEl.appendChild(card);
  });
}

async function fetchListings() {
  const listEl = document.getElementById('properties-list');
  listEl.innerHTML = '<p class="text-stone-400">Syncing...</p>';

  try {
    let query = supabase.from('properties').select('*');
    if (currentUser.profile.role !== 'admin') {
      query = query.eq('owner_id', currentUser.user.id);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    
    renderListings(data || []);
  } catch (err) {
    console.error(err);
  }
}

function renderListings(items) {
  const listEl = document.getElementById('properties-list');
  listEl.innerHTML = '';
  
  if (items.length === 0) {
    listEl.innerHTML = '<div class="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 italic font-serif text-slate-400 shadow-sm">No property entries in your portfolio.</div>';
    return;
  }

  items.forEach(p => {
    const item = document.createElement('div');
    item.className = "bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500";
    
    item.innerHTML = `
      <div class="w-full md:w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
        <img src="${p.image_url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
        <div class="absolute inset-0 bg-primary-navy/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div class="flex-1 text-center md:text-left">
        <div class="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
           <h3 class="text-xl font-serif text-primary-navy font-medium">${p.title}</h3>
           <span class="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full w-fit mx-auto md:mx-0 ${p.status === 'approved' ? 'bg-green-50 text-green-700' : p.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-500'}">${p.status}</span>
        </div>
        <div class="text-xs text-slate-400 font-sans flex flex-wrap justify-center md:justify-start gap-4">
           <span class="flex items-center"><svg class="w-3 h-3 mr-1 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>${p.location}</span>
           <span class="text-primary-navy/70 font-medium tracking-wide">৳ ${p.rent.toLocaleString()}</span>
        </div>
      </div>
      <div class="flex items-center gap-4 ml-auto">
        ${currentUser.profile.role === 'admin' && p.status === 'pending' ? `
          <button class="approve-btn p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" data-id="${p.id}" title="Approve"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></button>
          <button class="reject-btn p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" data-id="${p.id}" title="Reject"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="12"/></svg></button>
        ` : ''}
        <a href="/property.html?id=${p.id}" class="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary-navy hover:text-white transition-all shadow-sm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></a>
        <button class="delete-btn p-3 text-slate-300 hover:text-red-600 transition-colors" data-id="${p.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
      </div>
    `;
    listEl.appendChild(item);
  });

  // Attach event listeners
  document.querySelectorAll('.approve-btn').forEach(b => b.onclick = () => updateStatus(b.dataset.id, 'approved'));
  document.querySelectorAll('.reject-btn').forEach(b => b.onclick = () => updateStatus(b.dataset.id, 'rejected'));
  document.querySelectorAll('.delete-btn').forEach(b => b.onclick = () => deleteProperty(b.dataset.id));
}

async function updateStatus(id, status) {
  await supabase.from('properties').update({ status }).eq('id', id);
  fetchListings();
}

async function deleteProperty(id) {
  if (!confirm('Permanent delete?')) return;
  await supabase.from('properties').delete().eq('id', id);
  fetchListings();
}

// Modal Logic
const modal = document.getElementById('property-modal');
const imageFileIn = document.getElementById('p-image-file');
const imageUrlIn = document.getElementById('p-image');
const imagePreview = document.getElementById('image-preview');

imageFileIn.onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (re) => {
      imagePreview.classList.remove('hidden');
      imagePreview.querySelector('img').src = re.target.result;
      imageUrlIn.value = 'Local File Selected';
      imageUrlIn.disabled = true;
    };
    reader.readAsDataURL(file);
  }
};

document.getElementById('open-modal-btn').onclick = () => modal.classList.remove('hidden');
document.getElementById('close-modal-btn').onclick = () => {
  modal.classList.add('hidden');
  imagePreview.classList.add('hidden');
  imageUrlIn.disabled = false;
};

document.getElementById('property-form').onsubmit = async (e) => {
  e.preventDefault();
  const fileIn = document.getElementById('p-image-file');
  const imageUrl = fileIn.files.length > 0 ? 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200' : document.getElementById('p-image').value;

  const formData = {
    title: document.getElementById('p-title').value,
    description: document.getElementById('p-desc').value,
    location: document.getElementById('p-location').value,
    rent: parseInt(document.getElementById('p-rent').value),
    rooms: parseInt(document.getElementById('p-rooms').value),
    category: document.getElementById('p-category').value,
    image_url: imageUrl,
    map_link: document.getElementById('p-map').value,
    owner_id: currentUser.user.id,
    status: 'pending'
  };

  const { error } = await supabase.from('properties').insert([formData]);
  if (error) alert(error.message);
  else {
    modal.classList.add('hidden');
    fetchListings();
  }
};

init();
