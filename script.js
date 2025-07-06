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
////////////////////////////////////////////////////////////////////
//                          THE LOGIC
// This funcion displays the all user movements
const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; // this empty the movement from elements that we have set to represent our desing

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; // check wether the movement is deposit or withdrawal according to the movement value
    // the html that represent the movment on our ui, and insert it to its right place
    const html = ` 
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html); // the method that insert the above text to our html document as a node
  });
};
displayMovements(account1.movements);

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
console.log(accounts);

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
// MAP
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

// FILTER

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
