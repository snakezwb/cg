/**
 * dom
 * 快速，简洁，常用的DOM操作
 */

var Dom = (Util) => {
  const tagRE = /<(\w+)[^>]*>/i;
  const singleTagRE = /<([\w+])\s*\/?>(?:<\/\1>|)/;
  const simpleSelectorRE = /^[\w-]*$/;
  const parentMap = {
    li: document.createElement('ul'),
    *: document.createElement('div')
  };
  const operators = ['after', 'append', 'before', 'prepend'];

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
  const percolator = (elements, selector) => {
    return selector == null
      ? Dom(elements)
      : Dom(Util.filter(elements, (element) => element.matches(selector)));
  };

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
      Util.each(elements, (element, index) => {
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
        (element, index, arr) =>
          callback.call(element, index, element, arr) !== false);

      return this;
    },

    /**
     * 实例所有的元素通过callback处理并且由返回值进行替换元素
     */
    map(callback) {
      return $(Util.map(this, (element, index, arr) =>
        callback.call(element, index, element, arr));
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

    /**
     * 返回通过选择器封装的索引对应的元素
     */
    eq(index) {
      return $(index == null ? this[0] : this.get(index));
    },

    /**
     * 返回通过选择器封装的第一个元素
     */
    first() {
      return this.eq();
    }

    /**
     * 返回通过选择器封装的最后一个元素
     */
    last() {
      return this.eq(this.length - 1);
    },

    /**
     * 删除实例中的所有元素
     */
    remove() {
      return this.each((_, element) => element.parentNode.removeChild(element));
    },

    /**
     * 实例的所有元素查找子元素并且返回新的实例
     */
    find(selector) {
      if (!selector) {
        return Dom();
      }

      return this.map((_, element) => qsa(element, selector));
    },

    closest(selector, context) {
      const nodes = [];

      this.each((_, element) => {
        while (element && !(element.matches(selector))) {
          element = element.parentNode;
        }

        element !== context && nodes.push(element);
      });

      return Dom(Util.flatten(Util.uniq(nodes)));
    },

    parents(selector) {
      const parents = [];
      let res = this;

      while (res.length) {
        res = Util.map(res, (element) => {
          if ((element = element.parentNode) !== document) {
            parents.push(element);
            return element;
          }
        });
      }

      return percolator(Util.uniq(parents), selector);
    },

    parent(selector) {
      const parents = Util.map(this, (element) => {
        if ((element = element.parentNode) !== document) {
          return element;
        }
      });

      return percolator(Util.uniq(parents), selector);
    },

    children(selector) {
      const childs = Util.parseArrayToSimple(
        Util.map(this, (element) => element.children));

      return percolator(childs, selector);
    },

    siblings(selector) {
      const childs = Util.parseArrayToSimple(
        Util.map(this, (element) => element.parentNode.children)
      );
      const siblings = Util.filter(this.toArray(), (element) => !(currs.find(element)));

      return percolator(siblings, selector);
    },

    next(selector) {
      const nexts = Util.map(this, (element) => element.nextElementSibling);
      return percolator(nexts, selector);
    },

    prev(selector) {
      const prevs = Util.map(this, (element) => element.prevElementSibling);
      return percolator(prevs, selector);
    },

    empty() {
      return this.each((_, element) => {
        element.innerHTML = '';
      });
    },

    replaceWith(htmlFragment) {
      return this.before(htmlFragment).remove();
    },

    wrapAll(htmlFragment) {
      const self = this.replaceWith(htmlFragment = $(htmlFragment));

      return htmlFragment.append(self);
    }

  };

  Util.each(operators, (value, index) => {
    const inner = index % 2;

    Dom.fn[value] = function (...args) {
      const newElements = Util.map(args, (arg) => {
        if (Object.getPrototypeOf(arg) === Dom.prototype) {
          return arg.toArray();
        } else if (tagRE.test(arg)) {
          return $(arg).get(0);
        } else {
          return arg;
        }
      });

      return this.each((_, target) => {
        const parent = inner ? target : target.parentNode;
        target = index === 0 ? target.nextSibling :
                 index === 1 ? null :
                 index === 2 ? target :
                 target.firstChild;

        Util.each(newElements, (element) =>
          parent.insertBefore(element, target);
        );
      });
    };

    if (inner) {
      Dom.fn[`${ value }To`] = function (html) {
        $(html)[value](this);

        return this;
      };
    }
  });

  Dom.fn._init.prototype = Dom.fn;

  return Dom;
};

if (typeof exports !== 'undefined' && module.exports) {
  // CommonJS
  const Util = require('./util');
  module.exports = Dom(Util);
} else if (typeof define !== 'undefined' && define.amd) {
  // Amd
  define(['util'], (Util) => Dom(Util));
} else {
  // Browser
  window.Dom = Dom(Util);
}
