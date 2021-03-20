import { optimize } from "../lib/svgo.js";
const filepath = "examples/test.svg";
const config = {
  plugins: [
    "cleanupAttrs",
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeTitle",
    "removeDesc",
    "removeUselessDefs",
    "removeEditorsNSData",
    "removeEmptyAttrs",
    "removeHiddenElems",
    "removeEmptyText",
    "removeEmptyContainers",
    "removeViewBox",
    "cleanupEnableBackground",
    "convertStyleToAttrs",
    "convertColors",
    "convertPathData",
    "convertTransform",
    "removeUnknownsAndDefaults",
    "removeNonInheritableGroupAttrs",
    "removeUselessStrokeAndFill",
    "removeUnusedNS",
    "cleanupIDs",
    "cleanupNumericValues",
    "moveElemsAttrsToGroup",
    "moveGroupAttrsToElems",
    "collapseGroups",
    // 'removeRasterImages',
    "mergePaths",
    "convertShapeToPath",
    "sortAttrs",
    "removeDimensions",
    { name: "removeAttrs", params: { attrs: "(stroke|fill)" } },
  ],
};

const data = await Deno.readTextFile(filepath);
const result = optimize(data, { path: filepath, ...config });

console.log(result);
