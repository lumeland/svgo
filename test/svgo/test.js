import {
  assertEquals,
  assertMatch,
} from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { EOL } from "../../deps.js";
import { extendDefaultPlugins, optimize } from "../../mod.js";

const regEOL = new RegExp(EOL, "g");

const normalize = (file) => {
  return file.trim().replace(regEOL, "\n");
};

const parseFixture = async (file) => {
  const url = new URL(file, import.meta.url);
  const content = await Deno.readTextFile(url.pathname);
  return normalize(content).split(/\s*@@@\s*/);
};

Deno.test("should create indent with 2 spaces", async () => {
  const [original, expected] = await parseFixture("test.svg");
  const result = optimize(original, {
    plugins: [],
    js2svg: { pretty: true, indent: 2 },
  });
  assertEquals(normalize(result.data), expected);
});

Deno.test("should run multiple times", async () => {
  const [original, expected] = await parseFixture("multipass.svg");
  const result = optimize(original, {
    multipass: true,
  });
  assertEquals(normalize(result.data), expected);
});

Deno.test("should pass multipass count to plugins", async () => {
  const [original, expected] = await parseFixture("multipass-prefix-ids.svg");
  const result = optimize(original, {
    multipass: true,
    plugins: extendDefaultPlugins([
      {
        name: "prefixIds",
      },
    ]),
  });
  assertEquals(normalize(result.data), expected);
});

Deno.test("should handle plugins order properly", async () => {
  const [original, expected] = await parseFixture("plugins-order.svg");
  const result = optimize(original, { input: "file", path: "input.svg" });
  assertEquals(normalize(result.data), expected);
});

Deno.test("should handle parse error", async () => {
  const url = new URL("invalid.svg", import.meta.url);
  const fixture = await Deno.readTextFile(url.pathname);
  const result = optimize(fixture, { input: "file", path: "input.svg" });
  assertMatch(result.error, /Error in parsing SVG/);
  assertEquals(result.path, "input.svg");
});

Deno.test("should handle empty svg tag", async () => {
  const result = optimize("<svg />", { input: "file", path: "input.svg" });
  assertEquals(result.data, "<svg/>");
});

Deno.test("should preserve style specifity over attributes", async () => {
  const [original, expected] = await parseFixture("style-specifity.svg");
  const result = optimize(original, {
    input: "file",
    path: "input.svg",
    js2svg: { pretty: true },
  });
  assertEquals(normalize(result.data), expected);
});

Deno.test("should inline entities", async () => {
  const [original, expected] = await parseFixture("entities.svg");
  const result = optimize(original, {
    path: "input.svg",
    plugins: [],
    js2svg: { pretty: true },
  });
  assertEquals(normalize(result.data), expected);
});

Deno.test("should preserve whitespaces between tspan tags", async () => {
  const [original, expected] = await parseFixture("whitespaces.svg");
  const result = optimize(original, {
    path: "input.svg",
    js2svg: { pretty: true },
  });
  assertEquals(normalize(result.data), expected);
});
