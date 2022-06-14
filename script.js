'use strict';

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Ramdan Agus Saputra',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  locale: navigator.language,
  currency: 'USD',
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-04-25T14:18:46.235Z',
    '2022-05-05T16:33:06.386Z',
    '2022-06-10T14:43:26.374Z',
    '2022-06-11T18:49:59.371Z',
    '2022-06-12T12:01:20.894Z',
  ],
};

const account2 = {
  owner: 'Jonas Schmedtmann',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  locale: navigator.language,
  currency: 'USD',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  locale: navigator.language,
  currency: 'USD',
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-10T18:49:59.371Z',
    '2022-06-13T12:01:20.894Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  locale: navigator.language,
  currency: 'USD',
  movementsDates: [
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
  ],
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelSumValue = document.querySelectorAll('.summary__value');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// User name generator
const usernameGenerator = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(a => a[0])
      .join('');
  });
};

usernameGenerator(accounts);

/////////////////////////////////////////////////
// Day passed
const dayPassed = function (acc, date) {
  // Calculate date in miliseconds to days
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  };

  const dayPass = calcDaysPassed(new Date(), date);

  if (dayPass === 0) {
    return 'Today';
  } else if (dayPass === 1) {
    return 'Yesterday';
  } else if (dayPass <= 7) {
    return `${dayPass} days ago`;
  } else {
    return new Intl.DateTimeFormat(acc.locale).format(date);
  }
};

/////////////////////////////////////////////////
// Currency formater
const currencyFormater = function (acc, num) {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(num);
};

/////////////////////////////////////////////////
// Display movement
const displayMovement = function (acc, sorted = false) {
  containerMovements.innerHTML = '';

  // Copy original array
  const copyMov = [...acc.movements];

  // Sorted copy array
  const sortedMov = sorted ? copyMov.sort((a, b) => a - b) : acc.movements;

  // Add html element
  sortedMov.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const movFormated = currencyFormater(acc, mov);

    containerMovements.insertAdjacentHTML(
      'afterbegin',
      `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
      <div class="movements__date">${dayPassed(acc, date)}</div>
      <div class="movements__value">${movFormated}</div>
    </div>`
    );
  });
};

/////////////////////////////////////////////////
// Display Balance
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((prev, cur) => prev + cur);

  labelBalance.textContent = currencyFormater(acc, acc.balance);
};

/////////////////////////////////////////////////
// Display summary
const displaySummary = function (acc) {
  const calcSummary = acc.movements.reduce(
    (acu, mov) => {
      if (mov > 0) {
        acu[0] += mov;
        acu[2] +=
          mov * (acc.interestRate / 100) > 1
            ? mov * (acc.interestRate / 100)
            : 0;
        return acu;
      } else {
        acu[1] += mov;
        return acu;
      }
    },
    [0, 0, 0]
  );

  labelSumValue.forEach((el, i) => {
    el.textContent = currencyFormater(acc, Math.abs(calcSummary[i]));
  });
};

/////////////////////////////////////////////////
// Display UI
const displayUI = function (acc) {
  displayMovement(acc);

  displayBalance(acc);

  displaySummary(acc);
};

/////////////////////////////////////////////////
// Start and restart log out timer
let timerInterval;
const timer = function () {
  // Clear interval if already exist
  if (timerInterval) clearInterval(timerInterval);

  let time = 300;

  // Interval callback
  const tick = function () {
    const minute = String(Math.floor(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minute}:${second}`;
    time--;

    if (time === 0) {
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Log in to get started';
    }
  };

  tick();
  timerInterval = setInterval(tick, 1000);
};

/////////////////////////////////////////////////
// User Log in
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // Find log in account
  currentAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  // Check the pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI
    containerApp.style.opacity = '100';
    displayUI(currentAccount);

    // Start timer
    timer();

    // Welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')
      .slice(0, 1)}`;

    // Date
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      minute: '2-digit',
      hour: '2-digit',
      hourCycle: 'h12',
    }).format(new Date());

    // Erase log in input
    inputLoginUsername.value = inputLoginPin.value = '';
  } else {
    inputLoginUsername.value = inputLoginPin.value = '';
    containerApp.style.opacity = '0';
    alert('Invalid username or pin');
  }
});

/////////////////////////////////////////////////
// Transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // Transfer amount
  let amount = Number(inputTransferAmount.value);

  // Find receiver account
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Guard clause
  if (
    !(
      amount > 0 &&
      receiverAccount !== currentAccount &&
      currentAccount.balance >= amount &&
      receiverAccount
    )
  ) {
    alert('Input valid amount and receiver username to transfer');
    inputTransferTo.value = inputTransferAmount.value = '';
    return;
  }

  // Start timer
  timer();

  // Add negative movement to current account
  currentAccount.movements.push(-amount);

  // Add positive movement to receiver
  receiverAccount.movements.push(amount);

  // Add date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAccount.movementsDates.push(new Date().toISOString());

  // Display UI
  displayUI(currentAccount);

  // Erase Input Transfer
  inputTransferTo.value = inputTransferAmount.value = '';
});

/////////////////////////////////////////////////
// Request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  const loanCondition = currentAccount.movements
    .filter(mov => mov > 0)
    .some(dep => dep >= amount * (currentAccount.interestRate / 100));

  console.log(loanCondition);
  console.log(amount);
  if (!(loanCondition && amount > 0)) {
    alert('Input valid amount of loan!');
    inputLoanAmount.value = '';
    return;
  }

  // Start timer
  timer();

  setTimeout(() => {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    displayUI(currentAccount);
  }, 2000);

  inputLoanAmount.value = '';
});

/////////////////////////////////////////////////
// Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Check crendentials
  if (
    !(
      currentAccount.username === inputCloseUsername.value &&
      currentAccount.pin === Number(inputClosePin.value)
    )
  ) {
    // Alert if input wrong
    alert('Wrong username or pin');

    // Erase input value
    inputCloseUsername.value = inputClosePin.value = '';
    return;
  }

  // Find index currentAccount
  const closeAccountIndex = accounts.findIndex(
    acc =>
      acc.username === currentAccount.username && acc.pin === currentAccount.pin
  );

  // Delete current account
  accounts.splice(closeAccountIndex, 1);

  // Change welcome message
  labelWelcome.textContent = 'Log in to get started';

  // Erase input value
  inputCloseUsername.value = inputClosePin.value = '';

  // Close the App
  containerApp.style.opacity = '0';
});

/////////////////////////////////////////////////
// User sort movement
let sort = false;
btnSort.addEventListener('click', function () {
  sort = !sort;
  console.log(sort);
  displayMovement(currentAccount, sort);
});
