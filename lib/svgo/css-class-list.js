export default class CSSClassList {
  constructor(node) {
    this.parentNode = node;
    this.classNames = new Set();
    const value = node.attributes.class;
    if (value != null) {
      this.addClassValueHandler();
      this.setClassValue(value);
    }
  }

  // attr.class.value

  addClassValueHandler() {
    Object.defineProperty(this.parentNode.attributes, "class", {
      get: this.getClassValue.bind(this),
      set: this.setClassValue.bind(this),
      enumerable: true,
      configurable: true,
    });
  }

  getClassValue() {
    var arrClassNames = Array.from(this.classNames);
    return arrClassNames.join(" ");
  }

  setClassValue(newValue) {
    if (typeof newValue === "undefined") {
      this.classNames.clear();
      return;
    }
    var arrClassNames = newValue.split(" ");
    this.classNames = new Set(arrClassNames);
  }

  add(/* variadic */) {
    this.addClassValueHandler();
    Object.values(arguments).forEach(this._addSingle.bind(this));
  }

  _addSingle(className) {
    this.classNames.add(className);
  }

  remove(/* variadic */) {
    this.addClassValueHandler();
    Object.values(arguments).forEach(this._removeSingle.bind(this));
  }

  _removeSingle(className) {
    this.classNames.delete(className);
  }

  item(index) {
    var arrClassNames = Array.from(this.classNames);
    return arrClassNames[index];
  }

  toggle(className, force) {
    if (this.contains(className) || force === false) {
      this.classNames.delete(className);
    }
    this.classNames.add(className);
  }

  contains(className) {
    return this.classNames.has(className);
  }
}
