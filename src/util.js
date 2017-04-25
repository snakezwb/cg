/**
 * util.js
 * 工具方法
 */

;(($) => {
  const util = $.util || ($.util = {});
  const class2type = {};
  const nativeToString = Object.prototype.toString;

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

  util.isString = function (str) {
    return this.getType(str) === 'string';
  };

  util.isArray = function (arr) {
    return this.getType(arr) === 'array';
  };

  util.isFunction = function (func) {
    return this.getType(func) === 'function';
  };

  util.isObject = function (obj) {
    return this.getType(obj) === 'object';
  };

  util.isWindow = (win) =>
    isObject(win)
    && win.getComputedStyle
    && win.self === win
    && Object.getPrototypeOf(win) === Window.prototype;

  util.isPlainObject = (obj) =>
    isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;

  util.isEmptyObject = (obj) =>
    !Object.keys(obj).length;
})(QuickDom);
