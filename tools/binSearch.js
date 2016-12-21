/**
  Bin search, 二分查找算法（只对有序数列可用）
  By Alex, 2016-12-02 14:19
**/

"use strict";

/**
  NOTE:
    算法基本思想，与猜数字游戏类似。例如1-100之间猜一个数字。
    当你猜50时，对方说“大了”，你可能会猜25，对方又说“小了”…
    每一次猜，都会选择当前最大值和最小值的中间点。
    二分查找的算法思想是：（假设要查询的值为n）
    1、先将数组的第一个位置设置为下边界lowerBound
    2、再将数组的最后一个元素位置设为上边界upperBound
    3、当下边界 <= 上边界时，做如下操作：(由于上下边界在以下操作中一直在变，因此这里是一个while循环，直到上下边界变到下边界不再<=上边界为止)
      a): 中点位置mid设为上下边界之和除以2；
      b): 如果中点mid所在元素array[mid] < n，将下边界设为中点mid元素位置+1
      c): 如果中点mid所在元素array[mid] > n，将上边界设为中点mid元素位置-1
      d): 否则中点元素array[mid]即为n，返回mid即为要查询的元素的位置。
**/

let binSearch = function(array, data) {
  let lowerBound = 0;
  let upperBound = array.length - 1;
  while ( lowerBound <= upperBound ) {
    let mid = Math.floor( (lowerBound + upperBound)/2 );
    console.log('二分查找，当前的中点是：', array[mid]);
    if( array[mid] < data ) {
      lowerBound = mid + 1;
    } else if ( array[mid] > data ) {
      upperBound = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
};

module.exports = binSearch;
