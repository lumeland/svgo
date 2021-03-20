export const type = "perItem";

export const active = true;

export const description =
  "removes non-inheritable group’s presentational attributes";

import {
  attrsGroups,
  inheritableAttrs,
  presentationNonInheritableGroupAttrs,
} from "./_collections.js";

/**
 * Remove non-inheritable group's "presentation" attributes.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  if (item.type === "element" && item.name === "g") {
    for (const name of Object.keys(item.attributes)) {
      if (
        attrsGroups.presentation.includes(name) === true &&
        inheritableAttrs.includes(name) === false &&
        presentationNonInheritableGroupAttrs.includes(name) === false
      ) {
        delete item.attributes[name];
      }
    }
  }
}
