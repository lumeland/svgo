import { is, selectAll, selectOne } from "../deps.js";
import * as xastAdaptor from "./svgo/css-select-adapter.js";

const cssSelectOptions = {
  xmlMode: true,
  adapter: xastAdaptor,
};

export function querySelectorAll(node, selector) {
  return selectAll(selector, node, cssSelectOptions);
}

export function querySelector(node, selector) {
  return selectOne(selector, node, cssSelectOptions);
}

export function matches(node, selector) {
  return is(node, selector, cssSelectOptions);
}

export function closestByName(node, name) {
  let currentNode = node;
  while (currentNode) {
    if (currentNode.type === "element" && currentNode.name === name) {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return null;
}

export const traverseBreak = Symbol();

export function traverse(node, fn) {
  if (fn(node) === traverseBreak) {
    return traverseBreak;
  }
  if (node.type === "root" || node.type === "element") {
    for (const child of node.children) {
      if (traverse(child, fn) === traverseBreak) {
        return traverseBreak;
      }
    }
  }
}

export function visit(node, visitor) {
  const callbacks = visitor[node.type];
  if (callbacks && callbacks.enter) {
    callbacks.enter(node);
  }
  // visit root children
  if (node.type === "root") {
    // copy children array to not loose cursor when children is spliced
    for (const child of node.children) {
      visit(child, visitor);
    }
  }
  // visit element children if still attached to parent
  if (node.type === "element") {
    if (node.parentNode.children.includes(node)) {
      for (const child of node.children) {
        visit(child, visitor);
      }
    }
  }
  if (callbacks && callbacks.exit) {
    callbacks.exit(node);
  }
}

export function detachNodeFromParent(node) {
  const parentNode = node.parentNode;
  // avoid splice to not break for loops
  parentNode.children = parentNode.children.filter((child) => child !== node);
}
