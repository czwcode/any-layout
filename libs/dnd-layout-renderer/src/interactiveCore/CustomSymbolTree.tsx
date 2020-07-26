import _ from 'lodash';
import { immerable, enableMapSet} from 'immer'
import { ILayout } from '../types';
import { encodePath, encodePathWithChildren } from '../utils';
import { get } from '../utils/base';
enableMapSet()
/**
 * feature
 * 1. parent
 * 2. insertBefore
 * 3. insertAfter
 * 4. appendChild
 * 5. childrenCount
 * 6. childrenToArray
 * 7. firstChild
 * 8. previousSibling
 * 9. nextSibling
 */
interface TreeNode {
  data: ILayout;
  info: {
    index: number;
    paths: number[];
    parent: ILayout | null;
    previousSibling: ILayout;
    nextSibling: ILayout;
    children: ILayout[];
  };
}
export function filterHideNode(layout: ILayout[]) {
  return layout.filter((item) => {
    item.children = item.children ? filterHideNode(item.children) : [];
    return item !== null;
  });
}

export default class CustomSymbolTree {
  [immerable]: true
  recordRemoveNode?:{ path: number[], node: ILayout}
  layout: ILayout[];
  constructor(layout: ILayout[], isClean: boolean = false) {
    this[immerable] = true
    this.layout = layout;
  }

  remove(path: number[]) {
    const parent = this.getParent(path)
    const removeIndex = path[path.length- 1]
    parent.children.splice(removeIndex, 1)
  }

  getNode(path: number[]) {
    return get(this.layout, encodePathWithChildren(path))
  }
  getParent(path: number[]): ILayout {
    return get(this.layout, encodePathWithChildren(path.slice(0, path.length - 1)))
  }

  getIndex(path: number[])  {
    return path[path.length - 1]
  }
  getGrandParent(path: number[]) {
    return get(this.layout, encodePathWithChildren(path.slice(0, path.length - 2)))
  }

  insertBefore(path: number[], node: ILayout) {
    const parent = this.getParent(path);
    if (parent) {
      parent.children.splice(this.getIndex(path), 0, node);
    }
  }
  insertAfter(path: number[], node: ILayout) {
    const parent = this.getParent(path);
    if (parent) {
      parent.children.splice(this.getIndex(path) + 1, 0, node);
    }
  }
  getPreviousSibling(path: number[]) {
    return this.getParent(path).children[this.getIndex(path) - 1];
  }

  getNextSibling(path: number[]) {
    return this.getParent(path).children[this.getIndex(path) + 1];
  }

  getAll() {
    return this.layout;
  }
}
