import React from 'react';
import PreviewContiner from './preview';
import { IComponentRender } from '@czwcode/dnd-layout-renderer';

const EditContainer = {
  ...PreviewContiner,
  renderer: (props: IComponentRender) => {
    const Renderer = PreviewContiner.renderer;
    return (
      <div>
        <Renderer {...props} />
      </div>
    );
  },
};
export default EditContainer;
