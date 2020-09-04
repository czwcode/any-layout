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
} from '@czwcode/dnd-layout-renderer';
import ActiveFrame from '../../nest/SizePanel/ActiveFrame';
import {
  IGridLayoutTheme,
  useLayerContext,
} from '../../../context/layerContext';
import { useAnyLayoutDrag } from '../../../hooks/useAnyDrag';
import { getBoundingRect, createSizeFakeNode } from '../Layer/calcUtils';
import { IAnySizeOptions } from '../../../types/layout';
import { useGlobalContext } from '../../../context/GlobalContext';
import { FakeNodePlaceHolder, usePrevious } from '../Layer';

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
    const { layer, interact, active, AtomRenderer } = useGlobalContext<
      IGridLayoutTheme
    >();
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
    const preFakeNode = usePrevious(fakeNode);
    // @ts-ignore
    const [collectDragProps, ref] = useAnyLayoutDrag<HTMLDivElement>({
      onDrag: (...arg) => {
        onDrag(...arg);
      },
      layerType: LayerType.Absolute,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd: () => {
        onDragEnd(path);
      },
      path,
    });

    const { width, height } = getBoundingRect(
      theme,
      size.width,
      layout
    );
    return (
      <>
        <div
          ref={ref}
          className='grid-atom-edit'
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
                recordStartDragNode.current = null;
                setFakeNode(null);
              }}
              layer={layer.current}
              path={path}
            >
              <div style={{ background: 'white' }}>
                <AtomRenderer node={layout} width={width} height={height} />
              </div>
            </ActiveFrame>
          </div>
        </div>

        {fakeNode && <FakeNodePlaceHolder layout={fakeNode} />}
      </>
    );
  },
};
export default EditContainer;
