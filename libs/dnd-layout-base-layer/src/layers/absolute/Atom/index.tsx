import React from 'react';
import PreviewAtom from './preview';
import {
  IAtomRenderer,
  LayerType,
  Action,
  INode,
  DropOptions,
  SizeContext,
  DragDirection,
  SizeOptions,
} from 'dnd-layout-renderer';
import ActiveFrame from '../../nest/SizePanel/ActiveFrame';
import { toReal } from '../../../utils/calcWidth';
import { useAnyLayoutDrag } from '../../../hooks/useAnyDrag';
import { calcMovePosition } from '../../../utils/calcPosition';
import { IAnySizeOptions } from '../../../types/layout';
class AtomAction extends Action {
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error('Method not implemented.');
  }
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onDrag() {
    this.removeSelf();
  }
  onMove(dragPath, dropPath, options) {
    const parentAction = this.getParentAction();
    parentAction.onMove(dragPath, dropPath, options);
  }
  onSizeChange(path: number[], options: IAnySizeOptions) {
    const { direction, mouseClientOffset, originMouseClientOffset } = options;
    const { x, y } = calcMovePosition(
      originMouseClientOffset,
      mouseClientOffset
    );
    const node = this.getNode();
    switch (direction) {
      case DragDirection.BOTTOM:
        node.h = y + node.h;
        break;
      case DragDirection.LEFT:
        node.w = x + node.w;
        break;
      case DragDirection.RIGHT:
        node.w = x + node.w;
        break;

      default:
        break;
    }
  }
}
const EditContainer = {
  ...PreviewAtom,
  action: AtomAction,
  renderer: (props: IAtomRenderer) => {
    const {
      layout,
      activePath,
      onActive,
      layer,
      onSizeChange,
      onDrag,
      onDragEnd,
      path,
    } = props;
    const { x, y, w, h } = layout;
    const Renderer = PreviewAtom.renderer;
    // @ts-ignore
    const [collectDragProps, ref] = useAnyLayoutDrag<HTMLDivElement>({
      onDrag,
      layerType: LayerType.Absolute,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd,
      path,
    });
    const size = React.useContext(SizeContext);
    return (
      <div
        style={{
          left: x,
          top: y,
          transition: 'all 200ms ease',
          width: toReal(layout.w, size.width),
          height: h,
          position: 'absolute',
        }}
      >
        <div
          ref={ref}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              boxSizing: 'border-box',
              top: 0,
              border: '1px dashed lightgrey',
            }}
          ></div>

          <Renderer {...props} />
          <ActiveFrame
            onActive={() => {
              onActive(path);
            }}
            ActiveOperateComponent={() => {
              return <div></div>;
            }}
            activePath={activePath}
            onSizeChange={(options) => {
              onSizeChange(path, {
                ...options,
                size,
              });
            }}
            layer={layer}
            path={path}
          />
        </div>
      </div>
    );
  },
};
export default EditContainer;
