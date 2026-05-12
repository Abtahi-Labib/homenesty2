import { supabase } from './auth.js';
import { injectNavbar, injectFooter } from './components.js';

injectNavbar();
injectFooter();

const form = document.getElementById('login-form');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const submitBtn = document.getElementById('submit-btn');

form.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  submitBtn.disabled = true;
  submitBtn.innerText = 'Signing in...';
  errorBox.classList.add('hidden');

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    errorMessage.innerText = error.message;
    errorBox.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.innerText = 'Sign In';
  } else {
    window.location.href = '/dashboard.html';
  }
};
