'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
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

/////////////////////////////////////////////////////////////////

// for (const movement of movements)
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You Deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You Withdrew ${Math.abs(movement)}`); // abs() is Math method that remove the negative sign(-)minus form the number
  }
}
console.log(''.padEnd(30, '*'));
//FOREACH
// forEach() Method: it is a higer ordered level function so it required a callback function. In order to tell it what to do for each element
// movement argument we passed it to forEach, so each time the callback function is called it recieve the current element as movement

// Also forEach is alot easier to access the index, and as it callback the function
// it passes in the current element of the array, and also the current element and the entir array
movements.forEach(function (mov, key, arr) {
  if (mov > 0) {
    console.log(`Movement ${key + 1}: You Deposited ${mov}`);
  } else {
    console.log(`Movement ${key + 1}: You Withdrew ${Math.abs(mov)}`); // abs() is Math method that remove the negative sign(-)minus form the number
  }
});

// this is how it works. It will call the function in each iteration to a certin element
// 0: function(200)
// 1: function(450)
// 2: function(-400)
// ...
// and so on untill the end of the array

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
