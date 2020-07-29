import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  ILayoutTheme,
  ThemeContext,
  SizeContext,
} from 'dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
export const AtomType = 'absoluteAtom';


const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  renderer: (props: IAtomRenderer) => {
    const { layout,  } = props;
    const size =React.useContext(SizeContext)
    const theme = React.useContext(ThemeContext);
    const { width, height } = size;
    console.log('width: ', width);
    return (
      <div
        className='absolute-atom'
        style={{
          background: 'white',
          position: 'relative',
          minHeight: layout.h,
          width: toReal(layout.w,width),
        }}
      >
        111
      </div>
    );
  },
};
export default Widget;
