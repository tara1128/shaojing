/**
  Generate a random string with a specific length, 随机生成指定长度字符串
  By Alex, 2016-11-29 11:30
**/

"use strict";

let randomString = function(n) {
  let string = 'abcdefghijklmnopqrstuvwxyz0123456789_';
  let tmp = '';
  for ( let i = 0; i < n; i++ ) {
    tmp += string.charAt( Math.floor( Math.random() * string.length ) );
  }
  return tmp;
};

module.exports = randomString;
