/**
 * @typedef {import('./types').XastNode} XastNode
 * @typedef {import('./types').XastChild} XastChild
 * @typedef {import('./types').XastParent} XastParent
 * @typedef {import('./types').Visitor} Visitor
 */

import { is, selectAll, selectOne } from "../deps.js";
import * as xastAdaptor from "./svgo/css-select-adapter.js";

const cssSelectOptions = {
  xmlMode: true,
  adapter: xastAdaptor,
};

/**
 * @type {(node: XastNode, selector: string) => Array<XastChild>}
 */
export function querySelectorAll(node, selector) {
  return selectAll(selector, node, cssSelectOptions);
}

/**
 * @type {(node: XastNode, selector: string) => null | XastChild}
 */
export function querySelector(node, selector) {
  return selectOne(selector, node, cssSelectOptions);
}

/**
 * @type {(node: XastChild, selector: string) => boolean}
 */
export function matches(node, selector) {
  return is(node, selector, cssSelectOptions);
}

/**
 * @type {(node: XastChild, name: string) => null | XastChild}
 */
export function closestByName(node, name) {
  let currentNode = node;
  while (currentNode) {
    if (currentNode.type === "element" && currentNode.name === name) {
      return currentNode;
    }
    // @ts-ignore parentNode is hidden from public usage
    currentNode = currentNode.parentNode;
  }
  return null;
}

export const traverseBreak = Symbol();

/**
 * @type {(node: any, fn: any) => any}
 */
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

/**
 * @type {(node: any, visitor: any, parentNode: any) => void}
 */
export function visit(node, visitor, parentNode = null) {
  const callbacks = visitor[node.type];
  if (callbacks && callbacks.enter) {
    callbacks.enter(node, parentNode);
  }
  // visit root children
  if (node.type === "root") {
    // copy children array to not loose cursor when children is spliced
    for (const child of node.children) {
      visit(child, visitor, node);
    }
  }
  // visit element children if still attached to parent
  if (node.type === "element") {
    if (parentNode.children.includes(node)) {
      for (const child of node.children) {
        visit(child, visitor, node);
      }
    }
  }
  if (callbacks && callbacks.exit) {
    callbacks.exit(node, parentNode);
  }
}

/**
 * @type {(node: XastChild, parentNode: XastParent) => void}
 */
export function detachNodeFromParent(node, parentNode) {
  // avoid splice to not break for loops
  parentNode.children = parentNode.children.filter((child) => child !== node);
}
