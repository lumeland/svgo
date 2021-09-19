import { detachNodeFromParent } from "../lib/xast.js";

export const type = "visitor";
export const active = true;
export const description = "removes <title>";

/**
 * Remove <title>.
 *
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title
 *
 * @author Igor Kalashnikov
 *
 * @type {import('../lib/types').Plugin<void>}
 */
export function fn() {
  return {
    element: {
      enter: (node, parentNode) => {
        if (node.name === "title") {
          detachNodeFromParent(node, parentNode);
        }
      },
    },
  };
}
