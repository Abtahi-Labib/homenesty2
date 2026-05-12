import { supabase } from './auth.js';
import { injectNavbar, injectFooter } from './components.js';

injectNavbar();
injectFooter();

const form = document.getElementById('register-form');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const submitBtn = document.getElementById('submit-btn');

form.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const full_name = document.getElementById('full_name').value;
  const phone = document.getElementById('phone').value;
  const role = document.querySelector('input[name="role"]:checked').value;
  
  submitBtn.disabled = true;
  submitBtn.innerText = 'Creating account...';
  errorBox.classList.add('hidden');

  const { data, error: authError } = await supabase.auth.signUp({ email, password });

  if (authError) {
    displayError(authError.message);
    return;
  }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name,
      phone,
      role
    });

    if (profileError) {
      displayError(profileError.message);
    } else {
      window.location.href = '/dashboard.html';
    }
  }
};

function displayError(msg) {
  errorMessage.innerText = msg;
  errorBox.classList.remove('hidden');
  submitBtn.disabled = false;
  submitBtn.innerText = 'Create Account';
}
