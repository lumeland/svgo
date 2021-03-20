export const type = "perItemReverse";

export const active = true;

export const description = "removes empty container elements";

import { elemsGroups } from "./_collections.js";
var container = elemsGroups.container;

/**
 * Remove empty containers.
 *
 * @see https://www.w3.org/TR/SVG11/intro.html#TermContainerElement
 *
 * @example
 * <defs/>
 *
 * @example
 * <g><marker><a/></marker></g>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  return (
    item.isElem(container) === false ||
    (item.type === "element" && item.children.length !== 0) ||
    item.isElem("svg") ||
    // empty patterns may contain reusable configuration
    (item.isElem("pattern") && Object.keys(item.attributes).length !== 0) ||
    // The 'g' may not have content, but the filter may cause a rectangle
    // to be created and filled with pattern.
    (item.isElem("g") && item.hasAttr("filter")) ||
    // empty <mask> hides masked element
    (item.isElem("mask") && item.hasAttr("id"))
  );
}
