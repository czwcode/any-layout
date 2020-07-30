import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  SizeContext,
  PlaceHolder,
  Action,
  DragDirection,
  DropOptions,
  INode,
  SizeOptions,
} from 'dnd-layout-renderer';
import { NestLayoutType } from '../../../types/componentTypes';
import { getRowNode } from '../Row';
import { IAnySizeOptions } from '../../../types/layout';
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
  onSizeChange(path: number[], options: IAnySizeOptions): void {
    throw new Error('Method not implemented.');
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void {
    const currentNode = this.getNode();
    currentNode.children.push(getRowNode(options.data));
  }
}
const Row: IAtom = {
  layoutType: LayoutType.Layer,
  action: LayerAction,
  atomType: NestLayoutType.Layer,
  renderer: (props: IAtomRenderer) => {
    const { layout, path, onDrop } = props;
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
          onDrop={onDrop}
          path={path}
          layout={layout}
        />
      </div>
    );
  },
};
export default Row;
