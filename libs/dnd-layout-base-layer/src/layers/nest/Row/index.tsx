import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  Action,
  ILayout,
  DropOptions,
  INode,
  HoverOptions,
  SizeOptions,
  INestLayoutTheme,
} from 'dnd-layout-renderer';
import { getColNode } from '../Col';
import { ThemeContext } from 'dnd-layout-renderer';
import { calcDirection, HoverDirection } from '../Atom/calcHover';
export const RowType = 'row';
export function getRowNode(data: ILayout) {
  return {
    type: RowType,
    children: [getColNode(24, data)],
  } as ILayout;
}
class RowAction extends Action {
  onRemove(): INode {
    throw new Error("Method not implemented.");
  }
  onMove(dragPath: number[], dropPath: number[], options: HoverOptions): void {
    throw new Error("Method not implemented.");
  }
  onSizeChange(options: SizeOptions): void {
    throw new Error("Method not implemented.");
  }
  onDrag() {
    if (!this.dispatchOthers('onDrag', ...arguments)) {
      // 交互规则，如果当前节点被移除了，希望兄弟节点来填补空白
      this.removeSelf();
    }
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions) {
    const { dropBoundingRect, clientOffset} = options
    const direction =calcDirection(dropBoundingRect, clientOffset)
    const { data } = options
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
const Row: IAtom = {
  layoutType: LayoutType.Layout,
  atomType: RowType,
  action: RowAction,
  renderer: (props: IAtomRenderer) => {
    const theme: INestLayoutTheme = React.useContext(ThemeContext) ;
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
