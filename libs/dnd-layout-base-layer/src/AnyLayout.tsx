import React, { useState, useContext } from 'react';

import {
  RenderCore,
  IRenderCore,
  ITravseRendererFrame,
  ContextProcess,
  LayoutType,
  ILayout,
  getRegist,
  SizeContext,
  ISizeProcess,
  InteractiveCore,
} from 'dnd-layout-renderer';
import {
  LayerContext,
  defaultTheme,
  AnyLayoutTheme,
} from './context/layerContext';
import { ILayoutTheme } from './context/layerContext';
import {
  GlobalContext,
  createMutators,
  IInteractive,
  IGlobalContext,
  useGlobalContext,
  IAtomFrameRenderer,
} from './context/GlobalContext';
import { getMemoWrapper } from './MemoWrapper';
import { defaultAtomRenderer } from './utils/rendererHelp';
import { usePrevious } from './layers/grid/Layer';

export interface IAnyLayout extends IRenderCore {
  theme?: ILayoutTheme;
  active?: number | string;
  AtomRenderer?:
    | React.FC<IAtomFrameRenderer>
    | React.ComponentClass<IAtomFrameRenderer>;
  onLayoutChange?: (layout: ILayout[]) => void;
  onActive?: (active: number | string) => void;
}
function TravseRendererFrame(props: ITravseRendererFrame) {
  const { layoutType, layout, children, parent } = props;
  const { type, theme: currentLayoutTheme } = layout;
  const theme = useContext(AnyLayoutTheme);
  const layoutContext = useContext(LayerContext);
  const size = useContext(SizeContext);
  const { active } = useGlobalContext<IGlobalContext<any>>();
  const MemoWrapper = getMemoWrapper();
  const currentTheme =
    layoutType === LayoutType.Layer
      ? (theme && theme[type]) || currentLayoutTheme
      : null;
  const currentWidth = layoutContext ? layoutContext.width : size.width;
  return (
    <ContextProcess
      enable={
        layoutType === LayoutType.Layer ||
        layoutType === LayoutType.ContainerPanel
      }
      Ctx={LayerContext}
      value={React.useMemo(() => {
        return {
          theme: currentTheme,
          width: currentWidth,
        };
      }, [currentTheme, currentWidth])}
    >
      <SizeWrapper {...props}>
        <MemoWrapper layout={layout} active={active} key={layout.id}>
          {children}
        </MemoWrapper>
      </SizeWrapper>
    </ContextProcess>
  );
}

export interface ISizeWrapper {
  layout: ILayout;
  parent?: ILayout;
  path: number[];
  children?: React.ReactNode;
}
function defaultSizeProcess(options: ISizeProcess<any>) {
  const { layout, size } = options;
  const { w, h } = layout;
  const { width, height } = size;
  return {
    width: width || width === 0 ? width : w,
    height: height || h,
  };
}
const SizeWrapper = (props: ISizeWrapper) => {
  const size = useContext(SizeContext);
  const layoutContext = useContext(LayerContext);
  const { path, layout, children, parent } = props;
  const { type } = layout;
  // 获取组件
  const atoms = getRegist();
  const Atom = atoms[type];
  const sizeProcess = Atom.sizeProcess || defaultSizeProcess;
  const currentSize = React.useMemo(() => {
    return sizeProcess({
      layout: layout,
      path: path,
      theme: layoutContext && layoutContext.theme,
      parent,
      size,
    });
  }, [layout, path.join('.'), layoutContext, parent, size]);
  const preSize = usePrevious(currentSize)
  const preLayout = usePrevious(layout)
  console.log(111, preSize ===currentSize)
  console.log(2222, preLayout ===layout)
  return (
    <ContextProcess
      enable={true}
      Ctx={SizeContext}
      value={currentSize}
    >
      {children}
    </ContextProcess>
  );
};

export function AnyLayout(props: IAnyLayout) {
  const {
    layout,
    active,
    theme = defaultTheme,
    AtomRenderer,
    onActive,
  } = props;
  const interactiveCoreRef = React.useRef(new InteractiveCore(layout));
  const [storeLayout, setStoreLayout] = React.useState(null);
  React.useEffect(() => {
    interactiveCoreRef.current.update(layout);
    setStoreLayout(interactiveCoreRef.current.get());
  }, [layout]);
  const layer = React.useRef<HTMLDivElement>(null);
  const [activeStatePath, setActiveStatePath] = useState(active);
  const isUnderControl = active !== undefined;
  function getActivePath() {
    return isUnderControl ? active : activeStatePath;
  }
  const globalContext = React.useMemo<IGlobalContext<any>>(() => {
    const interact: IInteractive<any> = createMutators({
      onLayoutChange: (layout) => {
        setStoreLayout(layout);
      },
      interactiveCoreRef,
      setActiveStatePath: (path) => {
        onActive && onActive(path);
        setActiveStatePath(path);
      },
    });
    console.log('hahah');
    return {
      interact: interact,
      active: 111,
      layer: layer,
      AtomRenderer: AtomRenderer || defaultAtomRenderer,
    };
  }, [AtomRenderer, layout]);
  const preglobalContext = usePrevious(globalContext)
  const preLayout = usePrevious(layout)
  console.log("preglobalContext", preglobalContext ===globalContext)
  console.log("preLayout", preLayout ===layout)
  return (
    <GlobalContext.Provider value={globalContext}>
      <AnyLayoutTheme.Provider value={theme}>
        <RenderCore
          {...props}
          layout={storeLayout}
          withRef={layer}
          TravseRendererFrame={TravseRendererFrame}
        />
      </AnyLayoutTheme.Provider>
    </GlobalContext.Provider>
  );
}
