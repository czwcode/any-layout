import React from 'react';
import PreviewAtom, { getBoundingRect } from './preview';
import {
  IAtomRenderer,
  useLayoutDrag,
  LayerType,
  Action,
  SizeOptions,
  DragDirection,
  DropOptions,
  INode,
  ThemeContext,
  ISizeContext,
  SizeContext,
  IGridLayoutTheme,
} from 'dnd-layout-renderer';
import ActiveFrame from '../../nest/SizePanel/ActiveFrame';

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
      onDrag,
      onDragEnd,
      path,
    } = props;
    const theme: IGridLayoutTheme = React.useContext(ThemeContext);
    console.log('theme: ', theme);
    const size = React.useContext<ISizeContext>(SizeContext);
    // @ts-ignore
    const [collectDragProps, ref] = useLayoutDrag<HTMLDivElement>({
      onDrag,
      layerType: LayerType.Absolute,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd,
      path,
    });
    const { width, height, left, top } = getBoundingRect(theme, size, layout);
    return (
      <div
        style={{
          left: left,
          top: top,
          width: width,
          height: height,
          transition: 'all 200ms ease',
          position: 'absolute',
        }}
      >
        <div
          ref={ref}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <PreviewAtom.renderer {...props}>
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
          </PreviewAtom.renderer>
        </div>
      </div>
    );
  },
};
export default EditContainer;
