/**
  Sequence search, 将被查找最频繁的元素移到数据集的起始位置
  By Alex, 2016-12-02 11:25
**/

"use strict";

/**
  NOTE:
  数据查找的 80-20原则 ：80%的查找操作都是对其中20%的数据进行查找。（Pareto分布）
  在程序运行的过程中，将频繁查找的元素移动到起始位置。（自组织数据）
**/
let swap2EleInArray = require('./swap2EleInArray');
let seqSearch = function(array, data) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == data) { // 在数据集中找到了指定元素
      if (i > 0) { // 当这个元素不是在起始位置时，将其往前移动一位
        swap2EleInArray(array, i, i-1);
        // console.log( 'Moved: array ===> ', array );
      }
      return true;
    }
  }
  return false;
};
let seqSearchBetter = function(array, data) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == data && i > (array.length * 0.2)) { /* 在一定范围之外的元素才移动 */
      swap2EleInArray(array, i, i-1);
      return true;
    } else if (array[i] == data) {
      return true;
    }
  }
  return false;
};

module.exports = {seqSearch: seqSearch, seqSearchBetter: seqSearchBetter};
