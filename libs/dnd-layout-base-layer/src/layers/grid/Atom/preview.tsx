import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
  SizeContext,
} from 'dnd-layout-renderer';
import { defaultAtomRenderer } from '../../../utils/rendererHelp';
import {
  IGridLayoutTheme,
  useLayerContext,
} from '../../../context/layerContext';
import { getBoundingRect } from '../Layer/calcUtils';
export const AtomType = 'gridAtom';

const Widget: IComponent = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  renderer: (props: IComponentRender) => {
    const { layout, atomFrameRenderer = defaultAtomRenderer } = props;
    const { theme } = useLayerContext<IGridLayoutTheme>();
    const size = React.useContext(SizeContext);
    const { width, height } = getBoundingRect(theme, size.width, layout);
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
