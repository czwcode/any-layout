import React from 'react';
import PreviewAtom from './preview';
import { IAtomRenderer, useLayoutDrag, LayoutType, LayerType, Action, INode, SizeOptions, DragDirection, DropOptions } from 'dnd-layout-renderer';
import ActiveFrame from '../../nest/SizePanel/ActiveFrame';
import { toReal } from '../../../utils/calcWidth';
class AtomAction extends Action {
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error("Method not implemented.");
  }
  onRemove(): INode {
    throw new Error("Method not implemented.");
  }
  onDrag() {
    this.removeSelf();
  }
  onMove(dragPath, dropPath, options) {
    const parentAction = this.getParentAction();
    parentAction.onMove(dragPath, dropPath, options);
  }
  onSizeChange(options: SizeOptions) {
    const { direction, size } = options;

    const node = this.getNode();
    switch (direction) {
      case DragDirection.BOTTOM:
        node.h = size + node.h;
        break;
      case DragDirection.LEFT:
        node.w = size + node.w;
        break;
      case DragDirection.RIGHT:
        node.w = size + node.w;
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
      hidden,
      onDrag,
      onDragEnd,
      path,
      size,
    } = props;
    const { x, y, w, h } = layout;
    const Renderer = PreviewAtom.renderer;
    // @ts-ignore
    const [collectDragProps,ref] = useLayoutDrag<HTMLDivElement>({
      onDrag,
      layerType: LayerType.Absolute,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd,
      path,
    });
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
            onSizeChange={(direction, size) => {
              onSizeChange(path, direction, size);
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
