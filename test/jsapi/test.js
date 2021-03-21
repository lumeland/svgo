import {
  assert,
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { createContentItem } from "../../mod.js";
import JSAPI from "../../lib/svgo/jsAPI.js";

Deno.test("should has createContentItem method", function () {
  assert(createContentItem instanceof Function);
});

Deno.test("should be able to create content item", function () {
  var item = createContentItem({
    elem: "elementName",
  });
  assert(item instanceof JSAPI);
  const prop = Object.getOwnPropertyDescriptor(item, "elem");
  assertEquals(prop.value, "elementName");
});

Deno.test("should be able create content item without argument", function () {
  var item = createContentItem();
  assert(item instanceof JSAPI);
  assertObjectMatch(item, {});
});
