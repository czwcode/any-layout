import React, { useRef } from 'react';
import DragPaneWrapper, { DragPaneWrapperProps } from '../DragWrapper';
import { encodePath } from 'dnd-layout-renderer';
type IActiveFrame = DragPaneWrapperProps & {
  onActive: () => void;
  active: boolean;
  ActiveOperateComponent: () => React.ReactNode;
};
const ActiveFrame = (props: IActiveFrame) => {
  let {
    onSizeChange,
    onSizeChanging,
    onStartSizeChange,
    path,
    layer,
    onActive,
    active,
    ActiveOperateComponent,
  } = props;

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
      {active && ActiveOperateComponent && ActiveOperateComponent()}
      {active && frame.current && (
        <DragPaneWrapper
          {...props}
          layer={layer}
          widgetLayer={frame.current}
        />
      )}
    </div>
  );
};

export default ActiveFrame;
