import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
  SizeContext,
} from '@czwcode/dnd-layout-renderer';
import {
  IGridLayoutTheme,
  useLayerContext,
} from '../../../context/layerContext';
import { getBoundingRect } from '../Layer/calcUtils';
import { useGlobalContext } from '../../../context/GlobalContext';
import { usePrevious } from '../Layer';
export const AtomType = 'gridAtom';

const Widget: IComponent<IGridLayoutTheme> = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  renderer: (props: IComponentRender) => {
    const { layout } = props;
    const layerContext = useLayerContext<IGridLayoutTheme>();
    const { theme } = layerContext;
    const globalContext = useGlobalContext();
    const { AtomRenderer } = globalContext;
    const size = React.useContext(SizeContext);
    const { width, height, left, top } = getBoundingRect(
      theme,
      size.width,
      layout
    );
    const style: React.CSSProperties = React.useMemo(() => {
      return {
        // transform: `translate(${left}px, ${top}px)`,
        width: width,
        height: height,
        position: 'absolute',
        top: top,
        left: left,
        border: '1px dashed lightgrey',
      };
    }, [width, height, left, top]);
    return (
      <div
        className='absolute-atom'
        style={{
          marginTop: theme.gapY,
          position: 'relative',
          background: 'white',
          transition: 'all 200ms ease',
          ...style
        }}
      >
        <AtomRenderer node={layout} width={width} height={height} />
        {props.children}
      </div>
    );
  },
};
export default Widget;
