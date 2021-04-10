export const type = "perItem";

export const active = false;

export const description = "removes raster images (disabled by default)";

/**
 * Remove raster images references in <image>.
 *
 * @see https://bugs.webkit.org/show_bug.cgi?id=63548
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  if (
    item.type === "element" &&
    item.name === "image" &&
    item.attributes["xlink:href"] != null &&
    /(\.|image\/)(jpg|png|gif)/.test(item.attributes["xlink:href"])
  ) {
    return false;
  }
}
