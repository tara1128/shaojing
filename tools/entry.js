/**
  entry.js
**/

"use strict";

/* 测试数组去重 */
(function(){
  let arrayUnique = require('./modules/unique');
  let myArray = [1,3,5,7,9,1,3,5,2,4];
  let resArray = arrayUnique(myArray);
  // console.log( resArray );
}());

/* 测试获取URL参数 */
(function(){
  let getStringArgsFromURL = require('./modules/queryStringArgsFromURL');
  let myURL = 'http://shaojing.wang?name=alex&age=100&city=beijing&exp=10&whatelse=whatever';
  let resArgs = getStringArgsFromURL( myURL );
  // console.log( resArgs );
}());

/* 测试字符串中出现最多次数的字符 */
(function(){
  let theMaxDuplicateChar = require('./modules/findMaxDuplicateChar');
  // let myString = 'Hello World!';
  let myString = 'abcdefgd';
  let theMaxDupChar = theMaxDuplicateChar( myString );
  // console.log( 'Find the most display char: ', theMaxDupChar );
}());

/* 测试冒泡排序 */
(function(){
  let bubbleSort = require('./modules/bubbleSort');
  let myArray = [10, 28, 48, 20, 98, 1048, 21, 7, 27];
  let resArray = bubbleSort( myArray );
  // console.log('Bubble sort: ', resArray);
}());

/* 测试两个整数快速置换 */
(function(){
  let Swap = require('./modules/swap');
  // console.log('Swap 27 and 48: ', Swap(27, 48));
}());

/* 测试生成指定长度的随机字符串 */
(function(){
  let randomString = require('./modules/randomString');
  let n = 6;
  // console.log( 'Random string: ', randomString(n) );
}());

/* 测试在无序数组中查找最值 */
(function(){
  let theMin = require('./modules/theMinAndTheMax').min;  
  let theMax = require('./modules/theMinAndTheMax').max;  
  let array = [90, 67, 12, 100, 56, 0, 12, -18, -48, 90, 207, 98];
  // console.log('Find the min ', theMin(array));
  // console.log('Find the max ', theMax(array));
}());

/* 测试交换数组中两个指定位置的元素 */
(function(){
  let swap2EleInArray = require('./modules/swap2EleInArray');
  let myArray = [1,3,5,7,9];
  // console.log('Swap 2 elements in an array:', swap2EleInArray( myArray, 1, 4 ) );
}());

/* 测试数据自组织，将被频繁查找的元素移动到数据集的前端 */
(function(){
  let seqSearch = require('./modules/seqSearch').seqSearch;
  let seqSearchBetter = require('./modules/seqSearch').seqSearchBetter;
  let array = [10, 20, 30, 40, 50, 60, 100, 200];
  // console.log( 'array = ', array );
  for (let i = 0; i < array.length; i++) {
    seqSearchBetter( array, 100 );
    // console.log( i, array );
  }
}());

/* 测试二分查找算法 */
(function(){
  let binSearch = require('./modules/binSearch');  
  let myArray = [1,3,5,6,7,8,9,10,11,12,23,34,45,56,67,78,89,90];
  let data = 78;
  // console.log( 'BinSearch, searching', data, ': ', myArray, binSearch(myArray, data) );
}());

/* 测试一个安全的类型检测器 */
(function(){
  let typeDetector = require('./modules/typeDetector');
  let testData = {
    str: 'I am a string',
    boo: true,
    num: 138,
    obj: {name: 'Alex', age: 33},
    arr: [10, 20, 30],
    und: undefined,
    nul: null,
    reg: /\.jsx?$/,
    fun: function () { console.log('Hey') },
    jsn: {"code": 1, "data": [1,3,5,7,9], "type": "Json"},
    cst: function Person(name, city) {
      this.name = name;
      this.city = city;
    } /* Constructors defined by developers would returned [object Object] in this detector? */
  };
  /* Now let's detect all them above! */
  for ( var K in testData ) {
    // console.log( K, '======>', typeDetector( testData[K] ) );
  }
}());

let funcs = [ function a(){}, function b(){}, 'c', 'd' ];

funcs = funcs.filter(func => typeof func === 'function');

console.log('After filter: ', funcs);







