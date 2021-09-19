import { detachNodeFromParent } from "../lib/xast.js";

export const type = "visitor";
export const active = false;
export const description = "removes <style> element (disabled by default)";

/**
 * Remove <style>.
 *
 * https://www.w3.org/TR/SVG11/styling.html#StyleElement
 *
 * @author Betsy Dupuis
 *
 * @type {import('../lib/types').Plugin<void>}
 */
export function fn() {
  return {
    element: {
      enter: (node, parentNode) => {
        if (node.name === "style") {
          detachNodeFromParent(node, parentNode);
        }
      },
    },
  };
}
