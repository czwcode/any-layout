import React from 'react';
import PreviewContiner from './preview';
import {
  IAtomRenderer, Action, DropOptions, INode, HoverOptions, SizeOptions,
} from 'dnd-layout-renderer';
import { PlaceHolder } from 'dnd-layout-renderer';
import { getRowNode } from '../../layers/nest/Row';

class ContainerPanelAction extends Action {
  onDrag(): void {
    throw new Error("Method not implemented.");
  }
  onRemove(): INode {
    throw new Error("Method not implemented.");
  }
  onMove(dragPath: number[], dropPath: number[], options: HoverOptions): void {
    throw new Error("Method not implemented.");
  }
  onSizeChange(options: SizeOptions): void {
    throw new Error("Method not implemented.");
  }
  onDrop(dragPath: number[], dropPath: number[], options: DropOptions): void {
    const currentNode = this.getNode()
    currentNode.children.push(getRowNode(options.data))
  }
}
const EditContainer = {
  ...PreviewContiner,
  action: ContainerPanelAction,
  renderer: (props: IAtomRenderer) => {
    const Renderer = PreviewContiner.renderer;
    const { path, layout, onDrop } = props;
    
    return (
      <div>
        <Renderer {...props} />
        <PlaceHolder style={{ height: 200}} onDrop={onDrop} path={path} layout={layout}/>
      </div>
    );
  },
};
export default EditContainer;
