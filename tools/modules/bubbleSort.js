/**
  Bubble sort, 冒泡排序
  By Alex, 2016-11-29 11:10
**/

"use strict";

let bubbleSort = function( array ) {
  let tmp = 0;
  for ( let i = 0, len = array.length; i < len; i ++ ) {
    for ( let j = 0; j < len - 1 - i; j++ ) {
      if( array[j] > array[j + 1] ) {
        tmp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = tmp;
      }
    }
  }
  return array;
};

module.exports = bubbleSort;
