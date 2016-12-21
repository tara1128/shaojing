/**
  Spread Syntax.
  By Alex, 2016-12-21 14:21
**/

"use strict";

/* Spread Syntax, which displays as '...' */

/* 
    The spread syntax allows an expression to be expanded in places where multiple arguments (for function calls) or multiple elements (for array literals) or multiple variables (for destructuring assignment) are expected.

    For function calls, it looks like:
    myFunction(...iterableObject);

    For array literals, it looks like:
    [...literableObject, 4, 5, 6]

*/

function myFunction( x, y, z ) {
  console.log('Print myFunction: x =', x, ', y =', y, ', z =', z );
};
// var args = [ 0, 22, 8 ];
// myFunction.apply(null, args); /* "Print myFunction: x = 0 , y = 22 , z = 8" */

/* Now with ES2015 spread, we write the above as: */
function myFunc2015( a, b, c ) {
  console.log('ES2015: a =', a, ', b =', b, ', c =', c );
};
// var args = [100, 300, 450, 90];
// myFunc2015(...args); /* "ES2015: a = 100 , b = 300 , c = 450" */
// myFunc2015(args); /* "ES2015: a = [ 100, 300, 450 ] , b = undefined , c = undefined" */

/* myFunc2015(...args) == myFunc2015.apply(null, args); */

/* Any argument in the argument list can use the spread syntax and it can be used multiple times. */
function myFunc(a,b,c,d,e,f,g) {
  console.log('my func: ',a,', ',b,', ',c,', ',d,', ',e,', ',f,', ',g );
};
var args = [10, 11];
// myFunc(-1, ...args, 22, 33, ...[44, 55]);

/* 对...object 的理解，就是literal字面上的object */
/* Literal array with '...' */
var parts = ['shoulders', 'waist'];
var ends = ['knees', 'feet', 'toes'];
var whole = ['hair', 'forehead', 'nose', ...parts, 'thigh', ...ends ];
// console.log('Whole is ', whole);

/*
    Remember?
    apply()和call()都是设置函数运行的作用域，相当于设置函数体内的this；
    第一个参数都是函数运行的作用域，不同的是第二个参数的形式：
    apply的第二个参数可以是Array实例，也可以是arguments对象：apply(null, [arg1, arg2, arg3]);
    call的第二个参数是一个一个传进来的参数列表：call(null, arg1, arg2, arg3);
*/

/* Using '...' to copy an array: */
var myarray1 = [0, 1, 2, 3];
var myarray2 = [...myarray1];
// console.log( myarray2 ); /* "[ 0, 1, 2, 3 ]" */
myarray2.push(100);
// console.log( myarray2 ); /* "[ 0, 1, 2, 3, 100 ]" */
// console.log( myarray1 ); /* "[ 0, 1, 2, 3 ]", The first array remains unaffected! */

/* A better push with '...': */
var arr1 = [1, 3, 5];
var arr2 = [10, 20, 50];
/* Append all items from arr2 into arr1: */
Array.prototype.push.apply(arr1, arr2); 
console.log('arr1 =', arr1); /* [ 1, 3, 5, 10, 20, 50 ] */
console.log('arr2 =', arr2); /* [ 10, 20, 50 ] */

/* NOTE: the spread operator can be applied only to iterable objects: */
var obj = {key: 'myValue'};
var arr = [...obj]; // TypeError: obj is not iterable!
