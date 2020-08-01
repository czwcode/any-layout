import React, { useContext, useMemo } from 'react';
import { ILayout, INode } from '../types';
import { getRegist, IComponentRender } from '../register';
import { getMemoWrapper } from '../../../dnd-layout-base-layer/src/MemoWrapper';
import { TreeTravse, ITreeTravseRenderer } from './TreeTravser';
import {
  LayoutTravseContext,
  ITravseRendererFrame,
  ILayoutTravseContext,
} from '../context/LayoutTravseContext';

export interface IAtomFrameRenderer {
  node: INode;
  width: number;
  height: number;
}

interface ILayoutTravse extends ILayoutTravseContext {
  layout?: ILayout[];
}

export function LayoutTravse(props: ILayoutTravse) {
  const {
    layout,
    transformProps,
    TravseRendererFrame = DefaultTravseRendererFrame,
  } = props;
  // 可以防止transformProps和TravseRendererFrame没变化造成的重复渲染
  const layoutTravseContextValue = useMemo(() => {
    return {
      transformProps,
      TravseRendererFrame,
    };
  }, [transformProps, TravseRendererFrame]);
  return (
    <LayoutTravseContext.Provider value={layoutTravseContextValue}>
      <TreeTravse<ILayout>
        TreeTravseRenderer={LayoutTreeTravseRenderer}
        dataSource={layout}
      />
    </LayoutTravseContext.Provider>
  );
}

export function LayoutTreeTravseRenderer(props: ITreeTravseRenderer<ILayout>) {
  const { path, parent, node: currentLayout, children } = props;
  const { type } = currentLayout;
  // 获取注册的组件信息
  const atoms = getRegist();
  const { transformProps, TravseRendererFrame } = useContext(
    LayoutTravseContext
  );
  const Atom = atoms[type];
  const layoutType = Atom.layoutType;
  const newProps: IComponentRender = {
    layout: currentLayout,
    path: path,
    parent: parent,
    ...(transformProps &&
      transformProps(currentLayout, type, layoutType as any)),
  };

  return (
    <TravseRendererFrame {...newProps} layoutType={layoutType}>
      <Atom.renderer {...newProps}>{children}</Atom.renderer>
    </TravseRendererFrame>
  );
}
export function DefaultTravseRendererFrame(props: ITravseRendererFrame) {
  const { children } = props;
  return <>{children}</>;
}