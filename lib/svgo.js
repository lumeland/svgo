import {
  defaultPlugins,
  extendDefaultPlugins,
  resolvePluginConfig,
} from "./svgo/config.js";

import svg2js from "./svgo/svg2js.js";
import js2svg from "./svgo/js2svg.js";
import invokePlugins from "./svgo/plugins.js";
import JSAPI from "./svgo/jsAPI.js";
import { encodeSVGDatauri } from "./svgo/tools.js";

export { extendDefaultPlugins };

export function optimize(input, config) {
  if (config == null) {
    config = {};
  }
  if (typeof config !== "object") {
    throw Error("Config should be an object");
  }
  const maxPassCount = config.multipass ? 10 : 1;
  let prevResultSize = Number.POSITIVE_INFINITY;
  let svgjs = null;
  const info = {};
  if (config.path != null) {
    info.path = config.path;
  }
  for (let i = 0; i < maxPassCount; i += 1) {
    info.multipassCount = i;
    svgjs = svg2js(input);
    if (svgjs.error != null) {
      if (config.path != null) {
        svgjs.path = config.path;
      }
      return svgjs;
    }
    const plugins = config.plugins || defaultPlugins;
    if (Array.isArray(plugins) === false) {
      throw Error(
        "Invalid plugins list. Provided 'plugins' in config should be an array.",
      );
    }
    const resolvedPlugins = plugins.map((plugin) =>
      resolvePluginConfig(plugin, config)
    );
    svgjs = invokePlugins(svgjs, info, resolvedPlugins);
    svgjs = js2svg(svgjs, config.js2svg);
    if (svgjs.error) {
      throw Error(svgjs.error);
    }
    if (svgjs.data.length < prevResultSize) {
      input = svgjs.data;
      prevResultSize = svgjs.data.length;
    } else {
      if (config.datauri) {
        svgjs.data = encodeSVGDatauri(svgjs.data, config.datauri);
      }
      if (config.path != null) {
        svgjs.path = config.path;
      }
      return svgjs;
    }
  }
  return svgjs;
} /**
 * The factory that creates a content item with the helper methods.
 *
 * @param {Object} data which is passed to jsAPI constructor
 * @returns {JSAPI} content item
 */

export function createContentItem(data) {
  return new JSAPI(data);
}
