import React from 'react';
import { useLayoutDrop, ILayout, IDropConfig } from 'dnd-layout-renderer';

export interface IPlaceHolder extends IDropConfig {
  layout: ILayout;
  style?: React.CSSProperties;
}
export default function PlaceHolder(props: IPlaceHolder) {
  const { style = {} } = props;
  // @ts-ignore
  const [collectDropProps, ref] = useLayoutDrop<HTMLDivElement>(props);
  return (
    <div
      ref={ref}
      style={{
        background: collectDropProps.isOver ? 'pink' : undefined,
        ...style,
      }}
    ></div>
  );
}
