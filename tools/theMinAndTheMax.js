/**
  Find the min and the max in an array without order, 在无序数组中找最值
  By Alex, 2016-12-01 11:05
**/

"use strict";

let theMin = function(array) {
  if ( array.length ) {
    let minValue = array[0];
    array.forEach(function(item, index) {
      if ( item < minValue ) {
        minValue = item;
      }
    });
    return minValue;
  }
};

let theMax = function(array) {
  if ( array.length ) {
    let maxValue = array[0];
    array.forEach(function(item, index) {
      if ( item > maxValue ) {
        maxValue = item;
      }
    });
    return maxValue;
  }
};

module.exports = {min: theMin, max: theMax};
