import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  ILayoutTheme,
  ThemeContext,
} from 'dnd-layout-renderer';
export const AtomType = 'nestAtom';


const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType, 
  sizeProcess: (config) => {
    const { layout, size, theme, parent } = config;
    const childCount = parent.children.length
    const h = theme.nest.atom.gap * (childCount - 1) / childCount
    const { width } = size;
    return {
      width: width,
      height: layout.h - h,
    };
  },
  renderer: (props: IAtomRenderer) => {
    const { layout, size, atomFrameRenderer } = props;
    const { width, height } = size;
    const theme = React.useContext<ILayoutTheme>(ThemeContext);
    return (
      <div
        className='nest-atom'
        style={{
          marginTop: theme.nest.atom.gap,
          position: 'relative',
          transition: 'all 200ms ease',
          minHeight: height,
          minWidth: width,
        }}
      >
        {
          atomFrameRenderer && atomFrameRenderer({ node: layout, width, height})  
        }
      </div>
    );
  },
};
export default Widget;
