import { traverse } from "../lib/xast.js";
import { parseName } from "../lib/svgo/tools.js";

export const type = "full";

export const active = true;

export const description = "removes unused namespaces declaration";

/**
 * Remove unused namespaces declaration.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(root) {
  let svgElem;
  const xmlnsCollection = [];

  /**
   * Remove namespace from collection.
   *
   * @param {String} ns namescape name
   */
  function removeNSfromCollection(ns) {
    const pos = xmlnsCollection.indexOf(ns);

    // if found - remove ns from the namespaces collection
    if (pos > -1) {
      xmlnsCollection.splice(pos, 1);
    }
  }

  traverse(root, (node) => {
    if (node.type === "element") {
      if (node.name === "svg") {
        for (const name of Object.keys(node.attributes)) {
          const { prefix, local } = parseName(name);
          // collect namespaces
          if (prefix === "xmlns" && local) {
            xmlnsCollection.push(local);
          }
        }

        // if svg element has ns-attr
        if (xmlnsCollection.length) {
          // save svg element
          svgElem = node;
        }
      }

      if (xmlnsCollection.length) {
        const { prefix } = parseName(node.name);
        // check node for the ns-attrs
        if (prefix) {
          removeNSfromCollection(prefix);
        }

        // check each attr for the ns-attrs
        for (const name of Object.keys(node.attributes)) {
          const { prefix } = parseName(name);
          removeNSfromCollection(prefix);
        }
      }
    }
  });

  // remove svg element ns-attributes if they are not used even once
  if (xmlnsCollection.length) {
    for (const name of xmlnsCollection) {
      delete svgElem.attributes["xmlns:" + name];
    }
  }

  return root;
}
