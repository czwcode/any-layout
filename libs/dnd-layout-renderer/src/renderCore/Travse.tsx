import React, { useContext } from 'react';
import { ILayout, LayoutType, INode } from "../types";
import { getRegist, ISizeProcess, IAtomRenderer, IInteractive } from "../register";
import { getMemoWrapper } from './MemoWrapper';
import ContextProcess from '../context/ContextProcess';
import { SizeContext } from '../context/sizeContext';
import { IDragLayerFrameRenderer } from '../helps/DragLayer';
import { getThemeContext } from '../context/theme';

export interface IAtomFrameRenderer<ITheme> {
  node: INode<ITheme>;
  width: number;
  height: number;
}


export interface IRenderCore<ITheme> {
  /**
   *  主题信息配置
   * @default { nest: {row: { gap: 10 },col: { gap: 10 },atom: { gap: 5 },},grid: {  gapX: 10,  gapY: 5,},}
   */
  theme?: ITheme;
  /**
   * 用来渲染的布局的值
   */
  layout: ILayout<ITheme>[];
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
  onLayoutChange: (layout: ILayout<ITheme>[]) => void;
  /**
   * 可以通过该方法对Atom展示的内容进行定制
   *
   * @memberof IRenderCore
   */
  atomFrameRenderer?: (props: IAtomFrameRenderer<ITheme>) => React.ReactNode;
  /**
   * 可以通过该方法，对拖拽时候展示的内容进行渲染
   *
   * @memberof IRenderCore
   */
  dragLayerFrameRenderer?: (props: IDragLayerFrameRenderer<ITheme>) => React.ReactNode;
  /**
   * 修改传递给组件的属性
   *
   * @memberof IRenderCore
   */
  generateProps?: (
    layout: ILayout<ITheme>,
    type: string,
    layoutType: LayoutType
  ) => any;
}
interface ITraverse<ITheme> extends IRenderCore<ITheme>{
  parent?: ILayout<ITheme>;
  path?: number[];
  getActivePath: () => void
  interactiveProps: IInteractive
  layerRef: React.MutableRefObject<HTMLDivElement>
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
export function Traverse<ITheme>(props: ITraverse<ITheme>) {
  const { layout, interactiveProps,getActivePath,layerRef, parent, path = [], atomFrameRenderer, generateProps, } = props;
  const size = useContext(SizeContext)
  const theme = useContext(getThemeContext<ITheme>())
  return (
    <>
      {layout.map((currentLayout, index) => {
        const { type } = currentLayout;
        // 获取组件
        const atoms = getRegist();
        const Atom = atoms[type];
        const layoutType = Atom.layoutType;
        const sizeProcess = Atom.sizeProcess || defaultSizeProcess;

        const currentPath = [...path, index];

        const newProps: IAtomRenderer<ITheme> = {
          layout: currentLayout,
          path: currentPath,
          atomFrameRenderer: atomFrameRenderer,
          activePath: getActivePath(),
          layer: layerRef.current,
          ...interactiveProps,
          ...generateProps(currentLayout, type, layoutType as any),
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
        const afterProcessSize = sizeProcess({
          layout: currentLayout,
          theme,
          parent,
          size,
        });
        const MemoWrapper = getMemoWrapper<ITheme>()
        return (
          <MemoWrapper key={newProps.layout.id} {...newProps}>
            <ContextProcess
              enable={layoutType === LayoutType.Layer}
              Ctx={getThemeContext<ITheme>()}
              value={
                layoutType === LayoutType.Layer
                  ? theme[type] || currentLayout.theme
                  : null
              }
            >
              <ContextProcess
                enable={layoutType === LayoutType.Layout}
                Ctx={SizeContext}
                value={afterProcessSize}
              >
                <Atom.renderer {...newProps}>{child}</Atom.renderer>
              </ContextProcess>
            </ContextProcess>
          </MemoWrapper>
        );
      })}
    </>
  );
}