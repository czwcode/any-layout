import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
  PlaceHolder,
  Action,
  DropOptions,
  INode,
} from '@czwcode/dnd-layout-renderer';
import { NestLayoutType } from '../../../types/componentTypes';
import { getRowNode } from '../Row';
import { IAnySizeOptions } from '../../../types/layout';
import {
  INestLayoutTheme,
  useLayerContext,
} from '../../../context/layerContext';
import { useGlobalContext } from '../../../context/GlobalContext';
export const AbsoluteLayerType = 'absoluteLayer';

class LayerAction extends Action {
  onDrag(): void {
    throw new Error('Method not implemented.');
  }
  onRemove(): INode {
    throw new Error('Method not implemented.');
  }
  onMove(dragPath: number[], dropPath: number[], options: DropOptions): void {
    throw new Error('Method not implemented.');
  }
  onSizeChange(
    path: number[],
    options: IAnySizeOptions<INestLayoutTheme>
  ): void {
    throw new Error('Method not implemented.');
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void {
    const currentNode = this.getNode();
    currentNode.children.push(getRowNode(options.data));
  }
}
const Row: IComponent<INestLayoutTheme> = {
  layoutType: LayoutType.Layer,
  action: LayerAction,
  atomType: NestLayoutType.Layer,
  renderer: (props: IComponentRender) => {
    const { interact } = useGlobalContext<INestLayoutTheme>();
    const layerContext = useLayerContext<INestLayoutTheme>();
    const { onDrop } = interact;
    const { layout, path } = props;
    return (
      <div
        className='nest-layer'
        style={{
          position: 'relative',
        }}
      >
        {props.children}
        <PlaceHolder
          style={{ height: 200 }}
          onDrop={(dragPath, dropPath, options) => {
            onDrop(dragPath, dropPath, { ...options, layerContext });
          }}
          path={path}
          layout={layout}
        />
      </div>
    );
  },
};
export default Row;
