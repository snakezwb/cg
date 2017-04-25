/**
 * quickDom
 * 快速，常用的DOM操作
 */

;(function (win, factory) {
  if (typeof exports !== 'undefined' && module.exports) {
    // commonJS
    module.exports = factory();
  } else if (typeof define !== 'undefined' && define.amd) {
    // amd
    define(() => factory());
  } else {
    // 浏览器原生
    win.quickDom = factory();
  }
})(window, () => {
  function QuickDom (selector, context) {
    if (!selector) {
      return new QuickDom.fn._init();
    } else if () {

    }
  }

  QuickDom.fn = QuickDom.prototype = {
    constructor: QuickDom,

    _init(elements, selector) {

    }
  };

  QuickDom.fn._init.prototype = QuickDom.fn;

  return QuickDom;
});
