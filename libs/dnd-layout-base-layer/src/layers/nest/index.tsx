import React from 'react';
import { IAtom, LayoutType, IAtomRenderer } from 'dnd-layout-renderer';
export const RowType = 'containerPanel';
const Row: IAtom = {
  layoutType: LayoutType.Layout,
  atomType: RowType,
  renderer: (props: IAtomRenderer) => {
    return (
      <div style={{ display: 'flex', position: 'relative' }}>
        {props.children}
      </div>
    );
  },
};
export default Row;
