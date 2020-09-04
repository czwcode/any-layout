import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
  INode,
  ILayout,
  SizeContext,
  DragDirection,
} from '@czwcode/dnd-layout-renderer';
import { toReal, toVirtual } from '../../../utils/calcWidth';
import {
  IGridLayoutTheme,
  useLayerContext,
  INestLayoutTheme,
} from '../../../context/layerContext';
import { useAnyLayoutDrop } from '../../../hooks/useAnyDrop';
import { IAnyDropOptions, AnyAction } from '../../../actions';
import {
  getBoundingRect,
  relayoutNodes,
  createFakeNode,
  createSizeFakeNode,
} from './calcUtils';
import { IAnySizeOptions } from '../../../types/layout';
import { useGlobalContext } from '../../../context/GlobalContext';
export const GridLayerType = 'gridLayer';
export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
class RowAction extends AnyAction<IGridLayoutTheme> {
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onSizeChange(
    dragPath: number[],
    options: IAnySizeOptions<IGridLayoutTheme>
  ): void {
    const node = this.getNode();
    const lastPath = dragPath[dragPath.length - 1];
    const dragNode = node.children[lastPath];
    const newDragNode = createSizeFakeNode(dragNode, options);
    relayoutNodes(
      newDragNode,
      node.children.filter((item) => item.id !== dragNode.id)
    );
  }

  onSizeChanging(
    dragPath: number[],
    options: IAnySizeOptions<IGridLayoutTheme>
  ): void {
    const node = this.getNode();
    const lastPath = dragPath[dragPath.length - 1];
    const dragNode = node.children[lastPath];
    const newDragNode = createSizeFakeNode(
      JSON.parse(JSON.stringify(dragNode)),
      options
    );
    relayoutNodes(newDragNode, node.children);
  }
  onDrag() {}
  onDrop(
    dragPath: number[],
    dropPath: number[],
    options: IAnyDropOptions<IGridLayoutTheme>
  ) {
    const {
      data,
      originMouseClientOffset,
      mouseClientOffset,
      layerContext,
      size,
    } = options;
    const theme = layerContext.theme;
    const node = this.getNode();
    const validNodes = node.children.filter((item) => item.id !== data.id);
    const fakeNode = createFakeNode(
      data,
      validNodes,
      theme,
      size.width,
      originMouseClientOffset,
      mouseClientOffset
    );
    relayoutNodes(fakeNode, node.children);

    data.x = fakeNode.x;
    data.y = fakeNode.y;
    const lastPath = dragPath[dragPath.length - 1];
    this.getNode().children.splice(lastPath, 0, data);
  }
  onMove(
    dragPath: number[],
    dropPath: number[],
    options: IAnyDropOptions<IGridLayoutTheme>
  ) {
    const {
      data,
      originMouseClientOffset,
      mouseClientOffset,
      layerContext,
    } = options;
    const theme = layerContext.theme;
    const node = this.getNode();
    const validNodes = node.children.filter((item) => item.id !== data.id);
    const fakeNode = createFakeNode(
      data,
      validNodes,
      theme,
      layerContext.width,
      originMouseClientOffset,
      mouseClientOffset
    );
    relayoutNodes(fakeNode, validNodes);
  }
}

const GridLayer: IComponent<INestLayoutTheme> = {
  layoutType: LayoutType.Layer,
  atomType: GridLayerType,
  action: RowAction,
  renderer: (props: IComponentRender) => {
    const { theme } = useLayerContext<IGridLayoutTheme>();
    const size = React.useContext(SizeContext);
    const placeholderRef = React.useRef<HTMLDivElement>(null);

    
    const { layout, path } = props;
    const { width, height, left, top } = getBoundingRect(
      theme,
      size.width,
      layout
    );
    const { interact } = useGlobalContext<IGridLayoutTheme>();
    let { onMove, onDrop } = interact;
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
        const { data, originMouseClientOffset, mouseClientOffset } = options;
        if (!position) {
          setPosition({
            data: data,
          });
        } else {
          const fakeNode = createFakeNode(
            data,
            layout.children,
            theme,
            size.width,
            originMouseClientOffset,
            mouseClientOffset
          );
          // 找到当前合适的位置
          if (
            prePosition.data.x !== fakeNode.x ||
            prePosition.data.y !== fakeNode.y
          ) {
            setPosition({
              data: fakeNode,
            });

            onMove(dragPath, path, options);
          }
        }
      },
      onDrop: (dragPath, path, options) => {
        setPosition(null);
        onDrop(dragPath, path, options);
      },
    });
    // placeholder的大小
    return (
      <div
        ref={ref}
        className='absolute-layer'
        style={{
          width: width,
          height: height,
          position: 'relative',
          backgroundSize: '10px 10px',
          backgroundPosition: '1px 1px',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-90deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 10px)',
        }}
      >
        {props.children}
        {position && position.data && (
          <FakeNodePlaceHolder layout={position.data} />
        )}
      </div>
    );
  },
};
export interface IPlaceHolder {
  layout: INode;
}

export function FakeNodePlaceHolder(props: IPlaceHolder) {
  const { layout } = props;
  const layerContext = useLayerContext<any>();
  const { left, top, width, height } = getBoundingRect(
    layerContext.theme,
    layerContext.width,
    layout
  );
  return (
    <div
      style={{
        background: 'pink',
        position: 'absolute',
        opacity: 0.3,
        zIndex: 10,
        transition: 'all 200ms ease',
        width,
        height,
        left: left,
        top: top,
      }}
    ></div>
  );
}
export default GridLayer;
