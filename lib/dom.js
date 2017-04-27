/**
 * dom
 * 快速，简洁，常用的DOM操作
 */

var Dom = (() => {
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
      $element = Dom(tagName);
    }

    if (!element) {
      !(tagName in parentMap) && (tagName = '*');
      parent = parentMap[tagName];
      parent.innerHTML = htmlFragment;
      $element = Dom(parent.childNodes);
    }

    if (Util.isPlainObject(props)) {
      Util.each(props, (value, key) => {
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
  const getSuitIndex = (index, max, min = 0) =>
    index == null
      ? void 0
      : index < min
        ? max + index
        : index >= max
          ? max - 1
          : index;

  function Dom (selector, context) {
    let elements = null;

    if (!selector) {
      return new Dom.fn._init();
    } else if (Util.isString(selector)) {
      if (selector.charAt(0) === '<' && tagRE.test(selector)) {
        elements = createFragment(selector, RegExp.$1, props), selector = '';
      } else {
        elements = qsa(context || document, selector);
      }
    } else if (Util.isFunction(selector)) {
      return $(document).ready(selector);
    } else if (Dom.prototype.isPrototypeOf(selector) === Dom.fn) {
      return selector;
    } else if (Util.isArray(selector)) {
      elements = Util.flatten(selector), selector = '';
    } else if (Util.isObject(selector)) {
      elements = [ selector ], selector = '';
    }

    return new Dom.fn._init(elements, selector);
  }


  Dom.fn = Dom.prototype = {
    constructor: Dom,

    _init(elements = [], selector = '') {
      Dom.each(elements, (element, index) => {
        this[index] = element;
      });

      this.length = elements.length;
      this.selector = selector;
    },

    ready(callback) {
      if (document.readyState === 'complete') {
        callback(Dom);
      } else {
        const handler = () => {
          document.removeEventListener('DOMContentLoaded', handler, false);
          callback(Dom);
        };

        document.addEventListener('DOMContentLoaded', handler, false);
      }

      return this;
    },

    get(index) {
      const suitIndex = getSuitIndex(index, this.length);

      return suitIndex === void 0
        ? Util.slice(this, 0)
        : this[suitIndex];
    },

    toArray() {
      return this.get();
    },

    /**
     * 实例所有的元素进行遍历
     */
    each(callback) {
      Util.every(
        this,
        (element, ...args) =>
          callback.apply(element, [ element, ...args]) !== false);

      return this;
    },

    /**
     * 实例所有元素是否有一个元素匹配selector
     */
    is(selector) {
      return Util.some(
        this,
        (element) =>
          element.matches(selector));
    },

    /**
     * 在实例所有元素中找出匹配selector的
     */
    filter(selector) {
      return $(Util.filter(this, (element) => element.matches(selector)));
    },

    /**
     * 在实例所有元素中找出不匹配selector的
     */
    not(selector) {
      const matches = Util.filter(this, (element) => element.matches(selector));
      const elements = [];

      Util.each(this,
        (element) => !matches.find(element) && elements.push(element));

      return $(elements);
    },

    eq(index) {
      return $(index == null ? this[0] : this.get(index));
    },

    first() {
      return this.eq();
    }

    last() {
      return this.eq(this.length - 1);
    }
  };

  Dom.fn._init.prototype = Dom.fn;
})();

if (typeof exports !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = Dom;
} else if (typeof define !== 'undefined' && define.amd) {
  // Amd
  define(() => Dom);
} else {
  // Browser
  window.Dom = Dom;
}
