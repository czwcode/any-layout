import {
  INode,
  ILayout,
  SizeOptions,
  HoverDirection,
  getActionInstance,
} from '../types';
import CustomSymbolTree, { filterHideNode } from './CustomSymbolTree';
import { produce, immerable } from 'immer';
import { HoverOptions, DropOptions } from '../hooks';

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
   * @type {CustomSymbolTree}
   * @memberof InteractiveCore
   */
  treeCore: CustomSymbolTree;
  width: number
  updateWidth(width: number) {
    this.width = width;
  }
  constructor(layout: ILayout[]) {
    this.update(layout);
  }
  get() {
    return this.treeCore.getAll();
  }
  restore() {
    if(this.treeCore.recordRemoveNode) {
      this.update(this.memeroyLayout);
      this.clearRemoveNode()
    }
  }
  clearRemoveNode() {
    this.treeCore.recordRemoveNode = null
  }
  update(layout: ILayout[]) {
    this.treeCore = new CustomSymbolTree(layout);
  }
  updateCore(core: CustomSymbolTree) {
    this.treeCore = core;
  }
  /**
   * 修改组件宽度
   *
   * @memberof InteractiveCore
   */
  onSizeChange(path: number[], options: SizeOptions) {
    const newCore = produce(this.treeCore, (core) => {
      const node = core.getNode(path);
      getActionInstance(node, path, core, this.width).onSizeChange(options);
    });
    this.updateCore(newCore);
  }

  onDrag(path: number[]) {
    // 记忆布局，用来回滚
    this.memeroyLayout = this.treeCore.getAll();
    const newCore = produce(this.treeCore, (core) => {
      const node = core.getNode(path);
      getActionInstance(node, path, core, this.width).onDrag();
    });
    this.updateCore(newCore);
  }
  onDrop(dragPath: number[], path: number[], options: DropOptions) {
    const newCore = produce(this.treeCore, (core) => {
      const node = core.getNode(path);
      getActionInstance(node, path, core, this.width).onDrop(dragPath, path, options);
      core.recordRemoveNode = null
    });
    this.updateCore(newCore);
  }
  onDropRow(path:number[], dropNode:ILayout) {
    const newCore = produce(this.treeCore, (core) => {
      const node = core.getNode(path);
      // TODO: 自己实现
      // getActionInstance(node, path, core, this.width).onDrop(HoverDirection.BOTTOM_OUT, dropNode);
    });
    this.updateCore(newCore);
  } 
  onMove(dragPath: number[], dropPath: number[], options: HoverOptions){
    const newCore = produce(this.treeCore, (core) => {
      const node = core.getNode(dropPath);
      getActionInstance(node, dropPath, core, this.width).onMove(dragPath, dropPath, options);
    });
    this.updateCore(newCore);
  };
}
