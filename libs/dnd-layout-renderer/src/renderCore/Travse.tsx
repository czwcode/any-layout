import React, { useContext } from 'react';
import { ILayout, LayoutType, INode } from '../types';
import {
  getRegist,
  ISizeProcess,
  IAtomRenderer,
  IInteractive,
} from '../register';
import { getMemoWrapper } from './MemoWrapper';
import { IDragLayerFrameRenderer } from '../helps/DragLayer';

export interface IAtomFrameRenderer {
  node: INode;
  width: number;
  height: number;
}

export interface IRenderCore {
  /**
   *  主题信息配置
   * @default { nest: {row: { gap: 10 },col: { gap: 10 },atom: { gap: 5 },},grid: {  gapX: 10,  gapY: 5,},}
   */
  theme?: any;
  /**
   * 用来渲染的布局的值
   */
  layout: ILayout[];
  /**
   * 激活的SizePanel的路径
   */
  activePath?: number[];
  /**
   * 当用户激活SizePanel时的回调
   */
  onActivePathChange?: (path: number[]) => void;
  /**
   * 布局改变后的回调
   *
   * @memberof IRenderCore
   */
  onLayoutChange: (layout: ILayout[]) => void;
  /**
   * 可以通过该方法对Atom展示的内容进行定制
   *
   * @memberof IRenderCore
   */
  atomFrameRenderer?: (props: IAtomFrameRenderer) => React.ReactNode;
  /**
   * 遍历布局信息，递归渲染布局节点的包裹组件
   *
   * @memberof IRenderCore
   */
  TravseRendererFrame?: (props: ITravseRendererFrame) => JSX.Element;
  /**
   * 可以通过该方法，对拖拽时候展示的内容进行渲染
   *
   * @memberof IRenderCore
   */
  dragLayerFrameRenderer?: (props: IDragLayerFrameRenderer) => React.ReactNode;
  /**
   * 修改传递给组件的属性
   *
   * @memberof IRenderCore
   */
  generateProps?: (
    layout: ILayout,
    type: string,
    layoutType: LayoutType
  ) => any;
}
interface ITraverse extends IRenderCore {
  parent?: ILayout;
  path?: number[];
  getActivePath: () => void;
  interactiveProps: IInteractive;
  layerRef: React.MutableRefObject<HTMLDivElement>;
}

export function Traverse(props: ITraverse) {
  const {
    layout,
    interactiveProps,
    getActivePath,
    layerRef,
    parent,
    path = [],
    atomFrameRenderer,
    generateProps,
    TravseRendererFrame = DefaultTravseRendererFrame,
  } = props;
  
  return (
    <>
      {layout.map((currentLayout, index) => {
        const { type } = currentLayout;
        // 获取组件
        const atoms = getRegist();
        const Atom = atoms[type];
        const layoutType = Atom.layoutType;
        const currentPath = [...path, index];
        const newProps: IAtomRenderer = {
          layout: currentLayout,
          path: currentPath,
          atomFrameRenderer: atomFrameRenderer,
          activePath: getActivePath(),
          layer: layerRef.current,
          parent: parent,
          ...interactiveProps,
          ...(generateProps &&
            generateProps(currentLayout, type, layoutType as any)),
        };

        let child = null;
        if (layoutType !== LayoutType.Atom) {
          child = (
            <Traverse
              {...props}
              layout={currentLayout.children || []}
              parent={currentLayout}
              path={currentPath}
            />
          );
        }
       
        const MemoWrapper = getMemoWrapper();
        return (
          <MemoWrapper key={newProps.layout.id} {...newProps}>
            <TravseRendererFrame {...newProps} layoutType={layoutType} >
              <Atom.renderer {...newProps}>{child}</Atom.renderer>
            </TravseRendererFrame>
          </MemoWrapper>
        );
      })}
    </>
  );
}


export interface ITravseRendererFrame {
  children?: React.ReactNode;
  layout: ILayout
  parent?: ILayout
  path: number[]
  layoutType: LayoutType
}
function DefaultTravseRendererFrame(props: ITravseRendererFrame) {
  const { children } = props;
  return <>{children}</>;
}
