import React, {
  useRef,
  useState,
  useEffect,
  RefObject,
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
import { HoverDirection } from '../types';
import InteractiveCore from '../interactiveCore';
import { SizeMe } from 'react-sizeme';
import { ThemeContext, ILayoutTheme, defaultTheme } from '../types/theme';
import DragLayer, { IDragLayerFrameRenderer } from '../helps/DragLayer';
import { encodePath } from '../utils';

export interface IAtomFrameRenderer {
  node: INode
  width: number;
  height: number;
}

export interface IRenderCore {
  /**
   *  主题配置
   * @default " "
   */
  theme?: ILayoutTheme;
  // 布局信息
  layout: ILayout[];
  // 激活DragSizePanel的布局路径
  activePath?: number[];
  // 激活DragSizePanel时的回调
  onActivePathChange?: (path: number[]) => void;
  // 布局改变后的回调
  onLayoutChange: (layout: ILayout[]) => void;
  atomFrameRenderer?: (props: IAtomFrameRenderer) => React.ReactNode
  dragLayerFrameRenderer?: (props: IDragLayerFrameRenderer) => React.ReactNode
  // 修改传递给组件的属性
  generateProps?: (
    layout: ILayout,
    type: string,
    layoutType: LayoutType
  ) => any;
}

export const useForceUpdate = () => {
  const [state, setState] = useState(1);
  return () => {
    setState((state) => state + 1);
  };
};
function Wrapper({ children }: { layout: ILayout; children: React.ReactNode }) {
  return <>{children}</>;
}
export const MemoWrapper = memo<IAtomRenderer &{ layout: ILayout; children: React.ReactNode }>(
  Wrapper,
  (preProps, nextProps) => 
  {
    // 布局大小改变，不应该在这里校验
    const checkAttribute = ['layout', 'activePath']
    return checkAttribute.every((key) => {
      return !nextProps[key]  || preProps[key] === nextProps[key]
    }) 
  }
);
export function RenderCore(props: IRenderCore) {
  const {
    activePath,
    layout,
    theme = defaultTheme,
    onLayoutChange,
    generateProps = () => ({}),
    onActivePathChange,
    atomFrameRenderer,
    dragLayerFrameRenderer
  } = props;
  const interactiveCoreRef = useRef(new InteractiveCore(layout));
  const layerRef = useRef<HTMLDivElement>(null);
  const [storeLayout, setStoreLayout] = useState(null)
  function updateLayout() {
    setStoreLayout(interactiveCoreRef.current.get())
  }
  useEffect(() => {
    interactiveCoreRef.current.update(layout)
    updateLayout()
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
  interface ITraverse {
    layout: ILayout[];
    parent?: ILayout;
    hidden?: boolean;
    size: ISize;
    path?: number[];
  }
  function defaultSizeProcess(options: ISizeProcess) {
    const { layout, size } = options;
    const { w, h } = layout;
    const { width, height } = size;
    return {
      width: width || width === 0 ? width : w,
      height: height || h,
    };
  }

  function traverse(config: ITraverse) {
    const { layout, parent, size, path = [], hidden } = config;
    return layout.map((currentLayout, index) => {
      const { type } = currentLayout;
      // 获取组件
      const atoms = getRegist();
      const Atom = atoms[type];
      const layoutType = Atom.layoutType;
      const sizeProcess = Atom.sizeProcess || defaultSizeProcess;
      const currentPath = [...path, index];
      const afterProcessSize = sizeProcess({
        layout: currentLayout,
        theme,
        parent,
        size,
      });
      const newProps: IAtomRenderer = {
        layout: currentLayout,
        size: afterProcessSize,
        path: currentPath,
        atomFrameRenderer: atomFrameRenderer,
        activePath: getActivePath(),
        hidden: currentLayout.hidden || hidden,
        layer: layerRef.current,
        ...inneProps,
        ...generateProps(currentLayout, type, layoutType as any),
      };

      if (layoutType !== LayoutType.Atom) {
        return (
          <MemoWrapper key={encodePath(currentPath) + '-' + newProps.layout.id} {...newProps}>
            <Atom.renderer {...newProps}>
              {traverse({
                layout: currentLayout.children || [],
                parent: currentLayout,
                size: newProps.size,
                path: currentPath,
              })}
            </Atom.renderer>
           </MemoWrapper>
        );
      } else {
        return (
          <MemoWrapper key={encodePath(currentPath) + '-' + newProps.layout.id} layout={newProps.layout} {...newProps}>
            <Atom.renderer {...newProps} />
          </MemoWrapper>
        );
      }
    });
  }
  return (
    <div
      className='render-core-wrapper'
      ref={layerRef}
      style={{ background: 'rgb(235,235,235)', overflowX: 'hidden', padding: 12 }}
    >
      <ThemeContext.Provider value={theme ? theme : defaultTheme}>
        {
          layerRef.current && <SizeMe>
          {({ size }) => {
            interactiveCoreRef.current.updateWidth(size.width);
            const { width = 0 } = size;
            return (
              <div className='render-core'>
                {traverse({
                  layout: storeLayout,
                  size: {
                    width,
                    height: null,
                  },
                })}
              </div>
            );
          }}
        </SizeMe>
        }
        <DragLayer dragLayerFrameRenderer={dragLayerFrameRenderer} layerRef={layerRef.current} />
      </ThemeContext.Provider>
    </div>
  );
}

interface ICreateMutators {
  interactiveCoreRef: MutableRefObject<InteractiveCore>;
  layerRef: React.MutableRefObject<HTMLDivElement>;
  onLayoutChange: (layout: ILayout[]) => void;
  updateLayout: () => void;
  setActiveStatePath: (path: number[]) => void;
}
function createMutators(options: ICreateMutators): IInteractive {
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
      updateLayout()
    },
    onMove: (dragPath: number[], dropPath: number[], options) => {
      interactiveCoreRef.current.onMove(dragPath, dropPath, options);
      updateLayout()
    },
    onHover: (dragPath: number[], dropPath: number[], options) => {},
    onDrop: (dragPath: number[], path: number[], options) => {
      interactiveCoreRef.current.onDrop(dragPath, path, options);
      onLayoutChange(interactiveCoreRef.current.get());
      updateLayout()
    },
    onDropRow: (dragPath: number[], path: number[], options) => {
      interactiveCoreRef.current.onDropRow(path, options.data);
      onLayoutChange(interactiveCoreRef.current.get());
      updateLayout()
    },
    onDragEnd: (path: number[]) => {
      // 回滚布局变更
      // 拖拽到外面的时候，回滚布局
      interactiveCoreRef.current.restore();
      updateLayout()
    },
    onSizeChange: (path, direction, size) => {
      interactiveCoreRef.current.onSizeChange(path, {
        direction,
        size,
      });
      updateLayout()
    },
    onActive: (path) => {
      setActiveStatePath(path);
    },
  };
}
