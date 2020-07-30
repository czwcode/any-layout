import React from 'react';
import PreviewContiner from './preview';
import {
  IAtomRenderer
} from 'dnd-layout-renderer';

const EditContainer = {
  ...PreviewContiner,
  renderer: (props: IAtomRenderer) => {
    const Renderer = PreviewContiner.renderer;
    const { path, layout, onDrop } = props;
    
    return (
      <div>
        <Renderer {...props} />
      </div>
    );
  },
};
export default EditContainer;
