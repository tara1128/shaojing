/**
  Find the max duplicate char, 找到重复次数最多的字符
  By Alex, 2016-11-29 10:56
**/

"use strict";

let theMaxDuplicateChar = function(str) {
  if (str.length == 1) {
    return str;
  }
  let charObj = {}; /* Key would be the string, value would be the count of appearance of it */
  for (let i = 0; i < str.length; i++) {
    let currentChar = str.charAt(i);
    if ( !charObj[ currentChar ] ) {
      charObj[ currentChar ] = 1; /* If not existed before, make value 1 */
    } else {
      charObj[ currentChar ] += 1; /* If has already existed, make value + 1, counting... */
    }
  } /* End of loop in str */
  let maxChar = '';
  let maxValue = 1;
  /* Now let's find the max char and its value: */
  for ( let chr in charObj ) {
    if ( charObj[chr] >= maxValue ) {
      maxChar = chr;
      maxValue = charObj[chr];
    }
  }
  return maxChar;
};

module.exports = theMaxDuplicateChar;
