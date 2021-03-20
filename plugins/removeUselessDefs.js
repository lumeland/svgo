export const type = "perItem";

export const active = true;

export const description = "removes elements in <defs> without id";

import { elemsGroups } from "./_collections.js";
var nonRendering = elemsGroups.nonRendering;

/**
 * Removes content of defs and properties that aren't rendered directly without ids.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Lev Solntsev
 */
export function fn(item) {
  if (item.isElem("defs")) {
    item.children = getUsefulItems(item, []);
    if (item.children.length === 0) {
      return false;
    }
  } else if (item.isElem(nonRendering) && !item.hasAttr("id")) {
    return false;
  }
}

function getUsefulItems(item, usefulItems) {
  for (const child of item.children) {
    if (child.type === "element") {
      if (child.hasAttr("id") || child.isElem("style")) {
        usefulItems.push(child);
        child.parentNode = item;
      } else {
        child.children = getUsefulItems(child, usefulItems);
      }
    }
  }

  return usefulItems;
}
