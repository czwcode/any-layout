import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  Action,
  useLayoutDrop,
  INode,
  DropOptions,
  ILayout,
  SizeContext,
  DragDirection,
  SizeOptions,
} from 'dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
import {
  IGridLayoutTheme,
  LayerContext,
  useLayerContext,
} from '../../../context/theme';
import { useAnyLayoutDrop } from '../../../hooks/useAnyDrop';
import { AnyDropOptions, AnyAction } from '../../../actions';
import {
  getBoundingRect,
  relayoutNodes,
  getPositionParams,
  generatePosition,
} from './calcUtils';
import { calcMovePosition } from '../../../utils/calcPosition';
import { IAnySizeOptions } from '../../../types/layout';
export const GridLayerType = 'gridLayer';
export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
class RowAction extends AnyAction {
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onSizeChange(dragPath: number[], options: IAnySizeOptions): void {
    const { direction, mouseClientOffset, originMouseClientOffset } = options;
    const movePosition = calcMovePosition(
      originMouseClientOffset,
      mouseClientOffset
    );

    const node = this.getNode();
    switch (direction) {
      case DragDirection.BOTTOM:
        node.h = movePosition.y + node.h;
        break;
      case DragDirection.LEFT:
        node.w = movePosition.x + node.w;
        break;
      case DragDirection.RIGHT:
        node.w = movePosition.x + node.w;
        break;

      default:
        break;
    }

    const lastPath = dragPath[dragPath.length - 1];
    // const { dropBoundingRect } = options;
    // const { width } = dropBoundingRect;
    // relayoutNodes(this.getNode(), options);
  }
  onDrag() {}
  onDrop(dragPath: number[], dropPath: number[], options: AnyDropOptions) {
    const lastPath = dragPath[dragPath.length - 1];
    const {
      data,
      originMouseClientOffset,
      mouseClientOffset,
      dropBoundingRect,
      layerContext,
      size,
    } = options;
    const theme = layerContext.theme
    const movePosition = calcMovePosition(
      originMouseClientOffset,
      mouseClientOffset
    );
    const { width } = dropBoundingRect;
    const node = this.getNode();
    relayoutNodes(this.getNode(), options);
    const { x, y } = generatePosition(
      data,
      getPositionParams(theme, size.width),
      movePosition,
      node.children
    );
    data.x = x;
    data.y = y;
    this.getNode().children.splice(lastPath, 0, data);
  }
  onMove(dragPath: number[], dropPath: number[], options: AnyDropOptions) {
    relayoutNodes(this.getNode(), options);
  }
}

const GridLayer: IAtom = {
  layoutType: LayoutType.Layer,
  atomType: GridLayerType,
  action: RowAction,
  renderer: (props: IAtomRenderer) => {
    const { theme } = useLayerContext<IGridLayoutTheme>();
    const size = React.useContext(SizeContext);
    const { layout, path, onMove } = props;
    const [position, setPosition] = React.useState<{
      data: ILayout;
    }>(null);
    const prePosition = usePrevious<{
      data: ILayout;
    }>(position);
    // @ts-ignore
    const [_, ref] = useAnyLayoutDrop<HTMLDivElement>({
      path,
      onHover: (dragPath, path, options) => {
        const { data, originMouseClientOffset, mouseClientOffset  } = options;
        
        if (!position) {
          setPosition({
            data: data,
          });
        } else {
          const movePosition = calcMovePosition(originMouseClientOffset, mouseClientOffset)
          const { x, y } = generatePosition(
            data,
            getPositionParams(theme, size.width),
            movePosition,
            layout.children
          );
          // 找到当前合适的位置
          if (prePosition.data.x !== x || prePosition.data.y !== y) {
            setPosition({
              data: {
                ...data,
                x,
                y,
              },
            });
            onMove(dragPath, path, options);
          }
        }
      },
      onDrop: (dragPath, path, options) => {
        setPosition(null);
        props.onDrop(dragPath, path, options);
      },
    });
    // placeholder的大小
    const placeholderBounderRect =
      position && getBoundingRect(theme, size, position.data);
    return (
      <div
        ref={ref}
        className='absolute-layer'
        style={{
          width: toReal(layout.w, size.width),
          height: layout.h,
          position: 'relative',
          backgroundSize: '10px 10px',
          backgroundPosition: '1px 1px',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-90deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 10px)',
        }}
      >
        {props.children}
        {position && placeholderBounderRect && (
          <PlaceHolder
            x={placeholderBounderRect.left}
            y={placeholderBounderRect.top}
            width={placeholderBounderRect.width}
            height={placeholderBounderRect.height}
          />
        )}
      </div>
    );
  },
};
export interface IPlaceHolder {
  x: number;
  y: number;
  width: number;
  height: number;
}

function PlaceHolder(props: IPlaceHolder) {
  const { x, y, width, height } = props;
  return (
    <div
      style={{
        background: 'pink',
        position: 'absolute',
        transition: 'all 200ms ease',
        width,
        height,
        left: x,
        top: y,
      }}
    ></div>
  );
}
export default GridLayer;
