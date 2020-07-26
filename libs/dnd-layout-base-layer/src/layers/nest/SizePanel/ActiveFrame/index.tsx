import React, { useRef } from 'react';
import DragPaneWrapper, { DragPaneWrapperProps } from '../DragWrapper';
import { encodePath } from 'dnd-layout-renderer';
type IActiveFrame = DragPaneWrapperProps &  {
  onActive: () => void;
  activePath: number[]
  ActiveOperateComponent: () => React.ReactNode;
};
const ActiveFrame = (props: IActiveFrame) => {
  let {
    onSizeChange,
    path,
    layer,
    onActive,
    activePath,
    ActiveOperateComponent,
  } = props;
  const isActive = encodePath(path) === encodePath(activePath)
  const frame = React.useRef<HTMLDivElement>(null);
  // const copyFunc = () => {
  //   return layoutCore.updateLayoutWhenDrop(DragDirection.BOTTOM, path, layout, true)
  // }
  // const deleteFunc = () => {
  //   return layoutCore.updateLayoutWhenDrag(path, true)
  // }
  return (
    <div
      onClick={(e) => {
        onActive && onActive();
      }}
      className='active-frame'
      ref={frame}
      style={{
        top: 0,
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
    >
      {isActive && ActiveOperateComponent && ActiveOperateComponent()}
      {isActive && frame.current && (
        <DragPaneWrapper
          layer={layer}
          onSizeChange={onSizeChange}
          path={path}
          widgetLayer={frame.current}
        />
      )}
    </div>
  );
};

export default ActiveFrame;
