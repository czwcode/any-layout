import React from 'react';
import PreviewAtom from './preview';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  IComponentRender,
  Action,
  DragDirection,
  DropOptions,
  INode,
  SizeContext,
} from 'dnd-layout-renderer';
import { calcDirection, HoverDirection } from './calcHover';
import DirectionOverlap from './DirectionOverlap';
import ActiveFrame from '../SizePanel/ActiveFrame';
import { useAnyLayoutDragAndDop } from '../../../hooks/useAnyDragAndDrop';
import { calcMovePosition } from '../../../utils/calcPosition';
import { toVirtual } from '../../../utils/calcWidth';
import { IAnySizeOptions } from '../../../types/layout';
import {
  LayerContext,
  INestLayoutTheme,
  useLayerContext,
} from '../../../context/layerContext';
import { useGlobalContext } from '../../../context/GlobalContext';

class AtomAction extends Action {
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onMove(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error('Method not implemented.');
  }
  onDrag() {
    const node = this.getNode();
    if (!this.dispatchOthers('onDrag', ...arguments)) {
      // 交互规则，如果当前节点被移除了，希望兄弟节点来填补空白
      const sibling = this.getPreviousSibling()
        ? this.getPreviousSibling()
        : this.getNextSibling();
      sibling.h = node.h + sibling.h;
      this.removeSelf();
    }
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions) {
    const {
      mouseClientOffset: clientOffset,
      dropBoundingRect,
      data,
      size,
    } = options;
    const direction = calcDirection(dropBoundingRect, clientOffset);
    const node = this.getNode();
    const parent = this.getParent();
    const parentAction = this.getParentAction();
    if (
      direction === HoverDirection.TOP ||
      direction === HoverDirection.BOTTOM
    ) {
      data.h = node.h / 2;
      node.h = node.h / 2;
      if (direction === HoverDirection.TOP) {
        this.insertBefore(data);
      } else {
        this.insertAfter(data);
      }
    } else {
      parentAction.onDrop(dragPath, dropPath, options);
    }
  }
  onSizeChange(path: number[], options: IAnySizeOptions<INestLayoutTheme>) {
    const {
      direction,
      mouseClientOffset,
      originMouseClientOffset,
      layerContext,
    } = options;
    const { width, theme } = layerContext;
    const { x, y } = calcMovePosition(
      originMouseClientOffset,
      mouseClientOffset
    );
    const size = Math.floor(y / theme.rowHeight);
    const node = this.getNode();
    const parent = this.getParent();
    const grandParent = this.getGrandParent();
    const parentAction = this.getParentAction();
    if (direction === DragDirection.BOTTOM) {
      grandParent.children.forEach((child, index) => {
        if (child !== parent) {
          child.children.forEach((current) => {
            current.h = current.h + size / child.children.length;
          });
        }
      });
      node.h = node.h + size;
    } else {
      parentAction.onSizeChange(path, options);
    }
  }
}
const EditContainer = {
  ...PreviewAtom,
  action: AtomAction,
  renderer: (props: IComponentRender) => {
    const { layout, path } = props;
    const Renderer = PreviewAtom.renderer;
    const layerContext = useLayerContext<INestLayoutTheme>();
    const { layer, interact, active } = useGlobalContext<INestLayoutTheme>();
    const { onSizeChange, onDrag, onDragEnd, onActive, onDrop } = interact;
    const [direction, setDirection] = React.useState<HoverDirection>(null);
    const size = React.useContext(SizeContext);
    // @ts-ignore
    const [
      collectDragProps,
      collectDropProps,
      ref,
      preview,
    ] = useAnyLayoutDragAndDop<HTMLDivElement>({
      onDrag,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd,
      path,
      onHover: (dragPaht, path, options) => {
        // 组件为加载完成
        const { mouseClientOffset: clientOffset, dropBoundingRect } = options;
        const currentDirection = calcDirection(dropBoundingRect, clientOffset);
        if (direction !== currentDirection) {
          setDirection(currentDirection);
        }
      },
      onDrop: (dragPath, path, options) => {
        onDrop(dragPath, path, { ...options, layerContext });
      },
    });
    React.useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    }, []);
    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
        }}
      >
        <Renderer {...props}>
          <div
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              boxSizing: 'border-box',
              top: 0,
              border: '1px solid lightgrey',
            }}
          ></div>
          <ActiveFrame
            onActive={() => {
              onActive(layout.id);
            }}
            ActiveOperateComponent={() => {
              return <div></div>;
            }}
            active={active === layout.id}
            onSizeChange={(options) => {
              onSizeChange(path, {
                ...options,
                layerContext: layerContext,
                size,
              } as any);
            }}
            layer={layer.current}
            path={path}
          />
          <DirectionOverlap direction={collectDropProps.isOver && direction} />
        </Renderer>
      </div>
    );
  },
};
export default EditContainer;
