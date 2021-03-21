// https://github.com/css/csso/blob/master/lib/restructure/prepare/specificity.js

export default function specificity(simpleSelector) {
  var A = 0;
  var B = 0;
  var C = 0;

  simpleSelector.children.forEach(function walk(node) {
    switch (node.type) {
      case "SelectorList":
      case "Selector":
        node.children.forEach(walk);
        break;

      case "IdSelector":
        A++;
        break;

      case "ClassSelector":
      case "AttributeSelector":
        B++;
        break;

      case "PseudoClassSelector":
        switch (node.name.toLowerCase()) {
          case "not":
            node.children.forEach(walk);
            break;

          case "before":
          case "after":
          case "first-line":
          case "first-letter":
            C++;
            break;

          // TODO: support for :nth-*(.. of <SelectorList>), :matches(), :has()

          default:
            B++;
        }
        break;

      case "PseudoElementSelector":
        C++;
        break;

      case "TypeSelector":
        // ignore universal selector
        if (node.name.charAt(node.name.length - 1) !== "*") {
          C++;
        }
        break;
    }
  });

  return [A, B, C];
}
