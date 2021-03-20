export const EOL = Deno.build.os == "windows" ? "\r\n" : "\n";
export { default as stable } from "https://jspm.dev/stable@0.1.8";
export * from "./deps/sax.js";
export { default as specificity } from "https://jspm.dev/csso@4.2.0/lib/restructure/prepare/specificity";
export * from "https://jspm.dev/css-select@3.1.2";

//CommonJS dependencies
import { createRequire } from "https://deno.land/std@0.90.0/node/module.ts";

const require = createRequire(import.meta.url);
const csstree = require("./deps/csstree.js");
const csso = require("./deps/csso.js");

export { csso, csstree };
