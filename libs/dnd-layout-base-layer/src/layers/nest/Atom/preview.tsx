import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  ILayoutTheme,
  ThemeContext,
  ISizeContext,
  SizeContext,
  INestLayoutTheme,
} from 'dnd-layout-renderer';
import { defaultAtomRenderer } from '../../../utils/rendererHelp';
export const AtomType = 'nestAtom';

const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  sizeProcess: (config) => {
    const { layout, size, theme, parent } = config;
    const childCount = parent.children.length;
    const h = (theme.atom.gap * (childCount - 1)) / childCount;
    const { width } = size;
    return {
      width: width,
      height: layout.h - h,
    };
  },
  renderer: (props: IAtomRenderer) => {
    const {
      layout,
      children,
      atomFrameRenderer = defaultAtomRenderer,
    } = props;
    const { width, height } = React.useContext<ISizeContext>(SizeContext);
    const theme: INestLayoutTheme = React.useContext(ThemeContext) ;
    return (
      <div
        className='nest-atom'
        style={{
          marginTop: theme.atom.gap,
          position: 'relative',
          transition: 'all 200ms ease',
          minHeight: height,
          minWidth: width,
          ...theme.atom.style,
        }}
      >
        {atomFrameRenderer({ node: layout, width, height })}
        {children}
      </div>
    );
  },
};
export default Widget;
