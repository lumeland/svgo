import { attrsGroups } from "./_collections.js";

export const type = "perItem";

export const active = true;

export const description = "removes empty attributes";

/**
 * Remove attributes with empty values.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  if (item.type === "element") {
    for (const [name, value] of Object.entries(item.attributes)) {
      if (
        value === "" &&
        // empty conditional processing attributes prevents elements from rendering
        attrsGroups.conditionalProcessing.includes(name) === false
      ) {
        delete item.attributes[name];
      }
    }
  }
}
