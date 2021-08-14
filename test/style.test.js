import { equal } from "../deps/asserts.js";
import { collectStylesheet, computeStyle } from "../lib/style.js";
import { querySelector } from "../lib/xast.js";
import svg2js from "../lib/svgo/svg2js.js";

Deno.test("collects styles", () => {
  const root = svg2js(`
      <svg>
        <rect id="class" class="a" />
        <rect id="two-classes" class="b a" />
        <rect id="attribute" fill="purple" />
        <rect id="inline-style" style="fill: grey;" />
        <g fill="yellow">
          <rect id="inheritance" />
          <g style="fill: blue;">
            <g>
              <rect id="nested-inheritance" />
            </g>
          </g>
        </g>
        <style>
          .a { fill: red; }
        </style>
        <style>
          <![CDATA[
            .b { fill: green; stroke: black; }
          ]]>
        </style>
      </svg>
    `);
  const stylesheet = collectStylesheet(root);
  equal(computeStyle(stylesheet, querySelector(root, "#class")), {
    fill: { type: "static", inherited: false, value: "red" },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#two-classes")), {
    fill: { type: "static", inherited: false, value: "green" },
    stroke: { type: "static", inherited: false, value: "black" },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#attribute")), {
    fill: { type: "static", inherited: false, value: "purple" },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#inline-style")), {
    fill: { type: "static", inherited: false, value: "grey" },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#inheritance")), {
    fill: { type: "static", inherited: true, value: "yellow" },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#nested-inheritance")), {
    fill: { type: "static", inherited: true, value: "blue" },
  });
});

Deno.test("prioritizes different kinds of styles", () => {
  const root = svg2js(`
      <svg>
        <style>
          g > .a { fill: red; }
          .a { fill: green; }
          .b { fill: blue; }
        </style>
        <g fill="yellow">
          <rect id="complex-selector" class="a" />
          <rect id="attribute-over-inheritance" fill="orange" />
          <rect id="style-rule-over-attribute" class="b" fill="grey" />
          <rect id="inline-style-over-style-rule" style="fill: purple;" class="b" />
        </g>
      </svg>
    `);
  const stylesheet = collectStylesheet(root);
  equal(computeStyle(stylesheet, querySelector(root, "#complex-selector")), {
    fill: { type: "static", inherited: false, value: "red" },
  });
  equal(
    computeStyle(
      stylesheet,
      querySelector(root, "#attribute-over-inheritance"),
    ),
    { fill: { type: "static", inherited: false, value: "orange" } },
  );
  equal(
    computeStyle(stylesheet, querySelector(root, "#style-rule-over-attribute")),
    { fill: { type: "static", inherited: false, value: "blue" } },
  );
  equal(
    computeStyle(
      stylesheet,
      querySelector(root, "#inline-style-over-style-rule"),
    ),
    { fill: { type: "static", inherited: false, value: "purple" } },
  );
});

Deno.test("prioritizes important styles", () => {
  const root = svg2js(`
      <svg>
        <style>
          g > .a { fill: red; }
          .b { fill: green !important; }
        </style>
        <rect id="complex-selector" class="a b" />
        <rect id="style-rule-over-inline-style" style="fill: orange;" class="b" />
        <rect id="inline-style-over-style-rule" style="fill: purple !important;" class="b" />
      </svg>
    `);
  const stylesheet = collectStylesheet(root);
  equal(
    computeStyle(stylesheet, querySelector(root, "#complex-selector")),
    { fill: { type: "static", inherited: false, value: "green" } },
  );
  equal(
    computeStyle(
      stylesheet,
      querySelector(root, "#style-rule-over-inline-style"),
    ),
    { fill: { type: "static", inherited: false, value: "green" } },
  );
  equal(
    computeStyle(
      stylesheet,
      querySelector(root, "#inline-style-over-style-rule"),
    ),
    { fill: { type: "static", inherited: false, value: "purple" } },
  );
});

Deno.test("treats at-rules and pseudo-classes as dynamic styles", () => {
  const root = svg2js(`
      <svg>
        <style>
          @media screen {
            .a { fill: red; }
          }
          .b:hover { fill: green; }
          .c { fill: blue; }
          .d { fill: purple; }
        </style>
        <rect id="media-query" class="a d" style="fill: orange;" />
        <rect id="hover" class="b" style="fill: yellow;" />
        <g class="a">
          <rect id="inherited" />
          <rect id="inherited-overriden" class="c" />
        </g>
        <rect id="static" class="c" style="fill: black" />
      </svg>
    `);
  const stylesheet = collectStylesheet(root);
  equal(computeStyle(stylesheet, querySelector(root, "#media-query")), {
    fill: { type: "dynamic", inherited: false },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#hover")), {
    fill: { type: "dynamic", inherited: false },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#inherited")), {
    fill: { type: "dynamic", inherited: true },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#inherited-overriden")), {
    fill: { type: "static", inherited: false, value: "blue" },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#static")), {
    fill: { type: "static", inherited: false, value: "black" },
  });
});

Deno.test("considers <style> media attribute", () => {
  const root = svg2js(`
      <svg>
        <style media="print">
          @media screen {
            .a { fill: red; }
          }
          .b { fill: green; }
        </style>
        <style media="all">
          .c { fill: blue; }
        </style>
        <rect id="media-query" class="a" />
        <rect id="kinda-static" class="b" />
        <rect id="static" class="c" />
      </svg>
    `);
  const stylesheet = collectStylesheet(root);
  equal(computeStyle(stylesheet, querySelector(root, "#media-query")), {
    fill: { type: "dynamic", inherited: false },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#kinda-static")), {
    fill: { type: "dynamic", inherited: false },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#static")), {
    fill: { type: "static", inherited: false, value: "blue" },
  });
});

Deno.test("ignores <style> with invalid type", () => {
  const root = svg2js(`
      <svg>
        <style type="text/css">
          .a { fill: red; }
        </style>
        <style type="">
          .b { fill: green; }
        </style>
        <style type="text/invalid">
          .c { fill: blue; }
        </style>
        <rect id="valid-type" class="a" />
        <rect id="empty-type" class="b" />
        <rect id="invalid-type" class="c" />
      </svg>
    `);
  const stylesheet = collectStylesheet(root);
  equal(computeStyle(stylesheet, querySelector(root, "#valid-type")), {
    fill: { type: "static", inherited: false, value: "red" },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#empty-type")), {
    fill: { type: "static", inherited: false, value: "green" },
  });
  equal(computeStyle(stylesheet, querySelector(root, "#invalid-type")), {});
});

Deno.test("ignores keyframes atrule", () => {
  const root = svg2js(`
      <svg>
        <style>
          .a {
            animation: loading 4s linear infinite;
          }
          @keyframes loading {
            0% {
              stroke-dashoffset: 440;
            }
            50% {
              stroke-dashoffset: 0;
            }
            50.1% {
              stroke-dashoffset: 880;
            }
          }
        </style>
        <rect id="element" class="a" />
      </svg>
    `);
  const stylesheet = collectStylesheet(root);
  equal(computeStyle(stylesheet, querySelector(root, "#element")), {
    animation: {
      type: "static",
      inherited: false,
      value: "loading 4s linear infinite",
    },
  });
});
