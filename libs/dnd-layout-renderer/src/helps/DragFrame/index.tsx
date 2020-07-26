import React from 'react';
import { useLayoutDrop, ILayout, IDropConfig } from 'dnd-layout-renderer';
import { useLayoutDrag, IDragConfig } from '../../hooks';

export interface IDragFrame extends IDragConfig {
  style?: React.CSSProperties;
  children: React.ReactNode;
}
export default function DragFrame(props: IDragFrame) {
  const { style = {}, children } = props;
  const [collectDragProps, ref] = useLayoutDrag<HTMLDivElement>(props);
  return <div style={style}ref={ref}>{children}</div>;
}
