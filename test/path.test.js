import { assertEquals, equal } from "../deps/asserts.js";
import { parsePathData, stringifyPathData } from "../lib/path.js";

Deno.test("should allow spaces between commands", () => {
  equal(parsePathData("M0 10 L \n\r\t20 30"), [
    { command: "M", args: [0, 10] },
    { command: "L", args: [20, 30] },
  ]);
});
Deno.test("should allow spaces and commas between arguments", () => {
  equal(parsePathData("M0 , 10 L 20 \n\r\t30,40,50"), [
    { command: "M", args: [0, 10] },
    { command: "L", args: [20, 30] },
    { command: "L", args: [40, 50] },
  ]);
});
Deno.test("should forbid commas before commands", () => {
  equal(parsePathData(", M0 10"), []);
});
Deno.test("should forbid commas between commands", () => {
  equal(parsePathData("M0,10 , L 20,30"), [
    { command: "M", args: [0, 10] },
  ]);
});
Deno.test("should forbid commas between command name and argument", () => {
  equal(parsePathData("M0,10 L,20,30"), [
    { command: "M", args: [0, 10] },
  ]);
});
Deno.test("should forbid multipe commas in a row", () => {
  equal(parsePathData("M0 , , 10"), []);
});
Deno.test("should stop when unknown char appears", () => {
  equal(parsePathData("M0 10 , L 20 #40"), [
    { command: "M", args: [0, 10] },
  ]);
});
Deno.test("should stop when not enough arguments", () => {
  equal(parsePathData("M0 10 L 20 L 30 40"), [
    { command: "M", args: [0, 10] },
  ]);
});
Deno.test("should stop if moveto not the first command", () => {
  equal(parsePathData("L 10 20"), []);
  equal(parsePathData("10 20"), []);
});
Deno.test("should stop on invalid scientific notation", () => {
  equal(parsePathData("M 0 5e++1 L 0 0"), [
    { command: "M", args: [0, 5] },
  ]);
});
Deno.test("should stop on invalid numbers", () => {
  equal(parsePathData("M ..."), []);
});
Deno.test("should handle arcs", () => {
  equal(
    parsePathData(
      `
          M600,350
          l 50,-25
          a25,25 -30 0,1 50,-25
          25,50 -30 0,1 50,-25
          25,75 -30 01.2,-25
          a25,100 -30 0150,-25
          l 50,-25
        `,
    ),
    [
      { command: "M", args: [600, 350] },
      { command: "l", args: [50, -25] },
      { command: "a", args: [25, 25, -30, 0, 1, 50, -25] },
      { command: "a", args: [25, 50, -30, 0, 1, 50, -25] },
      { command: "a", args: [25, 75, -30, 0, 1, 0.2, -25] },
      { command: "a", args: [25, 100, -30, 0, 1, 50, -25] },
      { command: "l", args: [50, -25] },
    ],
  );
});

Deno.test("should combine sequence of the same commands", () => {
  assertEquals(
    stringifyPathData({
      pathData: [
        { command: "M", args: [0, 0] },
        { command: "h", args: [10] },
        { command: "h", args: [20] },
        { command: "h", args: [30] },
        { command: "H", args: [40] },
        { command: "H", args: [50] },
      ],
    }),
    "M0 0h10 20 30H40 50",
  );
});
Deno.test("should not combine sequence of moveto", () => {
  assertEquals(
    stringifyPathData({
      pathData: [
        { command: "M", args: [0, 0] },
        { command: "M", args: [10, 10] },
        { command: "m", args: [20, 30] },
        { command: "m", args: [40, 50] },
      ],
    }),
    "M0 0M10 10m20 30m40 50",
  );
});
Deno.test("should combine moveto and sequence of lineto", () => {
  assertEquals(
    stringifyPathData({
      pathData: [
        { command: "M", args: [0, 0] },
        { command: "l", args: [10, 10] },
        { command: "M", args: [0, 0] },
        { command: "l", args: [10, 10] },
        { command: "M", args: [0, 0] },
        { command: "L", args: [10, 10] },
      ],
    }),
    "m0 0 10 10M0 0l10 10M0 0 10 10",
  );
  assertEquals(
    stringifyPathData({
      pathData: [
        { command: "m", args: [0, 0] },
        { command: "L", args: [10, 10] },
      ],
    }),
    "M0 0 10 10",
  );
});
Deno.test("should avoid space before first, negative and decimals", () => {
  assertEquals(
    stringifyPathData({
      pathData: [
        { command: "M", args: [0, -1.2] },
        { command: "L", args: [0.3, 4] },
        { command: "L", args: [5, -0.6] },
        { command: "L", args: [7, 0.8] },
      ],
    }),
    "M0-1.2.3 4 5-.6 7 .8",
  );
});
Deno.test("should configure precision", () => {
  assertEquals(
    stringifyPathData({
      pathData: [
        { command: "M", args: [0, -1.9876] },
        { command: "L", args: [0.3, 3.14159265] },
        { command: "L", args: [100, 200] },
      ],
      precision: 3,
    }),
    "M0-1.988.3 3.142 100 200",
  );
  assertEquals(
    stringifyPathData({
      pathData: [
        { command: "M", args: [0, -1.9876] },
        { command: "L", args: [0.3, 3.14159265] },
        { command: "L", args: [100, 200] },
      ],
      precision: 0,
    }),
    "M0-2 0 3 100 200",
  );
});
Deno.test("allows to avoid spaces after arc flags", () => {
  const pathData = [
    { command: "M", args: [0, 0] },
    { command: "A", args: [50, 50, 10, 1, 0, 0.2, 20] },
    { command: "a", args: [50, 50, 10, 1, 0, 0.2, 20] },
  ];
  assertEquals(
    stringifyPathData({
      pathData,
      disableSpaceAfterFlags: false,
    }),
    "M0 0A50 50 10 1 0 .2 20a50 50 10 1 0 .2 20",
  );
  assertEquals(
    stringifyPathData({
      pathData,
      disableSpaceAfterFlags: true,
    }),
    "M0 0A50 50 10 10.2 20a50 50 10 10.2 20",
  );
});
