import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  ISizeContext,
  SizeContext,
} from 'dnd-layout-renderer';
import { defaultAtomRenderer } from '../../../utils/rendererHelp';
import { INestLayoutTheme, LayerContext, useLayerContext } from '../../../context/theme';
export const AtomType = 'nestAtom';

const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  sizeProcess: (config) => {
    const { layout, path, size, theme, parent } = config;
    const lastPath = path[path.length - 1];
    const { width } = size;
    return {
      width: width,
      height: layout.h - (lastPath === 0 ? 0 : theme.atom.gap),
    };
  },
  renderer: (props: IAtomRenderer) => {
    const {
      layout,
      children,
      path,
      atomFrameRenderer = defaultAtomRenderer,
    } = props;
    const lastPath = path[path.length - 1];
    const size = React.useContext<ISizeContext>(SizeContext);
    const { width, height } = size;
    const { theme } = useLayerContext<INestLayoutTheme>();
    return (
      <div
        className='nest-atom'
        style={{
          marginTop: lastPath === 0 ? 0 : theme.atom.gap,
          position: 'relative',
          transition: 'all 200ms ease',
          minHeight: height,
          minWidth: width,
          ...theme.atom.style,
        }}
      >
        {atomFrameRenderer({ node: layout, width, height: height })}
        {children}
      </div>
    );
  },
};
export default Widget;
