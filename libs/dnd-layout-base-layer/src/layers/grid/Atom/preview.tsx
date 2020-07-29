import React from 'react';
import {
  IAtom,
  LayoutType,
  IAtomRenderer,
  ILayoutTheme,
  ThemeContext,
  ISize,
  INode,
  IGridLayoutTheme,
  INestLayoutTheme,
  SizeContext,
} from 'dnd-layout-renderer';
import { calcGridItemPosition } from '../../../utils/calcWidth';
import { defaultAtomRenderer } from '../../../utils/rendererHelp';
export const AtomType = 'gridAtom';

const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  renderer: (props: IAtomRenderer) => {
    const { layout, atomFrameRenderer = defaultAtomRenderer } = props;
    const theme: IGridLayoutTheme = React.useContext(ThemeContext);
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

export function getPositionParams(theme: IGridLayoutTheme, width: number) {
  const { gapX, gapY, rowHeight } = theme;
  return {
    containerPadding: [0, 0] as [number, number],
    margin: [gapX, gapY] as [number, number],
    rowHeight: rowHeight,
    containerWidth: width,
  };
}
export function getBoundingRect(theme: IGridLayoutTheme, size: ISize, node: INode) {
  const { x, y, w, h } = node;
  return calcGridItemPosition(getPositionParams(theme, size.width), x, y, w, h);
}
