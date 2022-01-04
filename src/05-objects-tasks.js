/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const newObj = JSON.parse(json);
  Object.setPrototypeOf(newObj, proto);
  return newObj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const error1 = () => {
  throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
};

const error2 = () => {
  throw new Error(
    'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
  );
};
class SelectorCreator {
  constructor() {
    this.idData = '';
    this.elementData = '';
    this.classData = [];
    this.attrData = [];
    this.pseudoClassData = [];
    this.pseudoElementData = [];
    this.combinator = '';
    this.selector = '';
    this.line = 0;
    this.availableLine = [
      'elementData',
      'idData',
      'classData',
      'attrData',
      'pseudoClassData',
      'pseudoElementData',
    ];
  }

  id(value) {
    if (this.line > 2) error2();
    if (this.idData) {
      error1();
    } else {
      this.idData = `#${value}`;
    }
    this.line = 2;
    return this;
  }

  element(value) {
    if (this.line > 1) error2();
    if (this.elementData) {
      error1();
    } else {
      this.elementData = `${value}`;
    }
    this.line = 1;
    return this;
  }

  class(value) {
    if (this.line > 3) error2();
    this.classData.push(`.${value}`);
    this.line = 3;
    return this;
  }

  attr(value) {
    if (this.line > 4) error2();
    this.attrData.push(`[${value}]`);
    this.line = 4;
    return this;
  }

  pseudoClass(value) {
    if (this.line > 5) error2();
    this.pseudoClassData.push(`:${value}`);
    this.line = 5;
    return this;
  }

  pseudoElement(value) {
    if (this.line > 6) error2();
    if (this.pseudoElementData.length !== 0) {
      error1();
    } else {
      this.pseudoElementData.push(`::${value}`);
    }
    this.line = 6;
    return this;
  }

  setCombine(combinator, selector) {
    this.combinator = combinator;
    this.selector = selector;
    return this;
  }

  stringify() {
    const link = `${this.combinator}`;
    const part1 = `${this.elementData}${this.idData}${this.classData.join('')}`;
    const part2 = `${this.attrData.join('')}${this.pseudoClassData.join('')}`;
    const part3 = `${this.pseudoElementData.join('')}${link}`;
    return part1 + part2 + part3;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new SelectorCreator().element(value);
  },

  id(value) {
    return new SelectorCreator().id(value);
  },

  class(value) {
    return new SelectorCreator().class(value);
  },

  attr(value) {
    return new SelectorCreator().attr(value);
  },

  pseudoClass(value) {
    return new SelectorCreator().pseudoClass(value);
  },

  pseudoElement(value) {
    return new SelectorCreator().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new SelectorCreator().element(
      `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
    );
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
