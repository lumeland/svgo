import { detachNodeFromParent } from "../lib/xast.js";

export const type = "visitor";
export const active = true;
export const description = "removes XML processing instructions";

/**
 * Remove XML Processing Instruction.
 *
 * @example
 * <?xml version="1.0" encoding="utf-8"?>
 *
 * @author Kir Belevich
 *
 * @type {import('../lib/types').Plugin<void>}
 */
export function fn() {
  return {
    instruction: {
      enter: (node, parentNode) => {
        if (node.name === "xml") {
          detachNodeFromParent(node, parentNode);
        }
      },
    },
  };
}
