/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var compare = function compare(a, b) {
  if (a < b) {
    return -1;
  } else if (b < a) {
    return 1;
  }

  return 0;
};

var getSafeFunction = function getSafeFunction(orderItem, propName) {
  var prop = orderItem[propName];

  if (typeof prop !== 'function') {
    throw new Error('Provided "' + propName + '" is not a function');
  }

  return prop;
};

var getCompareFunction = function getCompareFunction(orderItem) {
  var compareFunction = orderItem.compareFn ? getSafeFunction(orderItem, 'compareFn') : compare;

  return orderItem.descending ? function (a, b) {
    return -1 * compareFunction(a, b);
  } : compareFunction;
};

var getValue = function getValue(a, orderItem) {
  if (!orderItem.prop && orderItem.prop !== 0) {
    throw new Error('No "prop" on order item provided');
  }

  var value = a[orderItem.prop];

  return orderItem.converterFn ? getSafeFunction(orderItem, 'converterFn')(value) : value;
};

var sophComparator = function sophComparator(orderList) {
  if (!orderList || orderList.length === 0) {
    return compare;
  }

  if (orderList.length === 1 && !orderList[0].prop) {
    var orderItem = orderList[0];
    var compareFunction = getCompareFunction(orderItem);

    if (orderItem.converterFn) {
      var converterFunction = getSafeFunction(orderItem, 'converterFn');

      return function (a, b) {
        return compareFunction(converterFunction(a), converterFunction(b));
      };
    }

    return compareFunction;
  }

  return function (a, b) {
    for (var index = 0; index < orderList.length; index += 1) {
      var _orderItem = orderList[index];
      var _compareFunction = getCompareFunction(_orderItem);
      var compareResult = _compareFunction(getValue(a, _orderItem), getValue(b, _orderItem));

      if (compareResult) {
        return compareResult;
      }
    }

    return 0;
  };
};

module.exports = sophComparator;

/***/ })
/******/ ]);