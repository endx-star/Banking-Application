'use strict';
import { accounts } from './dataModel.js';

const [account1, account2, account3, account4, account5] = accounts;

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalLogin = document.querySelector('.modal--login');
const modalSignup = document.querySelector('.modal--signup');
const overlayLogin = document.querySelector('.overlay--login');
const overlaySignup = document.querySelector('.overlay--signup');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnOpenModal = document.querySelector('.btn--show-modal-login');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnsOpenSignupModal = document.querySelectorAll('.btn--show-modal-signup');

///// WINDOW MODAL ///////
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const loginModal = function (e) {
  e.preventDefault();
  modalLogin.classList.remove('hidden');
  overlayLogin.classList.remove('hidden');
};

const signupModal = function (e) {
  e.preventDefault();
  modalSignup.classList.remove('hidden');
  overlaySignup.classList.remove('hidden');
};

const closeLoginModal = function () {
  modalLogin.classList.add('hidden');
  overlayLogin.classList.add('hidden');
};

const closeSignupModal = function () {
  modalSignup.classList.add('hidden');
  overlaySignup.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
btnOpenModal.addEventListener('click', loginModal);

// Close login modal
document.querySelector('.modal--login .btn--close-modal').addEventListener('click', closeLoginModal);
document.querySelector('.overlay--login').addEventListener('click', closeLoginModal);

// Close signup modal
document.querySelector('.modal--signup .btn--close-modal').addEventListener('click', closeSignupModal);
overlaySignup.addEventListener('click', closeSignupModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (!modal.classList.contains('hidden')) {
      closeModal();
    }
    if (!modalLogin.classList.contains('hidden')) {
      closeLoginModal();
    }
    if (!modalSignup.classList.contains('hidden')) {
      closeSignupModal();
    }
  }
});

// Helper: get all accounts (from localStorage if present)
function getAllAccounts() {
  const stored = localStorage.getItem('accounts');
  if (stored) return JSON.parse(stored);
  return accounts;
}

// Helper: save all accounts to localStorage
function saveAllAccounts(accs) {
  localStorage.setItem('accounts', JSON.stringify(accs));
}

// Login functionality
const loginForm = document.querySelector('.modal--login .modal__form');
const loginErrorDiv = loginForm.querySelector('.login-error-message');
loginForm.querySelector('.modal__form--login').addEventListener('click', function (e) {
  e.preventDefault();
  const email = loginForm.querySelector('.modal__form--email').value;
  const pin = Number(loginForm.querySelector('.modal__form--pin').value);

  // Use getAllAccounts to include new signups if persisted
  const allAccounts = getAllAccounts();
  const account = allAccounts.find(acc => acc.email === email && acc.pin === pin);

  if (account) {
    localStorage.setItem('currentAccount', JSON.stringify(account));
    localStorage.setItem('isNewUser', 'false');
    loginErrorDiv.textContent = '';
    closeLoginModal();
    window.location.href = 'home.html';
  } else {
    loginErrorDiv.textContent = 'Incorrect email or PIN!';
  }
});

// Clear error message when opening the login modal
btnOpenModal.addEventListener('click', function() {
  if (loginErrorDiv) loginErrorDiv.textContent = '';
});

////// BUTTON SCROLLING //////

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});



document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // BUG in v2: This way, we're not keeping track of the current slide when clicking on a slide
      // const { slide } = e.target.dataset;

      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();

btnsOpenSignupModal.forEach(btn => btn.addEventListener('click', signupModal));

// Signup functionality
modalSignup.querySelector('.modal__form--signup').addEventListener('click', function (e) {
  e.preventDefault();
  const form = modalSignup.querySelector('form');
  const inputs = form.querySelectorAll('input');
  const [firstNameInput, lastNameInput, emailInput, pinInput, confirmPinInput] = inputs;
  const errorDiv = form.querySelector('.signup-error-message');
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const pin = pinInput.value.trim();
  const confirmPin = confirmPinInput.value.trim();

  // Use persisted accounts for validation and adding
  const allAccounts = getAllAccounts();

  // Basic validation
  if (!firstName || !lastName || !email || !pin || !confirmPin) {
    errorDiv.textContent = 'Please fill in all fields.';
    return;
  }
  if (pin !== confirmPin) {
    errorDiv.textContent = 'PINs do not match!';
    return;
  }
  if (allAccounts.some(acc => acc.email === email)) {
    errorDiv.textContent = 'An account with this email already exists!';
    return;
  }

  // Generate a unique account number
  let accountNumber;
  do {
    accountNumber = Math.floor(100000 + Math.random() * 900000);
  } while (allAccounts.some(acc => acc.account === accountNumber));

  // Create new account object
  const newAccount = {
    owner: `${firstName} ${lastName}`,
    email,
    movements: [],
    interestRate: 1.0,
    pin: Number(pin),
    account: accountNumber,
    movementsDate: [],
    currency: 'ETB',
  };

  allAccounts.push(newAccount);
  saveAllAccounts(allAccounts);
  localStorage.setItem('currentAccount', JSON.stringify(newAccount));
  localStorage.setItem('isNewUser', 'true');

  errorDiv.textContent = '';
  closeSignupModal();
  window.location.href = 'home.html';
});

// Clear error message when opening the signup modal
btnsOpenSignupModal.forEach(btn => btn.addEventListener('click', function() {
  const form = modalSignup.querySelector('form');
  const errorDiv = form.querySelector('.signup-error-message');
  if (errorDiv) errorDiv.textContent = '';
}));

closeBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const user = document.querySelector('.form_input--user').value;
  const pin = Number(document.querySelector('.form_input--pin').value);

  if (user === currentAccount.email && pin === currentAccount.pin) {
    // Remove from localStorage accounts
    const allAccounts = getAllAccounts();
    const index = allAccounts.findIndex(acc => acc.email === currentAccount.email);
    if (index !== -1) {
      allAccounts.splice(index, 1);
      saveAllAccounts(allAccounts);
    }

    // Clear localStorage
    localStorage.removeItem('currentAccount');

    // Hide UI
    document.querySelector('.app').style.opacity = 0;
    
    // Redirect to login page after 2 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }

  document.querySelector('.form_input--user').value = '';
  document.querySelector('.form_input--pin').value = '';
});
