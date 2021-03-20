export const type = "perItem";

export const active = true;

export const description = "removes useless stroke and fill attributes";

export const params = {
  stroke: true,
  fill: true,
  removeNone: false,
  hasStyleOrScript: false,
};

import { elemsGroups } from "./_collections.js";
var shape = elemsGroups.shape,
  regStrokeProps = /^stroke/,
  regFillProps = /^fill-/,
  styleOrScript = ["style", "script"];

/**
 * Remove useless stroke and fill attrs.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item, params) {
  if (item.isElem(styleOrScript)) {
    params.hasStyleOrScript = true;
  }

  if (
    !params.hasStyleOrScript &&
    item.isElem(shape) &&
    !item.computedAttr("id")
  ) {
    var stroke = params.stroke && item.computedAttr("stroke"),
      fill = params.fill && !item.computedAttr("fill", "none");

    // remove stroke*
    if (
      params.stroke &&
      (!stroke ||
        stroke == "none" ||
        item.computedAttr("stroke-opacity", "0") ||
        item.computedAttr("stroke-width", "0"))
    ) {
      // stroke-width may affect the size of marker-end
      if (
        item.computedAttr("stroke-width", "0") === true ||
        item.computedAttr("marker-end") == null
      ) {
        var parentStroke = item.parentNode.computedAttr("stroke"),
          declineStroke = parentStroke && parentStroke != "none";

        for (const name of Object.keys(item.attributes)) {
          if (regStrokeProps.test(name)) {
            delete item.attributes[name];
          }
        }

        if (declineStroke) {
          item.attributes.stroke = "none";
        }
      }
    }

    // remove fill*
    if (params.fill && (!fill || item.computedAttr("fill-opacity", "0"))) {
      for (const name of Object.keys(item.attributes)) {
        if (regFillProps.test(name)) {
          delete item.attributes[name];
        }
      }

      if (fill) {
        item.attributes.fill = "none";
      }
    }

    if (
      params.removeNone &&
      (!stroke || item.attributes.stroke == "none") &&
      (!fill || item.attributes.fill == "none")
    ) {
      return false;
    }
  }
}
