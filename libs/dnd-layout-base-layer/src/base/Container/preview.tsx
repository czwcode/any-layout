import React from 'react';
import { IAtom, LayoutType, IAtomRenderer } from 'dnd-layout-renderer';
export const ContainerType = 'container';
const Container: IAtom = {
  layoutType: LayoutType.Container,
  atomType: ContainerType,
  renderer: (props: IAtomRenderer) => {
    return <div> {props.children} </div>;
  },
};
export default Container;
