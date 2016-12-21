/**
  Type detector.
  By Alex, 2016-12-21 18:00
**/

"use strict";

let typeDetector = function(value) {
  let _detector = Object.prototype.toString;
  let _checkout = _detector.call(value);
  switch ( _checkout ) {
    case '[object RegExp]':
      return 'RegExp';
    case '[object String]':
      return 'String';
    case '[object Number]':
      return 'Number';
    case '[object Function]':
      return 'Function';
    case '[object Array]':
      return 'Array';
    case '[object Object]':
      return 'Object';
    case '[object JSON]':
      return 'JSON';
    case '[object Boolean]':
      return 'Boolean';
    default:
      return 'Type Not Found!';
  }
};

module.exports = typeDetector;
