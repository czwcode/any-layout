import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
  SizeContext,
} from '@czwcode/dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
export const AtomType = 'absoluteAtom';

const Widget: IComponent<any> = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  renderer: (props: IComponentRender) => {
    const { layout } = props;
    const size = React.useContext(SizeContext);
    const { width, height } = size;
    return (
      <div
        className='absolute-atom'
        style={{
          background: 'white',
          position: 'relative',
          minHeight: layout.h,
          width: toReal(layout.w, width),
        }}
      >
        111
      </div>
    );
  },
};
export default Widget;
