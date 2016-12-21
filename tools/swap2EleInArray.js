/**
  Swap two items in an array, 交换数组中指定的两个元素的位置
  By Alex, 2016-12-02 11:09
**/

"use strict";

let swap2EleInArray = function( array, index, index2 ) {
  let tmp = array[index];
  array[index] = array[index2];
  array[index2] = tmp;
  return array;
}

module.exports = swap2EleInArray;
