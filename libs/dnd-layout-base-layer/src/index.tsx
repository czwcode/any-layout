import React from 'react';

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
} from 'dnd-layout-renderer';
import { LayerContext, defaultTheme, AnyLayoutTheme } from './context/theme';
import { ILayoutTheme } from './context/theme';
export interface IAnyLayout extends IRenderCore {
  theme?: ILayoutTheme;
}
function TravseRendererFrame(props: ITravseRendererFrame) {
  const { layoutType, layout, children, parent,  } = props;
  const { type, theme: currentLayoutTheme } = layout;
  const theme = React.useContext(AnyLayoutTheme);
  const layoutContext = React.useContext(LayerContext);
  const size = React.useContext(SizeContext);
  return (
    <ContextProcess
        enable={layoutType === LayoutType.Layer || layoutType === LayoutType.ContainerPanel}
        Ctx={LayerContext}
        value={{
          theme:
            layoutType === LayoutType.Layer
              ? (theme && theme[type]) || currentLayoutTheme
              : null,
          width: layoutContext ? layoutContext.width :size.width,
        }}
      >
        <SizeWrapper {...props}>{children}</SizeWrapper>
      </ContextProcess>
    // <ContextProcess Ctx={Layuercon} enable={layoutType === LayoutType.ContainerPanel}>
    //   {/* <LayerContext.Provider value={{
    //     theme: null,
    //     width: 
    //   }}></LayerContext.Provider> */}
      
    // </ContextProcess>
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

export default function AnyLayout(props: IAnyLayout) {
  const { theme = defaultTheme } = props;
  return (
    <AnyLayoutTheme.Provider value={theme}>
      <RenderCore {...props} TravseRendererFrame={TravseRendererFrame} />
    </AnyLayoutTheme.Provider>
  );
}

export { default as EditContainer } from './base/Container/edit';
export { default as PreviewContainer } from './base/Container/preview';
export { default as EditContainerPanel } from './base/ContainerPanel/edit';
export { default as PreviewContainerPanel } from './base/ContainerPanel/preview';
export { default as EditAtom } from './layers/nest/Atom/edit';
export { default as Row } from './layers/nest/Row';
export { default as Col } from './layers/nest/Col';
export { default as AbsoluteLayer } from './layers/absolute/Layer';
export { default as AbsoluteAtom } from './layers/absolute/Atom';
export { default as GridLayer } from './layers/grid/Layer';
export { default as GridAtom } from './layers/grid/Atom';
export { default as NestLayer } from './layers/nest/Layer';
