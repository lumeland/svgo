export const type = "perItem";

export const active = true;

export const params = {
  removeAny: true,
};

export const description = "removes <desc>";

var standardDescs = /^(Created with|Created using)/;

/**
 * Removes <desc>.
 * Removes only standard editors content or empty elements 'cause it can be used for accessibility.
 * Enable parameter 'removeAny' to remove any description.
 *
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Daniel Wabyick
 */
export function fn(item, params) {
  return (
    !item.isElem("desc") ||
    !(
      params.removeAny ||
      item.children.length === 0 ||
      (item.children[0].type === "text" &&
        standardDescs.test(item.children[0].value))
    )
  );
}
