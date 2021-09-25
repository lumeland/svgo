# SVGO for Deno

> DEPRECATED
> SVGO provides esm module for browsers, compatible with Deno.
> https://unpkg.com/svgo@2.7.0/dist/svgo.browser.js

---

[SVGO](https://github.com/svg/svgo) fork to make it work in Deno.

## Usage

```js
import { optimize } from "https://raw.githubusercontent.com/lumeland/svgo/deno/mod.js";

const filepath = "assets/my-logo.svg";
const data = await Deno.readTextFile(filepath);

const result = optimize(data, {
  path: filepath,
  plugins: [
    "cleanupAttrs",
    "removeDoctype",
    "removeXMLProcInst",
    //...
  ],
});

console.log(result);
```
