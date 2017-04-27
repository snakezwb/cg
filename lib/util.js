/**
 * Util.js
 * 工具方法
 */

var Util = (() => {
  const class2type = {};
  const nativeToString = Object.prototype.toString;
  const nativeFilter = Array.prototype.filter;
  const nativeSlice = Array.prototype.slice;
  const nativeEvery = Array.prototype.every;
  const nativeSome = Array.prototype.some;

  ['Number', 'Boolean', 'String',
  'Function', 'Array', 'Object',
  'RegExp', 'Date', 'Error'].forEach(
    type => class2type[`[object ${ type }]`] = type.toLowerCase()
  );

  /**
   * 截取数组子元素
   */
  Util.slice = (arr, start, end) =>
    nativeSlice.call(arr, start, end);

  /**
   * 数组过滤
   */
  Util.filter = (arr, callback) =>
    nativeFilter.call(arr, callback);

  /**
   * 遍历数组，如果callback返回false，立即中止遍历返回false,否则返回true
   */
  Util.every = (arr, callback) =>
    nativeEvery.call(arr, callback);

  /**
   * 遍历数组，如果callback返回true，立即中止遍历返回true,否则返回false
   */
  Util.some = (arr, callback) =>
    nativeSome.call(arr, callback);

  /**
   * 获取变量数据类型
   */
  Util.getType = (value) =>
    value == null
      ? `${ value }`
      : class2type[nativeToString.call(value)] || 'object';

  /**
   * 判断是否是字符串
   */
  Util.isString = function (str) {
    return this.getType(str) === 'string';
  };

  /**
   * 判断是否是数组
   */
  Util.isArray = function (arr) {
    return this.getType(arr) === 'array';
  };

  /**
   * 判断是否是函数
   */
  Util.isFunction = function (func) {
    return this.getType(func) === 'function';
  };

  /**
   * 判断是否是对象
   */
  Util.isObject = function (obj) {
    return this.getType(obj) === 'object';
  };

  /**
   * 判断是否是window对象
   */
  Util.isWindow = (win) =>
    isObject(win)
    && win.getComputedStyle
    && win.self === win
    && Object.getPrototypeOf(win) === Window.prototype;

  /**
   * 判断是否是纯对象
   */
  Util.isPlainObject = (obj) =>
    isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;

  /**
   * 判断是否是空对象
   */
  Util.isEmptyObject = (obj) =>
    !Object.keys(obj).length;

  Util._splitObject = function (fn) {
    return function (arr, callback) {
      const isArray = this.isArray(arr);
      const list = isArray ? arr : Object.keys(arr);

      return fn(isArray, list, arr, callback);
    };
  };

  /**
   * 遍历
   */
  Util.each = Util._splitObject((isArray, list, arr, callback) => {
    let i = 0;
    let len = list.length;
    let key, value;

    for (; i < len; i++) {
      key = isArray ? i : list[i];
      value = arr[key];

      if (callback.call(value, value, key, arr) === false) {
        return arr;
      }
    }

    return arr;
  });

  /**
   * 通过callback处理数组或对象的元素，并且替换成callback的返回结果
   */
  Util.map = Util._splitObject((isArray, list, arr, callback) => {
    let res = [];
    let i = 0;
    let len = list.length;
    let key, value;

    for (; i < len; i++) {
      key = isArray ? i : list[i];
      value = arr[key];
      res.push(callback.call(value, value, key, arr));
    }

    return res;
  });

  /**
   * 清除数组中值为null或undefined的元素
   */
  Util.flatten = function (arr) {
    return this.filter(arr, (value) => value != null);
  };

  /**
   * 数组去重
   */
  Util.uniq = function (arr) {
    return this.filter(arr, (value, index) =>
      !index || arr.indexOf(value) === index
    );
  };

  return Util;
})();


if (typeof exports !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = Util;
} else if (typeof define !== 'undefined' && define.amd) {
  // Amd
  define(() => Util);
} else {
  // Browser
  window.Util = Util;
}
