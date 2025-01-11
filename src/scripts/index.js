'use strict';
import { account1 } from './home.js';

const loginBtn = document.querySelector('.nav__link--btn_login');
const signUpBtn = document.querySelector('.nav__link--btn_signup');
// Event Listner
//1. Login Button
loginBtn.addEventListener('click', e => {
  e.preventDefault();
  console.log(e);
  console.log(account1.owner);
  console.log('Login clicked');
});

//2. Open Account Button
signUpBtn.addEventListener('click', e => {
  e.preventDefault();
  console.log('Sign Up clicked');
});
