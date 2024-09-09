'use strict';

const juliData1 = [3, 5, 2, 12, 7];
const kateData1 = [4, 1, 15, 8, 3];

const juliData2 = [];
const kateData2 = [];

const juliDogs = juliData1.slice(0, -2);
const allDogs = juliDogs.concat(kateData1);

allDogs.forEach(function (dog, i) {
  if (dog >= 3)
    console.log(`Dog number ${i + 1} is Adult, and is ${dog} years old`);
  else console.log(`Dog number ${i + 1} is still a Puppy`);
});
