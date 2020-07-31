import { ISizeOptions, INode } from 'dnd-layout-renderer';
import { ILayerContext, IAnyLayoutTheme } from '../context/layerContext';

export interface IAnySizeOptions<ITheme> extends ISizeOptions {
  layerContext: ILayerContext<ITheme>;
  /**
   * 拖拽开始时候的节点
   */
  originNode?: INode;
}
