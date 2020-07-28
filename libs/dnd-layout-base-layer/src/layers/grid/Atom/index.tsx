import React from 'react';
import PreviewAtom from './preview';
import {
  IAtomRenderer,
  useLayoutDrag,
  LayerType,
  Action,
  SizeOptions,
  DragDirection,
  DropOptions,
  INode,
} from 'dnd-layout-renderer';
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
    console.log('atom render: ');
    const Renderer = PreviewAtom.renderer;
    const atomRef = React.useRef<HTMLDivElement>(null);
    // @ts-ignore
    const [collectDragProps, ref] = useLayoutDrag<HTMLDivElement>({
      onDrag,
      layerType: LayerType.Absolute,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd,
      path,
    });
    if (hidden) {
      return <div ref={ref}></div>;
    }
    return (
      <div
        style={{
          left: toReal(x, size.width),
          top: y,
          width: toReal(w, size.width),
          height: h,
          transition: 'all 200ms ease',
          position: 'absolute',
        }}
      >
        <div
          ref={ref}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
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
        </div>
      </div>
    );
  },
};
export default EditContainer;
