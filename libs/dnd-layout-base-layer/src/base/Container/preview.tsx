import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
} from '@czwcode/dnd-layout-renderer';
export const ContainerType = 'container';
const Container: IComponent<any> = {
  layoutType: LayoutType.Container,
  atomType: ContainerType,
  renderer: (props: IComponentRender) => {
    return <div> {props.children} </div>;
  },
};
export default Container;
