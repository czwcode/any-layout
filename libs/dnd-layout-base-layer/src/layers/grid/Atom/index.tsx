import React from 'react';
import PreviewAtom from './preview';
import {
  IAtomRenderer,
  LayerType,
  Action,
  DropOptions,
  INode,
  ISizeContext,
  SizeContext,
  SizeOptions,
} from 'dnd-layout-renderer';
import ActiveFrame from '../../nest/SizePanel/ActiveFrame';
import { LayerContext, IGridLayoutTheme } from '../../../context/theme';
import { useAnyLayoutDrag } from '../../../hooks/useAnyDrag';
import { getBoundingRect } from '../Layer/calcUtils';
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
    const parentAction = this.getParentAction();
    parentAction.onSizeChange(path, options);
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
    const { theme }: { theme: IGridLayoutTheme } = React.useContext(
      LayerContext
    );
    const size = React.useContext<ISizeContext>(SizeContext);
    // @ts-ignore
    const [collectDragProps, ref] = useAnyLayoutDrag<HTMLDivElement>({
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
          </PreviewAtom.renderer>
        </div>
      </div>
    );
  },
};
export default EditContainer;
