import {
  INode,
  HoverDirection,
  DragDirection,
  BaseAction,
  Position,
  Action,
} from 'dnd-layout-renderer';

export default class BaseLayerAction implements Action {
  onDrag(): void {
    throw new Error('Method not implemented.');
  }
  onDrop(direction: HoverDirection, node: INode): void {}
  onRemove(): INode {
    // const node = this.getNode();
    // const parent = layoutTree.parent(node.attribute.uniqueId);
    // const parentChildrenCount = layoutTree.childrenCount(parent);
    // // 交互规则，如果上层节点仅有一个，触发上层节点的onRemove方法
    // if (parentChildrenCount === 1) {
    //   const parentAction = getActionInstanceByTag({
    //     node: parent,
    //     layoutTree: layoutTree,
    //   });
    //   parentAction.onRemove();
    // } else {
    //   // 交互规则，如果当前节点被移除了，希望兄弟节点来填补空白
    //   layoutTree.remove(node);
    // }
    // return node;
  }
  onMove(position: Position): void {
    throw new Error('Method not implemented.');
  }
  onSizeChange(sizeOptions: DragDirection): void {
    throw new Error('Method not implemented.');
  }
}
