import { assert, assertEquals, assertObjectMatch } from "../../deps/asserts.js";
import SVG2JS from "../../lib/svgo/svg2js.js";
import JSAPI from "../../lib/svgo/jsAPI.js";
import CSSStyleDeclaration from "../../lib/svgo/css-style-declaration.js";
import CSSClassList from "../../lib/svgo/css-class-list.js";

async function getRoot(file = "test.svg") {
  const filepath = new URL(file, import.meta.url).pathname;
  const content = await Deno.readTextFile(filepath);
  return SVG2JS(content);
}

Deno.test("working svg", async function () {
  const root = await getRoot();

  assert(root instanceof Object);
  assert(Array.isArray(root.children));
  assertEquals(root.children.length, 4);
  assertObjectMatch(root.children[0], {
    type: "instruction",
    name: "xml",
    value: 'version="1.0" encoding="utf-8"',
  });
  assertObjectMatch(root.children[1], {
    type: "comment",
    value:
      "Generator: Adobe Illustrator 15.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)",
  });
  assertObjectMatch(root.children[2], {
    type: "doctype",
    name: "svg",
    data: {
      doctype:
        ' svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"',
    },
  });
  assertObjectMatch(root.children[3], {
    name: "svg",
  });
  assert(root.children[3].attrs instanceof Object);
  assert(root.children[3].attrs.version instanceof Object);
  assertObjectMatch(root.children[3].attrs.version, {
    value: "1.1",
  });
  assert(Array.isArray(root.children[3].children));
  assertEquals(root.children[3].children.length, 3);

  const textNode = root.children[3].children[1].children[0].children[1];
  assertEquals(textNode.children[0].value, "  test  ");
});

Deno.test("API", async function () {
  const root = await getRoot();

  assert(root.children[3].clone() instanceof JSAPI);
  assert(
    root.children[3].children[0].clone().style instanceof CSSStyleDeclaration,
  );
  assert(root.children[3].children[0].clone().class instanceof CSSClassList);
  assert(root.children[3].isElem());
  assert(root.children[3].isElem("svg"));
  assert(!root.children[3].isElem("trololo"));
  assert(root.children[3].hasAttr());
  assert(root.children[3].hasAttr("xmlns"));
  assert(root.children[3].hasAttr("xmlns", "http://www.w3.org/2000/svg"));
  assert(!root.children[3].hasAttr("xmlns", "trololo"));
  assert(!root.children[3].children[1].hasAttr());
  assert(root.children[3].attr("xmlns") instanceof Object);
  assert(
    root.children[3].attr("xmlns", "http://www.w3.org/2000/svg") instanceof
      Object,
  );
  assert(root.children[3].attr("xmlns", "trololo") === undefined);
  assert(root.children[3].attr() === undefined);
  assert(root.children[3].removeAttr("width"));
  assert(!root.children[3].hasAttr("width"));
  assert(!root.children[3].removeAttr("x", "1px"));
  assert(!root.children[3].removeAttr("z"));
  assert(!root.children[3].removeAttr());

  var attr = {
    name: "test",
    value: 3,
  };

  assert(root.children[3].addAttr(attr) instanceof Object);
  assert(!root.children[3].addAttr());
  assert(root.children[3].children[0].eachAttr((attr) => attr.value = "1"));
  assertEquals(root.children[3].children[0].attr("type").value, "1");
  assert(!root.children[3].children[1].addAttr());
});

Deno.test("malformed svg", async function () {
  const root = await getRoot("test.bad.svg");
  assertEquals(
    root.error,
    "Error in parsing SVG: Unexpected close tag\nLine: 10\nColumn: 15\nChar: >",
  );
});
