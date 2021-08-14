import { detachNodeFromParent } from "../lib/xast.js";

export const type = "visitor";
export const active = false;
export const description = "removes raster images (disabled by default)";

/**
 * Remove raster images references in <image>.
 *
 * @see https://bugs.webkit.org/show_bug.cgi?id=63548
 *
 * @author Kir Belevich
 */
export function fn() {
  return {
    element: {
      enter: (node, parentNode) => {
        if (
          node.name === "image" &&
          node.attributes["xlink:href"] != null &&
          /(\.|image\/)(jpg|png|gif)/.test(node.attributes["xlink:href"])
        ) {
          detachNodeFromParent(node, parentNode);
        }
      },
    },
  };
}
