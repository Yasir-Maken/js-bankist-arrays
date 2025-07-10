'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2025-07-07T17:01:17.194Z',
    '2025-07-07T23:36:17.929Z',
    '2025-07-09T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2025-07-03T18:49:59.371Z',
    '2025-07-09T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
////////////////////////////////////////////////////////////////////
//                          THE LOGIC

//                    Functions

// function that format the dates
const formatMovementsDate = function (date, locale) {
  // calculate how much days for the movement
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const dayPassed = calcDaysPassed(new Date(), date);
  // console.log(dayPassed);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const hours = date.getHours();
    // const minute = date.getMinutes();

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// function that format the currences
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// This funcion displays the all user movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; // this empty the movement from elements that we have set to represent our desing

  // Sort our movemnets if the sort param is true
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; // check wether the movement is deposit or withdrawal according to the movement value

    // Formatting the movements
    const formatMov = formatCur(mov, acc.locale, acc.currency);

    // displaying the movements Dates on the UI
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);
    // the html that represent the movment on our ui, and insert it to its right place

    const html = ` 
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatMov}</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html); // the method that insert the above text to our html document as a node
  });
};

// Compute the balance of the account on the balance lable
const calcDisplayBalance = function (acc) {
  // now we use reduce() method to acumulate all the movements which results in the account balance
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Display the summary of incoming and outgoing and interest amounts and put them into their lables on the html document
const calcDisplaySummary = function (acc) {
  // We will chain methods to filter and calculate the amounts above 0 as income
  const incomes = acc.movements
    .filter(deposit => deposit > 0)
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // We will chain methods to filter and calculate the amounts below 0 as out
  const out = acc.movements
    .filter(withdrawl => withdrawl < 0)
    .reduce((acc, withdrawl) => acc + Math.abs(withdrawl), 0);

  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  // The bank interest is payed to the bank in each deposit: lets set it 1.2 for our fictional bank here to calculate the interest
  // so we need to filter our array with above 0 which is deposit, then map them to caculate the interst to each depsit, the sum all of the calculated iterest
  const interest = acc.movements
    .filter(interest => interest > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1) // we add this to exclude every interest that bellow 1. as we set it a rule by our fictional bank hahahah
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Compute user name: taking the first letter of each word & combine them together in lower case
// For Example: 'Yasir Maken' user name should => ym.
// const user1 = 'Yasir Maken Alnor'; // for testing createUserNames() function

// take each account in accounts array and mutate it by adding the user name into that account object
const createUserNames = function (accs) {
  // take the name transform it into lowr case, split it into seprate names into array loop each name string within the array and get the first name into array and then join this array into string
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);
// console.log(accounts);

// Use this to our to update the ui movements icome out balance whenever wherever we want
const updateUI = function (acc) {
  // Display Movementts
  displayMovements(acc);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

// timer to log out if spend specific time in the app
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    // In each call print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }

    // Decreas is
    time--;

    // when 0 seconds, stop timer and log out
  };

  // Set Time to 5 minutes
  let time = 120;
  //
  tick();
  // Call the timer every second
  const timer = setInterval(tick, 1000);
  return timer;
};

// Event handler:
// Perform Login Logic
let currentAccount, timer;

// ---------------------------------------------------------

//             FAKE LOGIN TO DEVELOPMENT PURPOSE
/*
currentAccount = account1;
updateUI(account1);
containerApp.style.opacity = 1;
*/
//

// ---------------------------------------------------------

//                EXPERMENTIND DATE API

//
/*
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long', // numeric
  year: '2-digit', // numeric
  weekday: 'short', // (short, narrow)
};

// get the language from the user browser
const locale = navigator.language;
// console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
*/
//

// ----------------------------------------------------------

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // this to prevent the page from reload when click on the submission button cause it is always reload the page
  // Shortly prevent Form from submiting
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  // If the user credintial was correct
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display Welcome Message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 1;

    // Internationalization Date Do it by Intl API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long', // numeric
      year: '2-digit', // numeric
      weekday: 'short', // (short, narrow)
    };

    // get the language from the user browser
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    /*
    // CUSTOME set the login date & time
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    const hours = `${now.getHours()}`.padStart(2, 0);
    const minute = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${year}/${month}/${day}, ${hours}: ${minute}`;
*/
    // show the user board

    // start timer to log out if there is no interacivity with the page
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // take the focus from the intput of login

    // update the UI with the all our functions
    updateUI(currentAccount);

    // Log the user the the console
    console.log(currentAccount.owner, 'LOGED IN');
  }
});

// Perform Transfere Logic
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // First we should check if the transfer input are valid
  const amount = Math.floor(inputTransferAmount.value); // amount to transfere
  const recieverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  ); // person you want to transfere to

  inputTransferAmount.value = inputTransferTo.value = '';

  console.log(amount, recieverAccount);
  if (
    amount > 0 && // the transfere amount must be more than one ahahahahhah
    recieverAccount &&
    currentAccount.balance >= amount && // current balance should be more than the amount hahahaha
    recieverAccount?.userName !== currentAccount.userName // To make sure not send to your self hahaha. computer need to it about every thing to not intiat mony that isn't exist
  ) {
    console.log('Transfere Valid');
    currentAccount.movements.push(-amount); // add this movement by negative sign to the sender movements array
    recieverAccount.movements.push(amount); // add the amount to the recivere movements array

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());

    // Then update the UI now to see the new things that happens
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Perfore Request Loan Logic
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  // our fictional bank set a rul to accept loan request the acount should have a deposit equal to or greater than 10% of the deposit amount
  if (amount > 0 && currentAccount.movements.some(mov => mov >= mov * 0.1)) {
    // And this is a good scenario for some() method. if this true Add Movement. and update the UI

    // a time to accept the loan hahahah ficinal
    setTimeout(function () {
      // Add Movement
      currentAccount.movements.push(amount);

      // Add Transfere date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update the UI
      updateUI(currentAccount);
    }, 2500);

    // Clear the Loan Input
    inputLoanAmount.value = '';

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Log ou from the session

// Perform Close Account Logic
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // check if the user is exist. and the pin is correct to close and delete the accont
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    // console.log(index);    // for checking

    // Delete the accont
    accounts.splice(index, 1);

    // hide the UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Perform Sort Movements Logic
let sorted = false; // this to look at the status or sort ture or false so we can handle it.
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

////////////////////////////////////////////////////////////////////

/////////////////////////   FOREACH WITH MAPS  ///////////////////////////////
// Here it looks similar to array, but map have array of arrays
// the callback function should have params the value, the key and the entire map
// const userEntry = 'GBP';
// currencies.forEach(function (value, key, mp) {
//   console.log(`${key}: ${value}`);
// });

// // SETS: Let's try this for sets.
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// // and what we se here that is the key is the same as the value.
// // that because sets don't have indexes or keys.

// currenciesUnique.forEach(function (value, _, mp) {
//   console.log(`${_}: ${value}`);
// });

/////////////////////////   FOREACH WITH ARRAYS  ///////////////////////////////

// for (const movement of movements)
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You Deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You Withdrew ${Math.abs(movement)}`); // abs() is Math method that remove the negative sign(-)minus form the number
//   }
// }
// console.log(''.padEnd(30, '*'));
// //FOREACH
// // forEach() Method: it is a higer ordered level function so it required a callback function. In order to tell it what to do for each element
// // movement argument we passed it to forEach, so each time the callback function is called it recieve the current element as movement

// // Also forEach is alot easier to access the index, and as it callback the function
// // it passes in the current element of the array, and also the current element and the entir array
// movements.forEach(function (mov, key, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${key + 1}: You Deposited ${mov}`);
//   } else {
//     console.log(`Movement ${key + 1}: You Withdrew ${Math.abs(mov)}`); // abs() is Math method that remove the negative sign(-)minus form the number
//   }
// });

// this is how it works. It will call the function in each iteration to a certin element
// 0: function(200)
// 1: function(450)
// 2: function(-400)
// ...
// and so on untill the end of the array

/////////////////////////   ARRAY TOOLS  ///////////////////////////////

// Lets Navigate Arrays Methods.
// let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// // SLICE
// // Slice method copy array without affecting the original array
// console.log(arr.slice(2)); // this copy new array start from index 2 ['c','d','e','f'] from the original array
// console.log(arr.slice(2, 4)); // this extract new array start from index 2 ends in index 4 ['c','d']
// console.log(arr.slice(-2)); // also we can defined a negative begin parameter -2, that start copying from the end of the array ['e','f']
// console.log(arr.slice(1, -2)); // this like say start copying from element indexed 1 except last 2 elements ['b','c','d']

// // And simply we can create a shallow copy from the array
// console.log(arr.slice()); // this is new array
// // or we can simply use the spread perator to create new one
// console.log([...arr]);

// // SPLICE
// // Splice method is like slice but it mutate the original array and don't poduce new array
// console.log(arr.splice(2)); // ['c', 'd', 'e', 'f']
// console.log(arr); // so here just first 2 elements will remain ['a','b'] it deletes the rest of them

// // REVERSE
// // Reverse method used to revers the array elements. Yes as you heard
// arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// const arr2 = ['i', 'h', 'g'];
// console.log(arr2.reverse()); // But actually the reverse mutate the original array also

// // CONCAT
// // It is used to concatinate 2 arrays
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]); // this gives the exact same result. and did not mutate any of the above arrays

// // JOIN
// // Join method concat the array elements into one string usig separator you determin it
// console.log(letters.join('-> '));

// ---------      MAP          --------        FILETER      ---------       REDUCE       ---------
// those are power full arrays tools

// MAP --------------------------------->>>>

// map() method is like forEach() it loops over array and give is a brand new array, this array contain each position the result of applying a callback function to the original array elements
// lets try it with our movements array. lets convert them from euros to us dollars by multiby by euro convertion rate
// const euroToUsd = 1.1;

// const movementsUsd = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// console.log(movements);
// console.log(movementsUsd);

// const movementsUsdArrow = movements.map(mov => mov * euroToUsd);
// console.log(movementsUsdArrow);

// // Use for of to do this
// const movementsUsdFor = [];
// for (const mov of movements) movementsUsdFor.push(mov * euroToUsd);
// console.log(movementsUsdFor);

// // the map method has access to exact same 3 parameteres, value, index, and the whole array
// const movementsDescription = movements.map(
//   (mov, key) =>
//     `Movement ${key + 1}: You ${mov > 0 ? 'Deposited' : 'Withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescription);

// FILTER --------------------------->>>>

// Use for filter array elements that's saticfy a certin condition: it's also use a callback function that accept also to arguments. the value and the index
// const deposit = movements.filter(function (mov, i, arr) {
//   // this will iterate through tha movements array and return array will only the elements that's sticfy the condition
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposit);

// // filter the withdrawls using the filter() method
// const withdrawls = movements.filter(mov => mov < 0);
// console.log(withdrawls);
// // hahahahaha I like to it with for of loop
// let depo = []; // here create empty array to recieve possitive elements
// let withd = []; // create empty array ro recieve negative elements
// for (const mov of movements) {
//   // iterate thruogh the movements array
//   if (mov > 0) depo.push(mov);
//   // push each element that saticfy this condition which is the more than 0 movements (+)
//   else withd.push(mov); // push each element that sticfy this condition which is less than zero (-)
// }
// console.log(depo);
// console.log(withd);

// REDUCE --------------------------------->>>
// Reduce poil down all array elements into one single value. example adding all numbers of an array into single number
// let's add the movements elements togather. and the result is the global balance of the accont
// console.log(movements);

// here balance is a single value not entire array. and it is also has a callback function
// the callback function unlike the forEach(), and map() arguments. the first argurment here did not act as the current but it is acumalator, تراكم
// Acumulator --> li SNOWBALL .. or sum
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   // console.log(`Iteration ${i}: Movement Amount: ${curr} Balance: ${acc}`);
//   return acc + curr;
// }, 0); // here zero represent the intial value of the acumulator. or the start value
// console.log(balance);

// Do the above using arrow function
// const balance = movements.reduce((acc, curr) => acc + curr, 0);
// console.log(balance);

// Also we can use reduce to calculate the MAXIMUM VALUE
// const max = movements.reduce((acc, curr) => {
//   if (acc > curr) return acc;
//   else return curr;
// }, movements[0]);
// console.log(max);

// CHAINING
// Is chaining our methods one after another to get to our last intended array or value
// Examples on our movements array if we want to take all of value and convert them into dollars in a brand new array
// const euroToUsd = 1.1;

// PIPELINE
// const totalDepositUsd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositUsd);
// We can only chain after a method if the result of the previous results an array

// FIND
// Find() method unlike filter it return 1 element based on a condition. so it return the first element that saticfy the condition
// const firstWithdrawal = movements.find(mov => mov < 0);
// // find return first element saticfy the condition. filer return all elements that saticfy the condditon
// // find return the value of the element only. filter return array of elements
// console.log(movements);
// console.log(firstWithdrawal);

// // lets use find() method with a cool example which is our accouonts
// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// ----------------------------       SOME       -------------------------------    EVERY      ------------------------

// Some() ------------->>>

// Some() is like a include() method so it return true or false, but some() search for a pattern or a condition, while include search for value == to value
// console.log(movements);
// // EQUALITY
// console.log(movements.includes(-130)); // it will return true if one of the array element = -130. false if not

// // CONDITION
// console.log(movements.some(mov => mov === -130)); // this gives same include() result. so it is better to use iclude when you look for equality
// console.log(movements.some(mov => mov > 0)); // this will return true if there is elements bigger than 0 (+). false if not

// Every() -------------->>>

// Every() is pretty similar ot Some method, the core defferent is that every only return true if all the array elements satisfy the condition
// In other word if all the element passes the test the callback function will retrun true.
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0)); // Thats so enjoyable. make me very excited

// // Lets separate the callback and call it into diferent methods
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit)); // true
// console.log(movements.every(deposit)); // false
// console.log(movements.filter(deposit)); // []

// ------------           FLAT            --------------            FLAT MAP              -------------

// Flat() ------------>>>

// it is takes nested arrays and flatend them into a single array [[10, 20], [30, 40]] => [10, 20, 30, 40]
// const arr = [[10, 20], [30, 40], 50, 60];
// console.log(arr);
// console.log(arr.flat());

// // the flat() method go one level deep into nested arrays. if we have array inside inside it will return first array
// const arrDeep = [[10, 20, [30, 40]], 50, [60, [70, 80]]];
// console.log(arrDeep);
// console.log(arrDeep.flat()); // to solve that we use depth argument to the flat method which determin the level of the flat
// console.log(arrDeep.flat(2)); // so it will go deeper into 2 levels to extract elements from nested arrays

// Lets try this with more real scenario. lets calculate the overall balance of all the accounts within the bank
// const accountMovements = accounts.map(acc => acc.movements); // this return array with arrays each arry holds movements of an account
// console.log(accountMovements);
// const allMovements = accountMovements.flat(); // this retun single array whith all movements wihtin tha bank
// console.log(allMovements);
// const overallBalance1 = allMovements.reduce((acc, mov) => acc + mov, 0); // so now it easier to get the total movements with reduce() method
// console.log(overallBalance1);

// We can be artist on this by use method Chaining
// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// Flatmap() ----------->>>

// It's essentially combines between map(), and flat() mehtods: it do map() simply if resulted array in nested it will flatened it directly
// const overallBalance2 = accounts
//   // Note: about flatMap() it always go one level and we can't change it OK
//   .flatMap(acc => acc.movements) // happen here. map with our logic and flatened the array directly
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// ----------------------------------------            SORTING             -----------------------------------

// The much discussed topic in computer science ....... there is a dozen of sorting algorithm. lets navigate Js built in sorting one

// Sort()  --------------->>>  STRINGS
// const owners = ['Yasir', 'Mujahed', 'Idrees', 'Ahmed'];
// console.log(owners.sort()); // here we got our array nicely sorted. but this accually mutate the original array. we have to be carefull with it

// // Sort()  --------------->>>  NUMBERS
// // To cosider that it works well just with strings. yes as you read and try
// console.log(movements);
// console.log(movements.sort()); // sorted in a wierd way.
// To fix that we should use it callback function. it has 2 arguments, first and next value in oreder.
//         ASCENDING ORDER
// return > 0, a - b. (1) keep order
// return < 0, b - a. (-1) switch order
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// movements.sort((a, b) => a - b); // simplify it
// console.log(movements);

// //         DEASCENDING ORDER
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);

// NOTE: that this won't work if we have mixed array with strings and numbers

// -----------------------------            FILLING & CREATING            ------------------------------

// Filling() ------------>>>

// it is to fill array with specific value or elements.
// Normal way to create array
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(arr);
// const arr1 = new Array(8, 9, 10, 11, 12, 13, 14);
// console.log(arr1);

// // Note: Array constructor with one number returns and empty array with length = that number. & we can't use map() method on it
// const arr2 = new Array(7);
// console.log(arr2);
// arr2.map(() => 5); // nothing will change, see you should be carefull when using this constructor
// console.log(arr2);
// // Fill(). as its name it fill tha array with values by start index, & end index
// // arr2.fill(1);
// // console.log(arr2); // as you see it iterate throgh the array using its index and fill it with 1 s
// // arr2.fill(1, 2); // here will start filling from index 2
// // console.log(arr2);
// arr2.fill(1, 2, 5); // it fill with 1 s from 2 to 5 indexes
// console.log(arr2);
// // we can mutate existing array with fill also
// arr.fill(23, 2, 5);
// console.log(arr);

// // Form() ---------------->>>

// // form() constructor is use. let you determin the length of your array, and accept call back function like map() method
// const arrForm = Array.from({ length: 7 }, () => 1); // this will create an array its length is 7 and fill it with 1 s
// console.log(arrForm);

// // use form() method argument the current value & its index
// const arrZ = Array.from({ length: 7 }, (_, i) => i + 1); // _Under_Score (_) call through away symbol, argument we won't use it but we have to define it
// console.log(arrZ);

// // this will be usefull when we us querySellectorAll('.class') it will return a nodeList similar to array but we can't use map() & reduce() methods on it
// // So we have to use Array.from() to perform what we want and mutate it like we want

// // lets perform it when clicking on balance label. avoiding the reload for which we loose the movements
// labelBalance.addEventListener('click', function () {
//   // lets create collects the movements from the user interface
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);

//   // another way to create array from querySellectorAll()
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')]; // ass you gessed we use spread operator
//   console.log(movementsUI2);
// });

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                  CHALLENGES
//                                 Challenge #1
// julie and kate resarch about dogs
// const checkDogs = function (dogsJulia, dogsKate) {
//   // drope the first and last dogs from julia array because they are actually cats
//   const newDogsJulia = dogsJulia.slice(); // create new array to not mess with the original argument hahahahah
//   newDogsJulia.splice(0, 1); // this will drop the first element of the array
//   newDogsJulia.splice(-2); // this will drop the last two element of the array
//   console.log(newDogsJulia);
//   const jouliaKateDogs = newDogsJulia.concat(dogsKate); // use concat() method to create array with both julia and kate dogs

//   jouliaKateDogs.forEach(function (age, i) {
//     let dogAge = age >= 3 ? 'an Adult' : ' still a Puppy';
//     console.log(`Dog number ${i + 1} is ${dogAge} and is ${age} years old`);
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// §Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

//                                 Challenge #2
// Back to the same study's Julia and Kate
// Function to 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

// 1. Calculate the dog age in human years using the following formula:
// if the dog is <= 2 years old, humanAge = 2 * dogAge.
// If the dog is > 2 years old, humanAge = 16 + dogAge * 4

// 2. Exclude all dogs that are less than 18 human years old
// (which is the same as keeping dogs that are at least 18 years old)

// 3. Calculate the average human age of all adult dogs
// (you should already know from other challenges how we calculate averages 😉)

// 4. Run the function for both test datasets

// Test data:
// §Data 1: [5, 2, 4, 1, 15, 8, 3]
// §Data 2: [16, 6, 10, 5, 6, 1, 4]

// // 1.
// const calcAverageHumanAge = function (dogsAges) {
//   // Using the formula to calculate human age from dog age and return them into array. map() method do this perfectly
//   const hummanAges = dogsAges.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   console.log(hummanAges);

//   // 2.
//   // Exclude each human age bellow 18 out of our human ages array. filter() method do this perfectly
//   const adultDogs = hummanAges.filter(hummanAge => hummanAge >= 18);
//   console.log(adultDogs);

//   // 3.
//   // Calculate the Average age of all adult. Best way of doing this is to use reduce() method
//   const averageAdultAge = adultDogs.reduce(
//     (sumAge, currAge) => sumAge + currAge / adultDogs.length,
//     0
//   );
//   console.log(averageAdultAge);
// };

// // 4.
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

//                                 Challenge #3
// rewrite the calcAverageHumanAge using Chaining and arrow function

// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// §Data 1: [5, 2, 4, 1, 15, 8, 3]
// §Data 2: [16, 6, 10, 5, 6, 1, 4]

// const calcAverageHumanAge = movements => {
//   const average = movements
//     .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//     .filter(hummanAge => hummanAge >= 18)
//     .reduce((sumAge, currAge, i, arr) => sumAge + currAge / arr.length, 0);

//   return average;
// };
// const ave1 = [5, 2, 4, 1, 15, 8, 3],
//   ave2 = [16, 6, 10, 5, 6, 1, 4];
// console.log(calcAverageHumanAge(ave1), calcAverageHumanAge(ave2));

//                                 Challenge #4

// Keep continou with Julia & Kate Research -------------------->>>

// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
// Your tasks:
// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too
// little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
// the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"
// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)
// 7. Create an array containing the dogs that are eating an okay amount of food (try
// to reuse the condition used in 6.)
// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects 😉)
// The Complete JavaScript Course
// 25Hints:
// §
// Use many different tools to solve these challenges, you can use the summary
// lecture to choose between them 😉
// §
// Being within a range 10% above and below the recommended portion means:
// current > (recommended * 0.90) && current < (recommended *
// 1.10). Basically, the current portion should be between 90% and 110% of the
// recommended portion

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// // 1.
// dogs.forEach(dog => {
//   dog.recommendedFood = dog.weight ** 0.75 * 28;
// });

// console.log(dogs);

// // 2.
// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   sarahDog.curFood > sarahDog.recommendedFood
//     ? `Sarah's Dog Eating Too Much`
//     : `Sarah's Dog Eating Too Little`
// );

// // 3.

// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(own => own.owners);
// console.log(ownersEatTooMuch);

// // 4.
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(own => own.owners);
// console.log(ownersEatTooLittle);

// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);

// // 5.
// const exactly = dogs.some(dog => dog.curFood === dog.recommendedFood);
// console.log(exactly);

// // 6.
// const okay = dog =>
//   dog.curFood > dog.recommendedFood * 0.9 &&
//   dog.curFood < dog.recommendedFood * 1.1;

// console.log(dogs.some(okay));
// // 7.
// console.log(dogs.filter(okay));

// // 8.
// const dogsSorted = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);

// console.log(dogsSorted);

// console.log(eatingTooMuch);

/** /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/ */

//                                 Challenge #Extra
// create a 100 random dice using fill and create array programatically
// const diceRoles = Array.from(
//   { length: 100 },
//   () => Math.trunc(Math.random() * 6) + 1
// ); // Wow that so interesting. now I need to set this into a Set to see just the real values
// console.log(diceRoles);
// const notRedundent = new Set(diceRoles);
// console.log(notRedundent);

/** /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/ */
//  -------------------------                   PRACTICING ARRAYs                   -------------------------
// #Advanced usage of reduce. calculate the total of overall deposit and withdrawal
// const { deposit, withdrawl } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, curr) => {
//       // curr > 0 ? (sums.deposit += curr) : (sums.withdrawl += curr);
//       sums[curr > 0 ? 'deposit' : 'withdrawl'] += curr;
//       return sums;
//     },
//     { deposit: 0, withdrawl: 0 }
//   );
// console.log(deposit, withdrawl);

// // #Advanced usage of split(), map() ...etc
// // this is a nice title -> This Is a Nice Title: Lets do function that titles all of that

// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');

//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this IS a NiCe Title'));
// console.log(convertTitleCase('thIs IS an own title but long one'));
// console.log(convertTitleCase('a here is another title with EXAMPLE'));
// console.log(convertTitleCase('the javascript an amazing on the learning way'));
