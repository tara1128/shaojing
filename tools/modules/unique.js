/**
  Unique an array, 数组去重
  By Alex, 2016-11-29 10:25
**/

"use strict";

let unique = function(array) {
  let hashes = {};
  let datas = [];
  for (let i = 0; i < array.length; i++) {
    if (!hashes[ array[i] ]) {
      hashes[ array[i] ] = true;
      datas.push( array[i] );
    }
  }
  return datas;
}

module.exports = unique;
