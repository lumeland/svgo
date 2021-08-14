import { equal } from "../deps/asserts.js";
import { detachNodeFromParent, visit } from "../lib/xast.js";

const getAst = () => {
  const ast = {
    type: "root",
    children: [
      {
        type: "element",
        name: "g",
        attributes: {},
        children: [
          {
            type: "element",
            name: "rect",
            attributes: {},
            children: [],
          },
          {
            type: "element",
            name: "circle",
            attributes: {},
            children: [],
          },
        ],
      },
      {
        type: "element",
        name: "ellipse",
        attributes: {},
        children: [],
      },
    ],
  };
  ast.children[0].parentNode = ast;
  ast.children[0].children[0].parentNode = ast.children[0];
  ast.children[0].children[1].parentNode = ast.children[0];
  ast.children[1].parentNode = ast;
  return ast;
};

Deno.test("enter into nodes", () => {
  const root = getAst();
  const entered = [];
  visit(root, {
    root: {
      enter: (node) => {
        entered.push(node.type);
      },
    },
    element: {
      enter: (node) => {
        entered.push(`${node.type}:${node.name}`);
      },
    },
  });
  equal(entered, [
    "root",
    "element:g",
    "element:rect",
    "element:circle",
    "element:ellipse",
  ]);
});

Deno.test("exit from nodes", () => {
  const root = getAst();
  const exited = [];
  visit(root, {
    root: {
      exit: (node) => {
        exited.push(node.type);
      },
    },
    element: {
      exit: (node) => {
        exited.push(`${node.type}:${node.name}`);
      },
    },
  });
  equal(exited, [
    "element:rect",
    "element:circle",
    "element:g",
    "element:ellipse",
    "root",
  ]);
});

Deno.test("skip entering children if node is detached", () => {
  const root = getAst();
  const entered = [];
  visit(root, {
    element: {
      enter: (node, parentNode) => {
        entered.push(node.name);
        if (node.name === "g") {
          detachNodeFromParent(node, parentNode);
        }
      },
    },
  });
  equal(entered, ["g", "ellipse"]);
});
