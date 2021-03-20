export const type = "perItem";

export const active = false;

export const description = "removes <script> elements (disabled by default)";

/**
 * Remove <script>.
 *
 * https://www.w3.org/TR/SVG11/script.html
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Patrick Klingemann
 */
export function fn(item) {
  return !item.isElem("script");
}
