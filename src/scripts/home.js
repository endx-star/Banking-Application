'use strict';

export const account1 = {
  owner: 'Endale Tegegnework',
  email: 'endale2222@gmail.com',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDate: [
    '2019-11-20T23:50:18.467Z',
    '2020-10-27T16:49:22.245Z',
    '2021-07-13T23:46:27.356Z',
    '2021-08-06T18:37:19.600Z',
    '2022-01-19T19:52:10.430Z',
    '2023-10-17T21:50:11.220Z',
    '2024-12-28T11:37:13.195Z',
    '2024-06-22T10:30:17.380Z',
  ],
  currency: 'ETB',
};

const account2 = {
  owner: 'Haymanot Wendye',
  email: 'haymi333@gmail.com',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDate: [
    '2019-11-11T22:31:16.178Z',
    '2019-12-29T27:58:18.467Z',
    '2020-10-27T16:49:22.245Z',
    '2021-07-13T23:46:27.356Z',
    '2021-08-06T18:37:19.600Z',
    '2022-01-19T19:52:10.430Z',
    '2023-10-17T21:50:11.220Z',
    '2024-12-28T11:37:13.195Z',
    '2024-06-22T10:30:17.380Z',
  ],
  currency: 'ETB',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  email: 'steven444@gmail.com',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDate: [
    '2019-12-29T27:58:18.467Z',
    '2020-10-27T16:49:22.245Z',
    '2021-07-13T23:46:27.356Z',
    '2021-08-06T18:37:19.600Z',
    '2022-01-19T19:52:10.430Z',
    '2023-10-17T21:50:11.220Z',
    '2024-12-28T11:37:13.195Z',
    '2024-06-22T10:30:17.380Z',
  ],
  currency: 'USD',
};

const account4 = {
  owner: 'Syamregn Moltot',
  email: 'syamregn555@yahoo.com',
  movements: [430, 1000, 700, 50, 90, -400, 300, -980],
  interestRate: 1,
  pin: 4444,
  movementsDate: [
    '2019-12-29T27:58:18.467Z',
    '2020-10-27T16:49:22.245Z',
    '2021-07-13T23:46:27.356Z',
    '2021-08-06T18:37:19.600Z',
    '2022-01-19T19:52:10.430Z',
    '2023-10-17T21:50:11.220Z',
    '2024-12-28T11:37:13.195Z',
    '2024-06-22T10:30:17.380Z',
  ],
  currency: 'ETB',
};

const account5 = {
  owner: 'Gashaw Kidanu',
  email: 'gashaw@gmail.com',
  movements: [1000, -100, 500, 900, -3000, 4000, -650],
  interestRate: 0.8,
  pin: 5555,
  movementsDate: [
    '2019-12-29T27:58:18.467Z',
    '2020-10-27T16:49:22.245Z',
    '2021-07-13T23:46:27.356Z',
    '2021-08-06T18:37:19.600Z',
    '2022-01-19T19:52:10.430Z',
    '2023-10-17T21:50:11.220Z',
    '2024-12-28T11:37:13.195Z',
    '2024-06-22T10:30:17.380Z',
  ],
  currency: 'EUR',
};

const accounts = [account1, account2, account3, account4, account5];

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
