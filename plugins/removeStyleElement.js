export const type = "perItem";

export const active = false;

export const description = "removes <style> element (disabled by default)";

/**
 * Remove <style>.
 *
 * https://www.w3.org/TR/SVG11/styling.html#StyleElement
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Betsy Dupuis
 */
export function fn(item) {
  return !item.isElem("style");
}
