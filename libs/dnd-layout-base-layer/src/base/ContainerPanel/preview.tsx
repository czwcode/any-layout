import React from 'react';
import {
  IComponent,
  LayoutType,
  IComponentRender,
} from '@czwcode/dnd-layout-renderer';
export const ContainerType = 'containerPanel';
const Container: IComponent<any> = {
  layoutType: LayoutType.ContainerPanel,
  atomType: ContainerType,
  renderer: (props: IComponentRender) => {
    return <div> {props.children}</div>;
  },
};
export default Container;
