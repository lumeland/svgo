export const EOL = Deno.build.os == "windows" ? "\r\n" : "\n";
export { default as stable } from "https://jspm.dev/stable@0.1.8";
export { default as specificity } from "./deps/csso-specificity.js";
export { default as csso } from "./deps/csso.js";
export { default as csstree } from "./deps/csstree.js";
export { dirname } from "https://deno.land/std@0.99.0/path/mod.ts";
export * from "./deps/sax.js";
export * from "https://jspm.dev/css-select@4.1.3";
