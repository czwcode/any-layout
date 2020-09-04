import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
  ISizeContext,
  SizeContext,
} from '@czwcode/dnd-layout-renderer';
import {
  INestLayoutTheme,
  useLayerContext,
} from '../../../context/layerContext';
import { useGlobalContext } from '../../../context/GlobalContext';
export const AtomType = 'nestAtom';

const Widget: IComponent<INestLayoutTheme> = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  sizeProcess: (config) => {
    const { layout, path, size, theme } = config;
    const lastPath = path[path.length - 1];
    const { width } = size;
    return {
      width: width,
      height:
        layout.h * theme.rowHeight - (lastPath === 0 ? 0 : theme.atom.gap),
    };
  },
  renderer: (props: IComponentRender) => {
    const { layout, children, path, parent } = props;
    const lastPath = path[path.length - 1];
    const size = React.useContext<ISizeContext>(SizeContext);
    const { width, height } = size;
    const { AtomRenderer } = useGlobalContext();
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
        <AtomRenderer parent={parent} node={layout} width={width} height={height} />
        {children}
      </div>
    );
  },
};
export default Widget;
