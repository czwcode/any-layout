import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
  Action,
  ILayout,
  DropOptions,
  INode,
  DragDirection,
  ISizeOptions,
} from 'dnd-layout-renderer';
import { getColNode } from '../Col';
import { calcDirection, HoverDirection } from '../Atom/calcHover';
import {
  INestLayoutTheme,
  LayerContext,
  useLayerContext,
} from '../../../context/layerContext';
import { IAnySizeOptions } from '../../../types/layout';
export const RowType = 'row';
export function getRowNode(data: ILayout) {
  return {
    type: RowType,
    children: [getColNode(24, data)],
  } as ILayout;
}
class RowAction extends Action {
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onMove(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error('Method not implemented.');
  }
  onSizeChange(
    path: number[],
    options: IAnySizeOptions<INestLayoutTheme>
  ): void {
    throw new Error('Method not implemented.');
  }
  onDrag() {
    if (!this.dispatchOthers('onDrag', ...arguments)) {
      // 交互规则，如果当前节点被移除了，希望兄弟节点来填补空白
      this.removeSelf();
    }
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions) {
    const { dropBoundingRect, mouseClientOffset: clientOffset } = options;
    const direction = calcDirection(dropBoundingRect, clientOffset);
    const { data } = options;
    if (
      direction === HoverDirection.TOP_OUT ||
      direction === HoverDirection.BOTTOM_OUT
    ) {
      const rowNode = getRowNode(data);
      if (direction === HoverDirection.TOP_OUT) {
        this.insertBefore(rowNode);
      } else {
        this.insertAfter(rowNode);
      }
    } else {
      const parentAction = this.getParentAction();
      parentAction.onDrop(dragPath, dropPath, options);
    }
  }
}
const Row: IComponent = {
  layoutType: LayoutType.Layout,
  atomType: RowType,
  action: RowAction,
  renderer: (props: IComponentRender) => {
    const { theme } = useLayerContext<INestLayoutTheme>();
    return (
      <div
        className='row'
        style={{
          display: 'flex',
          position: 'relative',
          marginTop: theme.row.gap,
        }}
      >
        {props.children}
      </div>
    );
  },
};
export default Row;
