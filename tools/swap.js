/**
  Swap two numbers, 快速置换两个整数
  By Alex, 2016-11-29 11:21
**/

"use strict";

let swap = function( a, b ) {
  b = b - a;
  a = a + b;
  b = a - b;
  return [a, b];
};

module.exports = swap;
