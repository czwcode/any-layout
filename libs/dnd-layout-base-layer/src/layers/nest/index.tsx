import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
} from '@czwcode/dnd-layout-renderer';
export const RowType = 'containerPanel';
const Row: IComponent = {
  layoutType: LayoutType.Layout,
  atomType: RowType,
  renderer: (props: IComponentRender) => {
    return (
      <div style={{ display: 'flex', position: 'relative' }}>
        {props.children}
      </div>
    );
  },
};
export default Row;
