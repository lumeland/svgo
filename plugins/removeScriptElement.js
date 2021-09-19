import { detachNodeFromParent } from "../lib/xast.js";

export const type = "visitor";
export const active = false;
export const description = "removes <script> elements (disabled by default)";

/**
 * Remove <script>.
 *
 * https://www.w3.org/TR/SVG11/script.html
 *
 * @author Patrick Klingemann
 *
 * @type {import('../lib/types').Plugin<void>}
 */
export function fn() {
  return {
    element: {
      enter: (node, parentNode) => {
        if (node.name === "script") {
          detachNodeFromParent(node, parentNode);
        }
      },
    },
  };
}
