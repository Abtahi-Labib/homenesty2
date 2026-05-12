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
    listEl.innerHTML = '<div class="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-100 italic font-serif">No listings yet.</div>';
    return;
  }

  items.forEach(p => {
    const item = document.createElement('div');
    item.className = "bg-white border border-stone-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6";
    
    item.innerHTML = `
      <div class="w-full md:w-24 h-24 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
        <img src="${p.image_url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'}" class="w-full h-full object-cover">
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
           <h3 class="text-lg font-serif text-stone-900">${p.title}</h3>
           <span class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${p.status === 'approved' ? 'bg-green-50 text-green-700' : p.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}">${p.status}</span>
        </div>
        <div class="text-xs text-stone-400 font-sans space-x-4">
           <span>${p.location}</span>
           <span>৳ ${p.rent.toLocaleString()}</span>
        </div>
      </div>
      <div class="flex items-center gap-2 ml-auto">
        ${currentUser.profile.role === 'admin' && p.status === 'pending' ? `
          <button class="approve-btn p-2 bg-green-50 text-green-600 rounded-lg" data-id="${p.id}">Approve</button>
          <button class="reject-btn p-2 bg-red-50 text-red-600 rounded-lg" data-id="${p.id}">Reject</button>
        ` : ''}
        <a href="/property.html?id=${p.id}" class="p-2 bg-stone-50 text-stone-600 rounded-lg">View</a>
        <button class="delete-btn p-2 text-stone-400 hover:text-red-600" data-id="${p.id}">Delete</button>
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
document.getElementById('open-modal-btn').onclick = () => modal.classList.remove('hidden');
document.getElementById('close-modal-btn').onclick = () => modal.classList.add('hidden');

document.getElementById('property-form').onsubmit = async (e) => {
  e.preventDefault();
  const formData = {
    title: document.getElementById('p-title').value,
    description: document.getElementById('p-desc').value,
    location: document.getElementById('p-location').value,
    rent: parseInt(document.getElementById('p-rent').value),
    rooms: parseInt(document.getElementById('p-rooms').value),
    category: document.getElementById('p-category').value,
    image_url: document.getElementById('p-image').value,
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
