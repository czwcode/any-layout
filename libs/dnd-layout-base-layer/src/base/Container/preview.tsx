import React from 'react';
import { IComponent, LayoutType, IComponentRender } from 'dnd-layout-renderer';
export const ContainerType = 'container';
const Container: IComponent = {
  layoutType: LayoutType.Container,
  atomType: ContainerType,
  renderer: (props: IComponentRender) => {
    return <div> {props.children} </div>;
  },
};
export default Container;
