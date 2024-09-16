'use strict';

const account1 = {
  owner: 'Endale Tegegnework',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Syamregn Moltot',
  movements: [430, 1000, 700, 50, 90, -400, 300, -980],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Gashaw Kidanu',
  movements: [1000, -100, 500, 900, -3000, 4000, -650],
  interestRate: 0.8,
  pin: 5555,
};

const account = [account1, account2, account3, account4, account5];

const movements = document.querySelector('.movements');

const displayMovements = function (movements) {
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements_row">
      <div class="movements_type movements_type--${type}">${i + 1} ${type}</div>
      <div class="movements_value">${mov}</div> 
    </div>
    `;
    movements.innerHTML += html;
  });
};
displayMovements(account1.movements);
