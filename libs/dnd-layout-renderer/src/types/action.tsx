import { INode, ILayout } from './layout';
import InteractiveCore from '../interactiveCore';
import { getRegist } from '../register';
import { HoverOptions, DropOptions } from '../hooks/useDrop';
import CustomSymbolTree from '../interactiveCore/CustomSymbolTree';

export interface Position {
  x: number;
  y: number;
}

export enum HoverDirection {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  TOP_OUT = 'topOut',
  BOTTOM_OUT = 'bottomOut',
}
export enum DragDirection {
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom',
}

export interface SizeOptions {
  direction: DragDirection;
  size: number;
}

export interface BaseAction {
  onDrag(): void;

  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void;

  onRemove(): INode | null;

  onMove(dragPath: number[], dropPath: number[], options: HoverOptions): void;

  onSizeChange(sizeOptions: SizeOptions): void;
}
export class Action implements BaseAction {
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
   * 当前节点在父节点中的位置
   *
   * @type {number}
   * @memberof Action
   */
  index: number;
  core: CustomSymbolTree;
  width: number;
  constructor(
    node: INode,
    path: number[],
    core: CustomSymbolTree,
    width: number
  ) {
    this.node = node;
    this.width = width;
    this.path = path;
    this.index = path[path.length - 1];
    this.core = core;
  }

  getParentAction() {
    return getActionInstance(
      this.getParent(),
      this.getParentPath(),
      this.core,
      this.width
    );
  }
  getParentPath() {
    return this.path.slice(0, this.path.length - 1);
  }

  getGrandParentPath() {
    return this.path.slice(0, this.path.length - 2);
  }
  getParent() {
    return this.core.getParent(this.path);
  }

  getParentByPath(path: number[]) {
    return this.core.getParent(path);
  }
  getGrandParent() {
    return this.core.getGrandParent(this.path);
  }
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
  getPreviousSibling() {
    return this.core.getPreviousSibling(this.path);
  }

  getRemoveItem() {
    return this.core.recordRemoveNode;
  }
  removeSelf() {
    this.core.recordRemoveNode = {
      path: this.path,
      node: JSON.parse(JSON.stringify(this.getNode())),
    };
    this.core.remove(this.path);
  }
  getNextSibling() {
    return this.core.getNextSibling(this.path);
  }
  getNode() {
    return this.node;
  }
  insertAfter(data: ILayout) {
    this.core.insertAfter(this.path, data);
  }

  insertBefore(data: ILayout) {
    this.core.insertBefore(this.path, data);
  }

  onDrag(): void {
    throw new Error('Method not implemented.');
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error('Method not implemented.');
  }
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onMove(dragPath: number[], dropPath: number[], options: HoverOptions): void {
    throw new Error('Method not implemented.');
  }
  onSizeChange(options: SizeOptions): void {
    throw new Error('Method not implemented.');
  }
}

export function getAction(type: string) {
  return getRegist()[type].action;
}
export function getActionInstance(
  node: ILayout,
  path: number[],
  core: CustomSymbolTree,
  width: number
) {
  const Action = getAction(node.type);
  const actionInstance = new Action(node, path, core, width);
  return actionInstance;
}
