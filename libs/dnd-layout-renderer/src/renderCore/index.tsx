import React, {
  useRef,
  useState,
  useEffect,
  MutableRefObject,
  memo,
} from 'react';
import { ILayout, LayoutType, INode } from '../types/layout';
import {
  getRegist,
  ISizeProcess,
  ISize,
  IInteractive,
  IAtomRenderer,
} from '../register';
import InteractiveCore from '../interactiveCore';
import { SizeMe } from 'react-sizeme';
import {
  ThemeContext,
  ILayoutTheme,
  defaultTheme,
} from '../../../dnd-layout-base-layer/src/context/theme';
import DragLayer, { IDragLayerFrameRenderer } from '../helps/DragLayer';
import { encodePath } from '../utils';
import ContextProcess from '../context/ContextProcess';
import { SizeContext } from '../context/sizeContext';
import { Traverse, IRenderCore } from './Travse';



export const useForceUpdate = () => {
  const [state, setState] = useState(1);
  return () => {
    setState((state) => state + 1);
  };
};

export function RenderCore<ITheme>(props: IRenderCore<ITheme>) {
  const {
    activePath,
    layout,
    onLayoutChange,
    onActivePathChange,
    dragLayerFrameRenderer,
  } = props;
  const interactiveCoreRef = useRef(new InteractiveCore(layout));
  const layerRef = useRef<HTMLDivElement>(null);
  const [storeLayout, setStoreLayout] = useState(null);
  function updateLayout() {
    setStoreLayout(interactiveCoreRef.current.get());
  }
  useEffect(() => {
    interactiveCoreRef.current.update(layout);
    updateLayout();
  }, [layout]);

  const [activeStatePath, setActiveStatePath] = useState(activePath);
  const isUnderControl = activePath !== undefined;
  function getActivePath() {
    return isUnderControl ? activePath : activeStatePath;
  }
  const inneProps: IInteractive = createMutators({
    updateLayout,
    onLayoutChange,
    layerRef,
    interactiveCoreRef,
    setActiveStatePath: (path) => {
      onActivePathChange && onActivePathChange(path);
      setActiveStatePath(path);
    },
  });
  
  return (
    <div
      className='render-core-wrapper'
      ref={layerRef}
      style={{
        background: 'rgb(237,237,237)',
        overflowX: 'hidden',
        padding: 12,
      }}
    >
      {layerRef.current && (
        <SizeMe>
          {({ size }) => {
            const { width = 0 } = size;
            return (
              <div className='render-core'>
                <SizeContext.Provider
                  value={{
                    width,
                    height: null,
                  }}
                >
                  <Traverse {...props} layout={storeLayout} interactiveProps={inneProps} getActivePath={getActivePath} layerRef={layerRef}/>
                </SizeContext.Provider>
              </div>
            );
          }}
        </SizeMe>
      )}
      <DragLayer
        dragLayerFrameRenderer={dragLayerFrameRenderer}
        layerRef={layerRef.current}
      />
    </div>
  );
}

interface ICreateMutators<ITheme> {
  interactiveCoreRef: MutableRefObject<InteractiveCore>;
  layerRef: React.MutableRefObject<HTMLDivElement>;
  onLayoutChange: (layout: ILayout<ITheme>[]) => void;
  updateLayout: () => void;
  setActiveStatePath: (path: number[]) => void;
}
function createMutators<ITheme>(options: ICreateMutators<ITheme>): IInteractive {
  const {
    interactiveCoreRef,
    updateLayout,
    onLayoutChange,
    setActiveStatePath,
  } = options;

  return {
    onDrag: (path: number[]) => {
      console.log('onDrag: ', path);
      interactiveCoreRef.current.onDrag(path);
      updateLayout();
    },
    onMove: (dragPath: number[], dropPath: number[], options) => {
      interactiveCoreRef.current.onMove(dragPath, dropPath, options);
      updateLayout();
    },
    onDrop: (dragPath: number[], path: number[], options) => {
      interactiveCoreRef.current.onDrop(dragPath, path, options);
      onLayoutChange(interactiveCoreRef.current.get());
      updateLayout();
    },
    onDropRow: (dragPath: number[], path: number[], options) => {
      interactiveCoreRef.current.onDropRow(path, options.data);
      onLayoutChange(interactiveCoreRef.current.get());
      updateLayout();
    },
    onDragEnd: (path: number[]) => {
      // 回滚布局变更
      // 拖拽到外面的时候，回滚布局
      interactiveCoreRef.current.restore();
      updateLayout();
    },
    onSizeChange: (path, direction, size) => {
      interactiveCoreRef.current.onSizeChange(path, {
        direction,
        size,
      });
      updateLayout();
    },
    onActive: (path) => {
      setActiveStatePath(path);
    },
  };
}
