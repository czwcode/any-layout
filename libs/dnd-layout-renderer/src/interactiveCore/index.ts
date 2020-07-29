import {
  ILayout,
  SizeOptions,
  getActionInstance,
} from '../types';
import TreeSolver from './TreeSolver';
import { produce } from 'immer';
import { HoverOptions, DropOptions } from '../hooks';

export default class InteractiveCore<ITheme> {
  /**
   *记录的移除节点的信息
   *
   * @type {ILayout}
   * @memberof InteractiveCore
   */
  remove?: ILayout<ITheme>;
  /**
   * 缓存布局信息
   *
   * @type {ILayout}
   * @memberof InteractiveCore
   */
  memeroyLayout: ILayout<ITheme>[];
  /**
   *布局核心代码
   *
   * @type {TreeSolver}
   * @memberof InteractiveCore
   */
  treeCore: TreeSolver<ITheme>;
  constructor(layout: ILayout<ITheme>[]) {
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
  update(layout: ILayout<ITheme>[]) {
    this.treeCore = new TreeSolver(layout);
  }
  updateCore(core: TreeSolver<ITheme>) {
    this.treeCore = core;
  }
  /**
   * 修改组件宽度
   *
   * @memberof InteractiveCore
   */
  onSizeChange(path: number[], options: SizeOptions) {
    const newCore = produce<TreeSolver<ITheme>>(this.treeCore, (core: any) => {
      const node = core.getNode(path);
      getActionInstance<ITheme>({
        node,
        path,
        core,
      }).onSizeChange(options);
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
  onDrop(dragPath: number[], path: number[], options: DropOptions<ITheme>) {
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
  onDropRow(path: number[], dropNode: ILayout<ITheme>) {
    const newCore = produce(this.treeCore, (core) => {
      const node = core.getNode(path);
      // TODO: 自己实现
      // getActionInstance(node, path, core).onDrop(HoverDirection.BOTTOM_OUT, dropNode);
    });
    this.updateCore(newCore);
  }
  onMove(dragPath: number[], dropPath: number[], options: HoverOptions<ITheme>) {
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
