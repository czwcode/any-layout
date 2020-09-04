import { INode, ILayout } from './layout';
import { getRegist } from '../register';
import { DropOptions, BaseDndOptions } from '../hooks/useDrop';
import TreeSolver from '../interactiveCore/TreeSolver';

export interface Position {
  x: number;
  y: number;
}

export enum DragDirection {
  Left = 'left',
  LeftTop = 'leftTop',
  LeftBottom = 'leftBottom',
  Right = 'right',
  RightTop = 'rightTop',
  RightBottom = 'rightBottom',
  Bottom = 'bottom',
  Top = 'top',
}

export interface ISizeOptions extends BaseDndOptions {
  direction: DragDirection;
}

export interface BaseAction {
  /**
   * 拖拽开始的事件回调
   *
   * @memberof BaseAction
   */
  onDrag(): void;

  /**
   * 拖拽元素落下的回调
   *
   * @param {number[]} dragPath 拖拽元素的路径
   * @param {number[]} dropPath  落下目标元素的路径
   * @param {DropOptions} options 其他信息，包含拖拽落下时元素的位置等信息
   * @memberof BaseAction
   */
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void;

  onMove(dragPath: number[], dropPath: number[], options: DropOptions): void;

  onSizeChange(path: number[], sizeOptions: ISizeOptions): void;
  onSizeChanging(path: number[], sizeOptions: ISizeOptions): void;
}
export interface IAction {
  /**
   *当前Action触发的节点信息
   *
   * @type {ILayout}
   * @memberof Action
   */
  node: ILayout;
  /**
   *当前节点路径
   *
   * @type {string[]}
   * @memberof Action
   */
  path: number[];
  /**
   * TreeSolver实例，用来进行布局信息的更新
   *
   * @type {TreeSolver}
   * @memberof Action
   */
  core: TreeSolver;
}
export abstract class Action implements BaseAction, IAction {
  node: ILayout;
  path: number[];
  core: TreeSolver;
  /**
   * 当前节点在父节点中的位置
   *
   * @type {number}
   * @memberof Action
   */
  index: number;

  constructor(params: IAction) {
    Object.keys(params).forEach((key) => {
      this[key] = params[key];
    });
    this.index = params.path[params.path.length - 1];
  }
  onSizeChanging(path: number[], sizeOptions: ISizeOptions): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取父组件的Action实例
   *
   * @returns
   * @memberof Action
   */
  getParentAction() {
    return getActionInstance({
      ...this,
      node: this.getParent(),
      path: this.getParentPath(),
    });
  }
  /**
   * 获取父节点的路径
   *
   * @returns
   * @memberof Action
   */
  getParentPath() {
    return this.path.slice(0, this.path.length - 1);
  }

  /**
   * 获取祖先节点的路径
   *
   * @returns
   * @memberof Action
   */
  getGrandParentPath() {
    return this.path.slice(0, this.path.length - 2);
  }
  /**
   * 获取父节点
   *
   * @returns
   * @memberof Action
   */
  getParent() {
    return this.core.getParent(this.path);
  }

  /**
   * 根据指定路径，获取父节点
   *
   * @param {number[]} path
   * @returns
   * @memberof Action
   */
  getParentByPath(path: number[]) {
    return this.core.getParent(path);
  }
  /**
   * 获取组件节点
   *
   * @returns
   * @memberof Action
   */
  getGrandParent() {
    return this.core.getGrandParent(this.path);
  }
  /**
   * @deprecated TODO: 后面会实现嵌套布局的实例，放在嵌套布局的实例中实现
   *
   * @param {keyof BaseAction} type
   * @param {*} args
   * @returns
   * @memberof Action
   */
  dispatchOthers(type: keyof BaseAction, ...args) {
    const parent = this.getParent();
    const parentChildrenCount = parent.children.length;
    // 交互规则，如果上层节点仅有一个，触发上层节点的onRemove方法
    if (parentChildrenCount === 1) {
      const parentAction = this.getParentAction();
      parentAction[type as any]();
      return true;
    } else {
      return false;
    }
  }
  /**
   * 获取前面的兄弟节点
   *
   * @returns
   * @memberof Action
   */
  getPreviousSibling() {
    return this.core.getPreviousSibling(this.path);
  }

  /**
   * 移除当前节点
   *
   * @memberof Action
   */
  removeSelf() {
    this.core.recordRemoveNode = {
      path: this.path,
      node: JSON.parse(JSON.stringify(this.getNode())),
    };
    this.core.remove(this.path);
  }
  /**
   * 获取后面的兄弟节点
   *
   * @returns
   * @memberof Action
   */
  getNextSibling() {
    return this.core.getNextSibling(this.path);
  }
  /**
   * 获取当前节点
   *
   * @returns
   * @memberof Action
   */
  getNode() {
    return this.node;
  }
  /**
   * 在当前节点后面插入节点
   *
   * @param {ILayout} data
   * @memberof Action
   */
  insertAfter(data: ILayout) {
    this.core.insertAfter(this.path, data);
  }

  /**
   * 在当前节点前面插入节点
   *
   * @param {ILayout} data
   * @memberof Action
   */
  insertBefore(data: ILayout) {
    this.core.insertBefore(this.path, data);
  }

  abstract onDrag(): void;
  abstract onDrop(
    dragPath: number[],
    dropPath: number[],
    options: DropOptions
  ): void;
  abstract onRemove(): INode;
  abstract onMove(
    dragPath: number[],
    dropPath: number[],
    options: DropOptions
  ): void;
  abstract onSizeChange(path: number[], options: ISizeOptions): void;
}

export function getAction(type: string) {
  return getRegist()[type].action;
}

class ActionInstance extends Action {
  onDrag(): void {
    throw new Error('Method not implemented.');
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error('Method not implemented.');
  }
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onMove(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error('Method not implemented.');
  }
  onSizeChange(dragPath: number[], options: ISizeOptions): void {
    throw new Error('Method not implemented.');
  }
}
export function getActionInstance(params: IAction) {
  const Action = getAction(params.node.type) as typeof ActionInstance;
  const actionInstance = new Action(params);
  return actionInstance;
}
