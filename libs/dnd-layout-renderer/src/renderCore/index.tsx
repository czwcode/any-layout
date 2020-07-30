import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import { ILayout } from '../types/layout';
import { IInteractive } from '../register';
import InteractiveCore from '../interactiveCore';
import { SizeMe } from 'react-sizeme';
import DragLayer from '../helps/DragLayer';
import { SizeContext } from '../context/sizeContext';
import { Traverse, IRenderCore } from './Travse';
import { InteractContext, createMutators } from '../context/InteractContext';
export * from './Travse';
export const useForceUpdate = () => {
  const [state, setState] = useState(1);
  return () => {
    setState((state) => state + 1);
  };
};

export function RenderCore(props: IRenderCore) {
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
      <InteractContext.Provider value={inneProps}>
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
                    <Traverse
                      {...props}
                      layout={storeLayout}
                      interactiveProps={inneProps}
                      getActivePath={getActivePath}
                      layerRef={layerRef}
                    />
                  </SizeContext.Provider>
                </div>
              );
            }}
          </SizeMe>
        )}
      </InteractContext.Provider>

      <DragLayer
        dragLayerFrameRenderer={dragLayerFrameRenderer}
        layerRef={layerRef.current}
      />
    </div>
  );
}
