/**
  stack, push, pop, getMin, 栈, 进栈, 出栈, 取最小值
  时间复杂度和空间复杂度都是最小 o(1)
  By Alex, 2017-01-04 22:07
**/

"use strict";

function myStack() {
  this.dataStore = [];
  this.top = 0;
  this.push = function() {
    console.log('this ====> ', this);
  }
  this.pop = pop;
  this.peek = peek;
  this.getMin = getMin;
};

function push(element) {
};

function pop() {
};
function peek() {
};
function getMin() {
};

var stack = new myStack();
stack.push("Hello");
// module.exports = myStack;
