import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
  Action,
  useLayoutDrop,
  INode,
  DropOptions,
  SizeContext,
  ISizeOptions,
} from 'dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
import { LayerContext, useLayerContext } from '../../../context/layerContext';
import { calcMovePosition } from '../../../utils/calcPosition';
import { IAnySizeOptions } from '../../../types/layout';
import { AnyAction } from '../../../actions';
import { useGlobalContext } from '../../../context/GlobalContext';
export const AbsoluteLayerType = 'absoluteLayer';
class RowAction extends AnyAction<any> {
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onSizeChange(path: number[], options: IAnySizeOptions<any>): void {
    throw new Error('Method not implemented.');
  }
  onDrag() {
    throw new Error('Method not implemented.');
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions) {
    const { data } = options;
    const lastPath = dragPath[dragPath.length - 1];
    const { originMouseClientOffset, mouseClientOffset } = options;
    const movePosition = calcMovePosition(
      originMouseClientOffset,
      mouseClientOffset
    );
    const { x, y } = movePosition;
    data.x = data.x + x;
    data.y = data.y + y;
    this.getNode().children.splice(lastPath, 0, data);
  }
  onMove(dragPath: number[], dropPath: number[], options: DropOptions) {}
}
const Row: IComponent = {
  layoutType: LayoutType.Layer,
  atomType: AbsoluteLayerType,
  action: RowAction,
  renderer: (props: IComponentRender) => {
    const { interact } = useGlobalContext<any>();
    const layerContext = useLayerContext();
    const { onDrop } = interact;
    const size = React.useContext(SizeContext);
    const { layout, path } = props;

    const { w, h } = layout;
    // @ts-ignore
    const [_, ref] = useLayoutDrop<HTMLDivElement>({
      path,
      onDrop: (dragPath, path, options) => {
        onDrop(dragPath, path, { ...options, layerContext });
      },
    });
    return (
      <div
        ref={ref}
        className='absolute-layer'
        style={{
          width: toReal(w, size.width),
          height: h,
          position: 'relative',
          backgroundSize: '10px 10px',
          backgroundPosition: '1px 1px',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-90deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 10px)',
        }}
      >
        {props.children}
      </div>
    );
  },
};
export default Row;
