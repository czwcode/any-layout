import _ from 'lodash';
import { immerable, enableMapSet } from 'immer';
import { ILayout } from '../types';
import { encodePathWithChildren } from '../utils';
import { get } from '../utils/base';
enableMapSet();

// export function filterHideNode(layout: ILayout<ITheme>[]) {
//   return layout.filter((item) => {
//     item.children = item.children ? filterHideNode(item.children) : [];
//     return item !== null;
//   });
// }

export default class TreeSolver<ITheme> {
  [immerable]: true;
  recordRemoveNode?: { path: number[]; node: ILayout<ITheme> };
  layout: ILayout<ITheme>[];
  constructor(layout: ILayout<ITheme>[], isClean: boolean = false) {
    this[immerable] = true;
    this.layout = layout;
  }
  /**
   * 移除指定path的节点
   *
   * @param {number[]} path
   * @memberof TreeSolver
   */
  remove(path: number[]) {
    const parent = this.getParent(path);
    const removeIndex = path[path.length - 1];
    parent.children.splice(removeIndex, 1);
  }

  /**
   * 获取指定path的节点信息
   *
   * @param {number[]} path
   * @returns
   * @memberof TreeSolver
   */
  getNode(path: number[]) {
    return get(this.layout, encodePathWithChildren(path));
  }
  /**
   * 获取指定path的父节点信息
   *
   * @param {number[]} path
   * @returns {ILayout}
   * @memberof TreeSolver
   */
  getParent(path: number[]): ILayout<ITheme> {
    return get(
      this.layout,
      encodePathWithChildren(path.slice(0, path.length - 1))
    );
  }

  /**
   * 获取当前路径，在父节点的中的位置
   *
   * @param {number[]} path
   * @returns
   * @memberof TreeSolver
   */
  getPathByParent(path: number[]) {
    return path[path.length - 1];
  }
  /**
   * 根据路径，获取上上级节点的信息
   *
   * @param {number[]} path
   * @returns
   * @memberof TreeSolver
   */
  getGrandParent(path: number[]) {
    return get(
      this.layout,
      encodePathWithChildren(path.slice(0, path.length - 2))
    );
  }

  /**
   * 在指定路径前方插入节点
   *
   * @param {number[]} path
   * @param {ILayout} node
   * @memberof TreeSolver
   */
  insertBefore(path: number[], node: ILayout<ITheme>) {
    const parent = this.getParent(path);
    if (parent) {
      parent.children.splice(this.getPathByParent(path), 0, node);
    }
  }
  /**
   * 在指定路径的后方，插入节点
   *
   * @param {number[]} path
   * @param {ILayout} node
   * @memberof TreeSolver
   */
  insertAfter(path: number[], node: ILayout<ITheme>) {
    const parent = this.getParent(path);
    if (parent) {
      parent.children.splice(this.getPathByParent(path) + 1, 0, node);
    }
  }
  /**
   * 获取前面的兄弟节点
   *
   * @param {number[]} path
   * @returns
   * @memberof TreeSolver
   */
  getPreviousSibling(path: number[]) {
    return this.getParent(path).children[this.getPathByParent(path) - 1];
  }

  /**
   * 获取后面的兄弟节点
   *
   * @param {number[]} path
   * @returns
   * @memberof TreeSolver
   */
  getNextSibling(path: number[]) {
    return this.getParent(path).children[this.getPathByParent(path) + 1];
  }

  /**
   * 获取布局信息
   *
   * @returns
   * @memberof TreeSolver
   */
  getLayout() {
    return this.layout;
  }
}
