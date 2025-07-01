'use strict';
import { accounts } from './dataModel.js';

// Get current account from localStorage
const currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
if (!currentAccount) {
  window.location.href = 'index.html';
}

const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.balance_value');
const labelSummaryIn = document.querySelector('.summary_value--in');
const labelSummaryOut = document.querySelector('.summary_value--out');
const labelSummaryInterest = document.querySelector('.summary_value--interest');
const labelDate = document.querySelector('.date');
const labelWelcome = document.querySelector('.welcome');
const sortBtn = document.querySelector('.btn--sort');
const transferBtn = document.querySelector('.form_btn--transfer');
const loanBtn = document.querySelector('.form_btn--loan');
const closeBtn = document.querySelector('.form_btn--close');

// Determine if user is new or returning
const isNewUser = localStorage.getItem('isNewUser') === 'true';

// Update welcome message
labelWelcome.textContent = isNewUser
  ? `Welcome, ${currentAccount.owner.split(' ')[0]}`
  : `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

// Clear the new user flag after displaying the message
localStorage.setItem('isNewUser', 'false');

const displayMovements = function (accs) {
  containerMovements.innerHTML = '<h3 class="movements_heading">Transaction history</h3>';
  accs.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(accs.movementsDate[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${day}/${month}/${year}`;
    const html = `
    <div class="movements_row">
      <div class="movements_type movements_type--${type}">${type}</div>
      <div class="movements_date">${displayDate}</div>
      <div class="movements_value">${mov.toFixed(2)} ${accs.currency}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('beforeend', html);
  });
};

const calcDisplayBalance = function (accs) {
  const balance = accs.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${balance.toFixed(2)} ${accs.currency}`;
};

const calcDisplaySummary = function (accs) {
  const incomes = accs.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSummaryIn.textContent = `${incomes.toFixed(2)} ${accs.currency}`;
  const out = Math.abs(
    accs.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSummaryOut.textContent = `${out.toFixed(2)} ${accs.currency}`;

  const interest = accs.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * accs.interestRate) / 100)
    .filter(int => {
      if (int >= 1) return int;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSummaryInterest.textContent = `${interest.toFixed(2)} ${accs.currency}`;
};

// Initialize UI
displayMovements(currentAccount);
calcDisplayBalance(currentAccount);
calcDisplaySummary(currentAccount);

// Update date
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minute = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

// Event Handlers
let sorted = false;

//1. SORT TRANSACTION
sortBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const movements = [...currentAccount.movements];
  const movementsDates = [...currentAccount.movementsDate];
  
  if (!sorted) {
    movements.sort((a, b) => b - a);
    sorted = true;
  } else {
    movements.sort((a, b) => a - b);
    sorted = false;
  }
  
  const sortedAccount = { ...currentAccount, movements, movementsDate: movementsDates };
  displayMovements(sortedAccount);
});

// Add helper functions at the top if not imported
function getAllAccounts() {
  const stored = localStorage.getItem('accounts');
  if (stored) return JSON.parse(stored);
  return accounts;
}
function saveAllAccounts(accs) {
  localStorage.setItem('accounts', JSON.stringify(accs));
}

//2. TRANSFER MONEY
transferBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(document.querySelector('.form_input--amount').value);
  const receiverAcc = document.querySelector('.form_input--to').value;
  const allAccounts = getAllAccounts();
  const senderIndex = allAccounts.findIndex(acc => acc.email === currentAccount.email);
  const receiver = allAccounts.find(acc => String(acc.account) === String(receiverAcc));

  if (
    amount > 0 &&
    receiver &&
    amount <= currentAccount.movements.reduce((acc, mov) => acc + mov, 0) &&
    receiver.account !== currentAccount.account
  ) {
    // Doing the transfer
    allAccounts[senderIndex].movements.push(-amount);
    allAccounts[senderIndex].movementsDate.push(new Date().toISOString());
    receiver.movements.push(amount);
    receiver.movementsDate.push(new Date().toISOString());

    // Update UI for sender
    displayMovements(allAccounts[senderIndex]);
    calcDisplayBalance(allAccounts[senderIndex]);
    calcDisplaySummary(allAccounts[senderIndex]);

    // Save all accounts and update currentAccount in localStorage
    saveAllAccounts(allAccounts);
    localStorage.setItem('currentAccount', JSON.stringify(allAccounts[senderIndex]));

    // Clear input fields
    document.querySelector('.form_input--amount').value = '';
    document.querySelector('.form_input--to').value = '';
  }
});

//3. GET LOAN
loanBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(document.querySelector('.form_input--loan-amount').value);

  if (
    amount > 0 &&
    (
      currentAccount.movements.length === 0 ||
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    )
  ) {
    const allAccounts = getAllAccounts();
    const accIndex = allAccounts.findIndex(acc => acc.email === currentAccount.email);

    // Add movement to the correct account in the accounts array
    allAccounts[accIndex].movements.push(amount);
    allAccounts[accIndex].movementsDate.push(new Date().toISOString());

    // Save all accounts and update currentAccount in localStorage
    saveAllAccounts(allAccounts);
    localStorage.setItem('currentAccount', JSON.stringify(allAccounts[accIndex]));

    // Update the in-memory currentAccount variable
    Object.assign(currentAccount, allAccounts[accIndex]);

    // Update UI
    displayMovements(currentAccount);
    calcDisplayBalance(currentAccount);
    calcDisplaySummary(currentAccount);
  }
  document.querySelector('.form_input--loan-amount').value = '';
});

//4. CLOSE ACCOUNT
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

// Logout functionality
const logoutBtn = document.querySelector('.btn--logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('currentAccount');
    window.location.href = 'index.html';
  });
}


