import { closestByName } from "../lib/xast.js";

export const type = "perItem";

export const active = true;

export const description = "removes viewBox attribute when possible";

const viewBoxElems = ["svg", "pattern", "symbol"];

/**
 * Remove viewBox attr which coincides with a width/height box.
 *
 * @see https://www.w3.org/TR/SVG11/coords.html#ViewBoxAttribute
 *
 * @example
 * <svg width="100" height="50" viewBox="0 0 100 50">
 *             ⬇
 * <svg width="100" height="50">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  if (
    item.type === "element" &&
    viewBoxElems.includes(item.name) &&
    item.attributes.viewBox != null &&
    item.attributes.width != null &&
    item.attributes.height != null
  ) {
    // TODO remove width/height for such case instead
    if (item.name === "svg" && closestByName(item.parentNode, "svg")) {
      return;
    }

    const nums = item.attributes.viewBox.split(/[ ,]+/g);

    if (
      nums[0] === "0" &&
      nums[1] === "0" &&
      item.attributes.width.replace(/px$/, "") === nums[2] && // could use parseFloat too
      item.attributes.height.replace(/px$/, "") === nums[3]
    ) {
      delete item.attributes.viewBox;
    }
  }
}
