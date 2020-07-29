import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  Action,
  ILayout,
  DragDirection,
  SizeOptions,
  ILayoutTheme,
  DropOptions,
  INode,
  HoverOptions,
  IAnyLayoutTheme,
  INestLayoutTheme,
} from 'dnd-layout-renderer';
import { ThemeContext, ISizeContext } from 'dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
import { calcDirection, HoverDirection } from '../Atom/calcHover';
import { SizeContext } from '../../../../../dnd-layout-renderer/src/context/sizeContext';
export const ColType = 'col';
export function getColNode(w: number, data: ILayout) {
  return {
    type: ColType,
    w: w,
    children: [data],
  } as ILayout;
}
class ColAction extends Action {
  onRemove(): INode {
    throw new Error("Method not implemented.");
  }
  onMove(dragPath: number[], dropPath: number[], options: HoverOptions): void {
    throw new Error("Method not implemented.");
  }
  onDrag() {
    if (!this.dispatchOthers('onDrag', ...arguments)) {
      // 交互规则，如果当前节点被移除了，希望兄弟节点来填补空白
      const sibling = this.getPreviousSibling()
        ? this.getPreviousSibling()
        : this.getNextSibling();
      sibling.w = this.getNode().w + sibling.w;
      this.removeSelf();
    }
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions) {
    const { dropBoundingRect, clientOffset, data } = options;
    const direction = calcDirection(dropBoundingRect, clientOffset);
    const node = this.getNode();
    if (
      direction === HoverDirection.LEFT ||
      direction === HoverDirection.RIGHT
    ) {
      data.h = node.children.reduce((rowHeight, child) => {
        return rowHeight + child.h;
      }, 0);
      const colData = getColNode(node.w / 2, data);
      node.w = node.w / 2;
      if (direction === HoverDirection.LEFT) {
        this.insertBefore(colData);
      } else {
        this.insertAfter(colData);
      }
    } else {
      const parentAction = this.getParentAction();
      parentAction.onDrop(dragPath, dropPath, options);
    }
  }
  onSizeChange(options: SizeOptions) {
    const { direction, size } = options;

    const node = this.getNode();
    const preSibling = this.getPreviousSibling();
    const nextSibling = this.getNextSibling();
    if (direction === DragDirection.LEFT) {
      node.w = node.w - size;
      preSibling.w = preSibling.w + size;
    } else {
      node.w = node.w + size;
      nextSibling.w = nextSibling.w - size;
    }
  }
}
const Col: IAtom = {
  layoutType: LayoutType.Layout,
  atomType: ColType,
  action: ColAction,
  sizeProcess: (config) => {
    const { layout, size, parent, theme } = config;
    const childCount = parent.children.length;
    const w = (theme.nest.col.gap * (childCount - 1)) / childCount;
    return {
      ...size,
      width: toReal(layout.w, size.width) - w,
    };
  },
  renderer: (props: IAtomRenderer) => {
    const { width } = React.useContext<ISizeContext>(SizeContext);
    const theme: INestLayoutTheme = React.useContext(ThemeContext) ;
    const style = {
      boxSizing: 'border-box',
      position: 'relative',
      transition: 'all 200ms ease',
      marginRight: theme.col.gap,
      flex: `1 0 ${width}px`,
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
    } as React.CSSProperties;
    return <div style={style}> {props.children}</div>;
  },
};
export default Col;
