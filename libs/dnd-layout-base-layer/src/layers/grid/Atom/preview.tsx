import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  SizeContext,
} from 'dnd-layout-renderer';
import { defaultAtomRenderer } from '../../../utils/rendererHelp';
import { IGridLayoutTheme, useLayerContext } from '../../../context/theme';
import { getBoundingRect } from '../Layer/calcUtils';
export const AtomType = 'gridAtom';

const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  renderer: (props: IAtomRenderer) => {
    const { layout, atomFrameRenderer = defaultAtomRenderer } = props;
    const { theme }  = useLayerContext<IGridLayoutTheme>();
    const size= React.useContext(SizeContext);
    const { width, height } = getBoundingRect(theme, size, layout);
    return (
      <div
        className='absolute-atom'
        style={{
          marginTop: theme.gapY,
          position: 'relative',
          background: 'white',
          height: height,
          width: width,
        }}
      >
        {atomFrameRenderer({ width, height, node: layout })}
        {props.children}
      </div>
    );
  },
};
export default Widget;
