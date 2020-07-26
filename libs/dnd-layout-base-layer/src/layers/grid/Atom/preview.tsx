import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  Action,
  HoverDirection,
  SizeOptions,
  DragDirection,
  ILayoutTheme,
  ThemeContext,
  BaseAction,
} from 'dnd-layout-renderer';
import { toReal } from '../../../utils/calcWidth';
export const AtomType = 'gridAtom';


const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  renderer: (props: IAtomRenderer) => {
    const { layout, size } = props;
    const { width, height } = size;

    const theme = React.useContext<ILayoutTheme>(ThemeContext);
    return (
      <div
        className='absolute-atom'
        style={{
          marginTop: theme.nest.atom.gap,
          position: 'relative',
          minHeight: layout.h,
          background: 'white',
          width: toReal(layout.w, width),
        }}
      >
        {props.children} 
      </div>
    );
  },
};
export default Widget;
