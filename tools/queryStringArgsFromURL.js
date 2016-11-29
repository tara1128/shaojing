/**
  Get query strings from a url, 获取URL参数
  By Alex, 2016-11-29 10:37
**/

"use strict";

let getQueryStringArgs = function(URL) {
  let qs = "";
  if ( !URL ) {
    qs = location.search.length > 0 ? location.search.substring(1) : "";
  } else {
    qs = URL.split("?")[1];
  }
  let args = {},
      itemsArray = qs.length > 0 ? qs.split("&") : [],
      item = null,
      name = null,
      value = null;
  for (var i = 0; i < itemsArray.length; i++) {
    item = itemsArray[i].split("=");
    name = item[0];
    value = item[1];
    if (name.length) {
      args[name] = value;
    }
  }
  return args;
};

module.exports = getQueryStringArgs; 
