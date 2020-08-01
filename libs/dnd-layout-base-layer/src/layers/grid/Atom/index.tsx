import React from 'react';
import PreviewAtom from './preview';
import {
  IComponentRender,
  LayerType,
  Action,
  DropOptions,
  INode,
  ISizeContext,
  SizeContext,
} from 'dnd-layout-renderer';
import ActiveFrame from '../../nest/SizePanel/ActiveFrame';
import {
  IGridLayoutTheme,
  useLayerContext,
} from '../../../context/layerContext';
import { useAnyLayoutDrag } from '../../../hooks/useAnyDrag';
import {
  getBoundingRect,
  createSizeFakeNode,
  getPositionParams,
} from '../Layer/calcUtils';
import { IAnySizeOptions } from '../../../types/layout';
import { useGlobalContext } from '../../../context/GlobalContext';
import { calcMovePosition } from '../../../utils/calcPosition';
import { FakeNodePlaceHolder, usePrevious } from '../Layer';

class AtomAction extends Action {
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error('Method not implemented.');
  }
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onDrag() {}
  onMove(dragPath, dropPath, options) {
    const parentAction = this.getParentAction();
    parentAction.onMove(dragPath, dropPath, options);
  }
  onSizeChange(path: number[], options: IAnySizeOptions<IGridLayoutTheme>) {
    const parentAction = this.getParentAction();
    parentAction.onSizeChange(path, options);
  }
  onSizeChanging(path: number[], options: IAnySizeOptions<IGridLayoutTheme>) {
    const parentAction = this.getParentAction();
    parentAction.onSizeChanging(path, options);
  }
}
const EditContainer = {
  ...PreviewAtom,
  action: AtomAction,
  renderer: (props: IComponentRender) => {
    const { layout, path } = props;
    const layerContext = useLayerContext<IGridLayoutTheme>();
    const { theme } = layerContext;
    const { layer, interact, active } = useGlobalContext<IGridLayoutTheme>();
    const {
      onSizeChange,
      onDrag,
      onDragEnd,
      onActive,
      onSizeChanging,
    } = interact;
    const size = React.useContext<ISizeContext>(SizeContext);
    const recordStartDragNode = React.useRef(null);
    const [fakeNode, setFakeNode] = React.useState<INode>(null);
    const [hidden, setHidden] = React.useState<boolean>(false);
    const [temporaryNode, setTemporaryNode] = React.useState<{
      x: number;
      y: number;
    }>(null);
    const preFakeNode = usePrevious(fakeNode);
    // @ts-ignore
    const [collectDragProps, ref] = useAnyLayoutDrag<HTMLDivElement>({
      onDrag: (...arg) => {
        setHidden(true);
        onDrag(...arg);
      },
      layerType: LayerType.Absolute,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd: () => {
        setHidden(false);
        onDragEnd(path);
      },
      path,
    });
    const { width, height, left, top } = getBoundingRect(
      theme,
      size.width,
      layout
    );
    const originPosition =
      recordStartDragNode.current &&
      getBoundingRect(theme, size.width, recordStartDragNode.current);
    const style: React.CSSProperties = {
      // left: left,
      // top: top,
      transform: `translate(${left}px, ${top}px)`,
      width: temporaryNode ? originPosition.width + temporaryNode.x : width,
      height: temporaryNode ? originPosition.height + temporaryNode.y : height,
      position: 'absolute',
    };
    if (hidden) {
      return <div style={style} ref={ref}></div>;
    }
    return (
      <>
        <div style={{transition: 'all 200ms ease', ...style}}>
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
                  onActive(layout.id);
                }}
                ActiveOperateComponent={() => {
                  return <div></div>;
                }}
                active={active === layout.id}
                onStartSizeChange={() => {
                  recordStartDragNode.current = JSON.parse(
                    JSON.stringify(layout)
                  );
                }}
                onSizeChanging={(options) => {
                  const fakeNode = createSizeFakeNode(
                    { ...layout },
                    {
                      ...options,
                      layerContext: layerContext,
                      originNode: recordStartDragNode.current,
                    }
                  );
                  // setTemporaryNode(calcMovePosition(options.originMouseClientOffset, options.mouseClientOffset))
                  if (
                    !preFakeNode ||
                    preFakeNode.w !== fakeNode.w ||
                    preFakeNode.h !== fakeNode.h
                  ) {
                    setFakeNode(fakeNode);
                    onSizeChanging(path, {
                      ...options,
                      layerContext: layerContext,
                      originNode: { ...recordStartDragNode.current },
                    });
                  }
                }}
                onSizeChange={(options) => {
                  onSizeChange(path, {
                    ...options,
                    layerContext: layerContext,
                    originNode: recordStartDragNode.current,
                  });
                  setFakeNode(null);
                  setTemporaryNode(null);
                }}
                layer={layer.current}
                path={path}
              />
            </PreviewAtom.renderer>
          </div>
        </div>
        {fakeNode && <FakeNodePlaceHolder layout={fakeNode} />}
      </>
    );
  },
};
export default EditContainer;
