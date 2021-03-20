export const type = "perItem";

export const active = true;

export const description = "removes XML processing instructions";

/**
 * Remove XML Processing Instruction.
 *
 * @example
 * <?xml version="1.0" encoding="utf-8"?>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  if (item.type === "instruction" && item.name === "xml") {
    return false;
  }
  return true;
}
