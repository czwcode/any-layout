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
export const AtomType = 'absoluteAtom';

class AtomAction extends Action {
  onDrag() {
    this.removeSelf();
  }
  onMove(dragPath, dropPath, options) {
    const parentAction = this.getParentAction();
    parentAction.onMove(dragPath, dropPath, options);
  }
  onSizeChange(options: SizeOptions) {
    const { direction, size } = options;

    const node = this.getNode();
    switch (direction) {
      case DragDirection.BOTTOM:
        node.h = size + node.h;
        break;
      case DragDirection.LEFT:
        node.w = size + node.w;
        break;
      case DragDirection.RIGHT:
        node.w = size + node.w;
        break;

      default:
        break;
    }
  }
}
const Widget: IAtom = {
  layoutType: LayoutType.Atom,
  atomType: AtomType,
  action: AtomAction,
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
