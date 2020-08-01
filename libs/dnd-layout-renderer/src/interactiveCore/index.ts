import {
  ILayout,
  DragDirection,
  getActionInstance,
  ISizeOptions,
} from '../types';
import TreeSolver from './TreeSolver';
import { produce } from 'immer';
import { DropOptions } from '../hooks';

export default class InteractiveCore {
  /**
   *记录的移除节点的信息
   *
   * @type {ILayout}
   * @memberof InteractiveCore
   */
  remove?: ILayout;
  /**
   * 缓存布局信息
   *
   * @type {ILayout}
   * @memberof InteractiveCore
   */
  memeroyLayout: ILayout[];
  /**
   *布局核心代码
   *
   * @type {TreeSolver}
   * @memberof InteractiveCore
   */
  treeCore: TreeSolver;
  constructor(layout: ILayout[]) {
    this.update(layout);
  }
  get() {
    return this.treeCore.getLayout();
  }
  restore() {
    if (this.treeCore.recordRemoveNode) {
      this.update(this.memeroyLayout);
      this.clearRemoveNode();
    }
  }
  clearRemoveNode() {
    this.treeCore.recordRemoveNode = null;
  }
  update(layout: ILayout[]) {
    this.treeCore = new TreeSolver(layout);
  }
  updateCore(core: TreeSolver) {
    this.treeCore = core;
  }
  /**
   * 修改组件宽度
   *
   * @memberof InteractiveCore
   */
  onSizeChange(path: number[], options: ISizeOptions) {
    const newCore = produce<TreeSolver>(this.treeCore, (core: any) => {
      const node = core.getNode(path);
      getActionInstance({
        node,
        path,
        core,
      }).onSizeChange(path, options);
    });
    this.updateCore(newCore);
  }
  /**
   * 修改组件宽度
   *
   * @memberof InteractiveCore
   */
  onSizeChanging(path: number[], options: ISizeOptions) {
    const newCore = produce<TreeSolver>(this.treeCore, (core: any) => {
      const node = core.getNode(path);
      getActionInstance({
        node,
        path,
        core,
      }).onSizeChanging(path, options);
    });
    this.updateCore(newCore);
  }

  onDrag(path: number[]) {
    // 记忆布局，用来回滚
    this.memeroyLayout = this.treeCore.getLayout();
    const newCore = produce(this.treeCore, (core: any) => {
      const node = core.getNode(path);
      getActionInstance({
        node,
        path,
        core,
      }).onDrag();
    });
    this.updateCore(newCore);
  }
  onDrop(dragPath: number[], path: number[], options: DropOptions) {
    const newCore = produce(this.treeCore, (core: any) => {
      const node = core.getNode(path);
      getActionInstance({
        node,
        path,
        core,
      }).onDrop(dragPath, path, options);
      core.recordRemoveNode = null;
    });
    this.updateCore(newCore);
  }
  onMove(dragPath: number[], dropPath: number[], options: DropOptions) {
    const newCore = produce(this.treeCore, (core: any) => {
      const node = core.getNode(dropPath);
      getActionInstance({
        node,
        path: dropPath,
        core,
      }).onMove(dragPath, dropPath, options);
    });
    this.updateCore(newCore);
  }
}
