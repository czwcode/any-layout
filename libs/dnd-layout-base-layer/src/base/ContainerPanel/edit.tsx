import React from 'react';
import PreviewContiner from './preview';
import {
  IAtomRenderer, Action, DropOptions,
} from 'dnd-layout-renderer';
import { PlaceHolder } from 'dnd-layout-renderer';
import { getRowNode } from '../../layers/nest/Row';

class ContainerPanelAction extends Action {
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
