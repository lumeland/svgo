import { detachNodeFromParent } from "../lib/xast.js";

export const type = "visitor";
export const active = true;
export const description = "removes comments";

/**
 * Remove comments.
 *
 * @example
 * <!-- Generator: Adobe Illustrator 15.0.0, SVG Export
 * Plug-In . SVG Version: 6.00 Build 0)  -->
 *
 * @author Kir Belevich
 *
 * @type {import('../lib/types').Plugin<void>}
 */
export function fn() {
  return {
    comment: {
      enter: (node, parentNode) => {
        if (node.value.charAt(0) !== "!") {
          detachNodeFromParent(node, parentNode);
        }
      },
    },
  };
}
