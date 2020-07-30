import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  Action,
  useLayoutDrop,
  INode,
  DropOptions,
  SizeContext,
  SizeOptions,
} from 'dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
import { LayerContext } from '../../../context/theme';
import { calcMovePosition } from '../../../utils/calcPosition';
import { IAnySizeOptions } from '../../../types/layout';
export const AbsoluteLayerType = 'absoluteLayer';
class RowAction extends Action {
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onSizeChange(path: number[], options: IAnySizeOptions): void {
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
const Row: IAtom = {
  layoutType: LayoutType.Layer,
  atomType: AbsoluteLayerType,
  action: RowAction,
  renderer: (props: IAtomRenderer) => {
    const theme = React.useContext(LayerContext);
    const size = React.useContext(SizeContext);
    const { layout, path } = props;

    const { w, h } = layout;
    // @ts-ignore
    const [_, ref] = useLayoutDrop<HTMLDivElement>({
      path,
      onDrop: (dragPath, path, options) => {
        props.onDrop(dragPath, path, options);
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
