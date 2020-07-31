import React, { useState } from 'react';

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
} from './context/GlobalContext';
import { getMemoWrapper } from './MemoWrapper';

export interface IAnyLayout extends IRenderCore {
  theme?: ILayoutTheme;
  active?: number | string;
  onActive?: (active: number | string) => void;
}
function TravseRendererFrame(props: ITravseRendererFrame) {
  const { layoutType, layout, children, parent } = props;
  const { type, theme: currentLayoutTheme } = layout;
  const theme = React.useContext(AnyLayoutTheme);
  const layoutContext = React.useContext(LayerContext);
  const size = React.useContext(SizeContext);
  const { active } = useGlobalContext<IGlobalContext<any>>();
  const MemoWrapper = getMemoWrapper();
  return (
    <ContextProcess
      enable={
        layoutType === LayoutType.Layer ||
        layoutType === LayoutType.ContainerPanel
      }
      Ctx={LayerContext}
      value={{
        theme:
          layoutType === LayoutType.Layer
            ? (theme && theme[type]) || currentLayoutTheme
            : null,
        width: layoutContext ? layoutContext.width : size.width,
      }}
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
function defaultSizeProcess(options: ISizeProcess) {
  const { layout, size } = options;
  const { w, h } = layout;
  const { width, height } = size;
  return {
    width: width || width === 0 ? width : w,
    height: height || h,
  };
}
const SizeWrapper = (props: ISizeWrapper) => {
  const size = React.useContext(SizeContext);
  const layoutContext = React.useContext(LayerContext);
  const { path, layout, children, parent } = props;
  const { type } = layout;
  // 获取组件
  const atoms = getRegist();
  const Atom = atoms[type];
  const sizeProcess = Atom.sizeProcess || defaultSizeProcess;
  const afterProcessSize = sizeProcess({
    layout: layout,
    path: path,
    theme: layoutContext && layoutContext.theme,
    parent,
    size,
  });
  return (
    <ContextProcess
      enable={true}
      Ctx={SizeContext}
      value={{ ...afterProcessSize, type } as any}
    >
      {children}
    </ContextProcess>
  );
};

export function AnyLayout(props: IAnyLayout) {
  const { layout, active, theme = defaultTheme, onActive } = props;
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
    return {
      interact: interact,
      active: getActivePath(),
      layer: layer,
    };
  }, [onActive, getActivePath()]);
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
