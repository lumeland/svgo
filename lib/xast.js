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
