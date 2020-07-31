import React, { useRef } from 'react';
import { ILayout } from '../types/layout';
import { SizeMe } from 'react-sizeme';
import DragLayer, { IDragLayerFrameRenderer } from '../helps/DragLayer';
import { SizeContext } from '../context/sizeContext';
import { LayoutTravse } from './LayoutTravse';
import { ILayoutTravseContext } from '../context/LayoutTravseContext';
export * from './LayoutTravse';
export * from '../context/LayoutTravseContext';

export function RenderCore(props: IRenderCore) {
  const { layout,withRef,  DragBoxRenderer } = props;
  const layerRef = useRef<HTMLDivElement>(null);
  withRef.current = layerRef.current
  return (
    <div
      className='render-core-wrapper'
      ref={layerRef}
      style={{
        background: 'rgb(237,237,237)',
        overflowX: 'hidden',
      }}
    >
      {layerRef.current && (
        <SizeMe>
          {({ size }) => {
            const { width = 0 } = size;
            console.log('props: ', props);
            return (
              <div className='render-core'>
                <SizeContext.Provider
                  value={{
                    width,
                    height: null,
                  }}
                >
                  <LayoutTravse {...props} layout={layout} />
                  
                </SizeContext.Provider>
              </div>
            );
          }}
        </SizeMe>
      )}

      <DragLayer
        DragBoxRenderer={DragBoxRenderer}
        layerRef={layerRef.current}
      />
    </div>
  );
}

export interface IRenderCore extends ILayoutTravseContext {
  /**
   * 用来渲染的布局的值
   */
  layout: ILayout[];

  /**
   * 可以通过该方法，对拖拽时候展示的内容进行渲染
   *
   * @memberof IRenderCore
   */
  DragBoxRenderer?: (props: IDragLayerFrameRenderer) => React.ReactNode;
  withRef?: React.MutableRefObject<HTMLDivElement>
  // /**
  //  * 布局改变后的回调
  //  *
  //  * @memberof IRenderCore
  //  */
  // onLayoutChange: (layout: ILayout[]) => void;
  //  /**
  //  * 可以通过该方法对Atom展示的内容进行定制
  //  *
  //  * @memberof IRenderCore
  //  */
  // AtomFrameRenderer?: (props: IAtomFrameRenderer) => React.ReactNode;
  // /**
  //  * 激活的SizePanel的路径
  //  */
  // activePath?: number[];
  // /**
  //  * 当用户激活SizePanel时的回调
  //  */
  // onActivePathChange?: (path: number[]) => void;
}
