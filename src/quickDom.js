/**
 * quickDom
 * 快速，常用的DOM操作
 */

var QuickDom = (() => {
  const tagRE = /<(\w+)[^>]*>/i;
  const singleTagRE = /<([\w+])\s*\/?>(?:<\/\1>|)/;
  const simpleSelectorRE = /^[\w-]*$/;
  const parentMap = {
    li: document.createElement('ul'),
    *: document.createElement('div')
  };

  const createFragment = (htmlFragment, tagName, props) => {
    let $element, parent;

    if (singleTagRE.test(html)) {
      $element = QuickDom(tagName);
    }

    if (!element) {
      !(tagName in parentMap) && (tagName = '*');
      parent = parentMap[tagName];
      parent.innerHTML = htmlFragment;
      $element = QuickDom(parent.childNodes);
    }

    if (QuickDom.isPlainObject(props)) {
      QuickDom.util.each(props, (value, key) => {
        $element.attr(key, value);
      });
    }

    return element;
  };
  const qsa = (element, selector) => {
    let maybeId = selector.charAt(0) === '#';
    let maybeClass = selector.charAt(0) === '.';
    let maybeTag = maybeId || maybeClass ? false : true;
    let nameOnly = maybeTag ? selector : selector.slice(1);
    let maybeMulti = simpleSelectorRE.test(nameOnly);
    let found;

    return maybeMulti
      ? document.querySelectorAll(selector)
      : maybeId
        ? (found = document.getElementById(nameOnly))
          ? [found] : []
        : maybeClass
          ? document.getElementsByClassName(nameOnly)
          : maybeTag
            ? document.getElementsByTagName(nameOnly);
  };

  function QuickDom (selector, context) {
    let elements = null;

    if (!selector) {
      return new QuickDom.fn._init();
    } else if (QuickDom.util.isString(selector)) {
      if (selector.charAt(0) === '<' && tagRE.test(selector)) {
        elements = createFragment(selector, RegExp.$1, props), selector = '';
      } else {
        elements = qsa(context || document, selector);
      }
    } else if (QuickDom.util.isFunction(selector)) {
      return $(document).ready(selector);
    } else if (QuickDom.prototype.isPrototypeOf(selector) === QuickDom.fn) {
      return selector;
    } else if (QuickDom.util.isArray(selector)) {
      elements = QuickDom.util.flatten(selector), selector = '';
    } else if (QuickDom.util.isObject(selector)) {
      elements = [ selector ], selector = '';
    }

    return new QuickDom.fn._init(elements, selector);
  }

  QuickDom.fn = QuickDom.prototype = {
    constructor: QuickDom,

    _init(elements = [], selector = '') {
      QuickDom.each(elements, (element, index) => {
        this[index] = element;
      });

      this.length = elements.length;
      this.selector = selector;
    },

    ready(callback) {
      if (document.readyState === 'complete') {
        callback(QuickDom);
      } else {
        const handler = () => {
          document.removeEventListener('DOMContentLoaded', handler, false);
          callback(QuickDom);
        };

        document.addEventListener('DOMContentLoaded', handler, false);
      }

      return this;
    }
  };
  QuickDom.fn._init.prototype = QuickDom.fn;
})();

if (typeof exports !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = QuickDom;
} else if (typeof define !== 'undefined' && define.amd) {
  // Amd
  define(() => QuickDom);
} else {
  // Browser
  window.quickDom = QuickDom;
}
