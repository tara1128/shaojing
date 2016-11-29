/**
  entry.js
**/

"use strict";

/* 测试数组去重 */
(function(){
  let arrayUnique = require('./unique');
  let myArray = [1,3,5,7,9,1,3,5,2,4];
  let resArray = arrayUnique(myArray);
  console.log( resArray );
}());

/* 测试获取URL参数 */
(function(){
  let getStringArgsFromURL = require('./queryStringArgsFromURL');
  let myURL = 'http://shaojing.wang?name=alex&age=100&city=beijing&exp=10&whatelse=whatever';
  let resArgs = getStringArgsFromURL( myURL );
  console.log( resArgs );
}());

/* 测试字符串中出现最多次数的字符 */
(function(){
  let theMaxDuplicateChar = require('./findMaxDuplicateChar');
  let myString = 'Hello World!';
  let theMaxDupChar = theMaxDuplicateChar( myString );
  console.log( theMaxDupChar );
}());

/* 测试冒泡排序 */
(function(){
  let bubbleSort = require('./bubbleSort');
  let myArray = [10, 28, 48, 20, 98, 1048, 21, 7, 27];
  let resArray = bubbleSort( myArray );
  console.log('Bubble sort: ', resArray);
}());

/* 测试两个整数快速置换 */
(function(){
  let Swap = require('./swap');
  console.log('Swap 27 and 48: ', Swap(27, 48));
}());

/* 测试生成指定长度的随机字符串 */
(function(){
  let randomString = require('./randomString');
  let n = 6;
  console.log( 'Random string: ', randomString(n) );
}())
