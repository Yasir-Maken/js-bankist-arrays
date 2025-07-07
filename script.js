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
          <div class="movements__value">${mov} €</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html); // the method that insert the above text to our html document as a node
  });
};

// Compute the balance of the account on the balance lable
const calcDisplayBalance = function (acc) {
  // now we use reduce() method to acumulate all the movements which results in the account balance
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

// Display the summary of incoming and outgoing and interest amounts and put them into their lables on the html document
const calcDisplaySummary = function (acc) {
  // We will chain methods to filter and calculate the amounts above 0 as income
  const incomes = acc.movements
    .filter(deposit => deposit > 0)
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumIn.textContent = `${incomes} €`;

  // We will chain methods to filter and calculate the amounts below 0 as out
  const out = acc.movements
    .filter(withdrawl => withdrawl < 0)
    .reduce((acc, withdrawl) => acc + Math.abs(withdrawl), 0);

  labelSumOut.textContent = `${out} €`;

  // The bank interest is payed to the bank in each deposit: lets set it 1.2 for our fictional bank here to calculate the interest
  // so we need to filter our array with above 0 which is deposit, then map them to caculate the interst to each depsit, the sum all of the calculated iterest
  const interest = acc.movements
    .filter(interest => interest > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1) // we add this to exclude every interest that bellow 1. as we set it a rule by our fictional bank hahahah
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interest} €`;
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
const updateUI = function () {
  // Display Movementts
  displayMovements(currentAccount.movements);

  // Display Balance
  calcDisplayBalance(currentAccount);

  // Display Summary
  calcDisplaySummary(currentAccount);
};

// Event handler:

// Perform Login Logic
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // this to prevent the page from reload when click on the submission button cause it is always reload the page
  // Shortly prevent Form from submiting
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  // If the user credintial was correct
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display Welcome Message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // show the user board
    containerApp.style.opacity = 1;

    // Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // take the focus from the intput of login

    // update the UI with the all our functions
    updateUI();

    // Log the user the the console
    console.log(currentAccount.owner, 'LOGED IN');
  }
});

// Perform Transfere Logic
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // First we should check if the transfer input are valid

  const amount = Number(inputTransferAmount.value); // amount to transfere
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

    // Then update the UI now to see the new things that happens
    updateUI();
  }
});

// Perform Close Account Logic
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // check if the user is exist. and the pin is correct to close and delete the accont
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
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
// Some() is like a include() method so it return true or false, but some() search for a pattern or a condition, while include search for value == to value
// console.log(movements);
// // EQUALITY
// console.log(movements.includes(-130)); // it will return true if one of the array element = -130. false if not

// // CONDITION
// console.log(movements.some(mov => mov === -130)); // this gives same include() result. so it is better to use iclude when you look for equality
// console.log(movements.some(mov => mov > 0)); // this will return true if there is elements bigger than 0 (+). false if not

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
