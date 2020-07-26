import React from 'react';
import { IAtom, LayoutType, IAtomRenderer } from 'dnd-layout-renderer';
export const ContainerType = 'containerPanel';
const Container: IAtom = {
  layoutType: LayoutType.ContainerPanel,
  atomType: ContainerType,
  renderer: (props: IAtomRenderer) => {
    return <div > {props.children}</div>;
  },
};
export default Container;
