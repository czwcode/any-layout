import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  ILayoutTheme,
  ThemeContext,
} from 'dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
export const AtomType = 'absoluteAtom';


const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  renderer: (props: IAtomRenderer) => {
    const { layout, size } = props;
    const { width, height } = size;
    console.log('width: ', width);
    const theme = React.useContext<ILayoutTheme>(ThemeContext);
    return (
      <div
        className='absolute-atom'
        style={{
          background: 'white',
          marginTop: theme.nest.atom.gap,
          position: 'relative',
          minHeight: layout.h,
          width: toReal(layout.w,width),
        }}
      >
        {props.children} atom
      </div>
    );
  },
};
export default Widget;
