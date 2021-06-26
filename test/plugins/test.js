import { assertEquals } from "../../deps/asserts.js";
import { dirname } from "../../deps/path.js";
import { EOL } from "../../deps.js";
import { optimize } from "../../mod.js";

const regEOL = new RegExp(EOL, "g");
const regFilename = /^(.*)\.(\d+)\.svg$/;

Deno.test("plugins tests", async function () {
  const __dirname = dirname(new URL(import.meta.url).pathname);
  for (const entry of Deno.readDirSync(__dirname)) {
    const file = entry.name;
    var match = file.match(regFilename),
      index,
      name;

    if (match) {
      name = match[1];
      index = match[2];

      const path = new URL(file, import.meta.url).pathname;
      const data = await Deno.readTextFile(path);

      // remove description
      const items = normalize(data).split(/\s*===\s*/);
      const test = items.length === 2 ? items[1] : items[0];

      // extract test case
      const [original, should, params] = test.split(/\s*@@@\s*/);
      const plugin = {
        name,
        params: params ? JSON.parse(params) : {},
      };
      const result = optimize(original, {
        path,
        plugins: [plugin],
        js2svg: { pretty: true },
      });

      if (result.error != null) {
        throw new Error(result.error);
      }
      //FIXME: results.data has a '\n' at the end while it should not
      assertEquals(normalize(result.data), should);
    }
  }
});

function normalize(file) {
  return file.trim().replace(regEOL, "\n");
}
