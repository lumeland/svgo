export const type = "perItem";

export const active = true;

export const description = "removes <metadata>";

/**
 * Remove <metadata>.
 *
 * https://www.w3.org/TR/SVG11/metadata.html
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  return !item.isElem("metadata");
}
