/**
 * util.js
 * 工具方法
 */

;(($) => {
  const util = $.util || ($.util = {});
  const class2type = {};
  const nativeToString = Object.prototype.toString;
  const nativeFilter = Array.prototype.filter;

  ['Number', 'Boolean', 'String',
  'Function', 'Array', 'Object',
  'RegExp', 'Date', 'Error'].forEach(
    type => class2type[`[object ${ type }]`] = type.toLowerCase()
  );

  /**
   * 获取变量数据类型
   */
  util.getType = (value) =>
    value == null
      ? `${ value }`
      : class2type[nativeToString.call(value)] || 'object';

  /**
   * 判断是否是字符串
  */
  util.isString = function (str) {
    return this.getType(str) === 'string';
  };

  /**
   * 判断是否是数组
  */
  util.isArray = function (arr) {
    return this.getType(arr) === 'array';
  };

  /**
   * 判断是否是函数
  */
  util.isFunction = function (func) {
    return this.getType(func) === 'function';
  };

  /**
   * 判断是否是对象
  */
  util.isObject = function (obj) {
    return this.getType(obj) === 'object';
  };

  /**
   * 判断是否是window对象
  */
  util.isWindow = (win) =>
    isObject(win)
    && win.getComputedStyle
    && win.self === win
    && Object.getPrototypeOf(win) === Window.prototype;

  /**
   * 判断是否是纯对象
  */
  util.isPlainObject = (obj) =>
    isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;

  /**
   * 判断是否是空对象
  */
  util.isEmptyObject = (obj) =>
    !Object.keys(obj).length;

  util._splitObject = function (fn) {
    return function (arr, callback) {
      const isArray = this.isArray(arr);
      const list = isArray ? arr : Object.keys(arr);

      return fn(isArray, list, arr, callback);
    };
  };

  /**
   * 遍历
   */
  util.each = util._splitObject((isArray, list, arr, callback) => {
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
  util.map = util._splitObject((isArray, list, arr, callback) => {
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
   * 清楚数组中值为null或undefined的元素
   */
  util.flatten = (arr) =>
    nativeFilter.call(arr, (value) => value != null)

})(QuickDom);
