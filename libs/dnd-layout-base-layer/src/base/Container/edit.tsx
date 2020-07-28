import React from 'react';
import PreviewContiner from './preview';
import { IAtomRenderer } from 'dnd-layout-renderer';

const EditContainer = {
  ...PreviewContiner,
  renderer: (props: IAtomRenderer) => {
    const Renderer = PreviewContiner.renderer;
    return (
      <div style={{  boxSizing: 'border-box'}}>
        <Renderer {...props} />
      </div>
    );
  },
};
export default EditContainer;
