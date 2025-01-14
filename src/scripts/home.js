'use strict';
import { accounts } from './dataModel.js';

const [account1, account2, account3, account4, account5] = accounts;

const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.balance_value');
const labelSummaryIn = document.querySelector('.summary_value--in');
const labelSummaryOut = document.querySelector('.summary_value--out');
const labelSummaryInterest = document.querySelector('.summary_value--interest');
const labelDate = document.querySelector('.date');
const sortBtn = document.querySelector('.btn--sort');
const transferBtn = document.querySelector('.form_btn--transfer');
const loanBtn = document.querySelector('.form_btn--loan');
const closeBtn = document.querySelector('.form_btn--close');

const displayMovements = function (accs) {
  containerMovements.innerHTML = '';
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
      <div class="movements_value">${mov.toFixed(2)} ETB</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (accs) {
  console.log(accs);
  console.log(accs.movements);

  const balance = accs.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${balance.toFixed(2)} ETB`;
};

const calcDisplaySummary = function (accs) {
  const incomes = accs.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSummaryIn.textContent = `${incomes.toFixed(2)} ETB`;
  const out = Math.abs(
    accs.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSummaryOut.textContent = `${out.toFixed(2)} ETB`;

  const interest = accs.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * 1.2) / 100)
    .filter(int => {
      if (int >= 1) return int;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSummaryInterest.textContent = `${interest.toFixed(2)} ETB`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
displayMovements(account1);
calcDisplayBalance(account1);
calcDisplaySummary(account1);
createUsernames(accounts);

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minute = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

// Event Handlers
//1. SORT TRANSACTION
//2. CLOSE ACCOUNT
//3. TRANSFER MONEY
//4. GET LOAN
