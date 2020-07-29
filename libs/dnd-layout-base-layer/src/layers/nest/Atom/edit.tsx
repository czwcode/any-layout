import React from 'react';
import PreviewAtom from './preview';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  IAtomRenderer,
  useLayoutDragAndDop,
  Action,
  SizeOptions,
  DragDirection,
  DropOptions,
  INode,
  HoverOptions,
} from 'dnd-layout-renderer';
import { calcDirection, HoverDirection } from './calcHover';
import DirectionOverlap from './DirectionOverlap';
import ActiveFrame from '../SizePanel/ActiveFrame';

class AtomAction extends Action {
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onMove(dragPath: number[], dropPath: number[], options: HoverOptions): void {
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
    const { clientOffset, dropBoundingRect, data } = options;
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
  onSizeChange(options: SizeOptions) {
    const { direction, size } = options;

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
      parentAction.onSizeChange(options);
    }
  }
}
const EditContainer = {
  ...PreviewAtom,
  action: AtomAction,
  renderer: (props: IAtomRenderer) => {
    const {
      layout,
      onDrag,
      onDrop,
      onDragEnd,
      path,
      activePath,
      layer,
      onActive,
      onSizeChange,
    } = props;
    const Renderer = PreviewAtom.renderer;
    const [direction, setDirection] = React.useState<HoverDirection>(null);

    // @ts-ignore
    const [
      collectDragProps,
      collectDropProps,
      ref,
      preview,
    ] = useLayoutDragAndDop<HTMLDivElement>({
      onDrag,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd,
      path,
      onHover: (dragPaht, path, options) => {
        // 组件为加载完成
        const { clientOffset, dropBoundingRect } = options;
        const currentDirection = calcDirection(dropBoundingRect, clientOffset);
        if (direction !== currentDirection) {
          setDirection(currentDirection);
        }
      },
      onDrop: (dragPath, path, options) => {
        onDrop(dragPath, path, options);
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
              border: '1px solid lightgrey',
            }}
          ></div>
          <DirectionOverlap direction={collectDropProps.isOver && direction} />
        </Renderer>
      </div>
    );
  },
};
export default EditContainer;
