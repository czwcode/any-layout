import React from 'react';
import { getEmptyImage} from 'react-dnd-html5-backend'
import { useLayoutDrag, IDragConfig } from '../../hooks';
import { INode } from '../../types';

export interface IDragFrame extends IDragConfig {
  style?: React.CSSProperties;
  children: React.ReactNode;
  getData?: () => INode
}
export default function DragFrame(props: IDragFrame) {
  const { style = {}, children, getData } = props;
  const [collectDragProps, ref, _, preview] = useLayoutDrag<HTMLDivElement>({...props, data: getData()});
  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return <div style={style}ref={ref}>{children}</div>;
}
