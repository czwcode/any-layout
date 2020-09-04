import React, { useRef } from 'react';
import DragPaneWrapper, {
  DragPaneWrapperProps,
  useForceUpdate,
} from '../DragWrapper';
import { encodePath } from '@czwcode/dnd-layout-renderer';
type IActiveFrame = DragPaneWrapperProps & {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  onActive: () => void;
  active: boolean;
  children?: React.ReactNode;
  ActiveOperateComponent: () => React.ReactNode;
};
const ActiveFrame = (props: IActiveFrame) => {
  let {
    left,
    top,
    layer,
    onActive,
    active,
    width,
    height,
    children,
    ActiveOperateComponent,
  } = props;

  const frame = React.useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();
  React.useEffect(() => {
    forceUpdate();
  }, []);
  // const copyFunc = () => {
  //   return layoutCore.updateLayoutWhenDrop(DragDirection.BOTTOM, path, layout, true)
  // }
  // const deleteFunc = () => {
  //   return layoutCore.updateLayoutWhenDrag(path, true)
  // }
  return (
    <div
      onClick={(e) => {
        console.log('onActive: ', onActive);
        onActive && onActive();
      }}
      className='active-frame'
      ref={frame}
      style={{
        top: top || 0,
        left: left || 0,
        width: width || '100%',
        height: height || '100%',
        position: 'absolute',
      }}
    >
      {active && ActiveOperateComponent && ActiveOperateComponent()}
      {active && frame.current && (
        <DragPaneWrapper {...props} layer={layer} widgetLayer={frame.current} />
      )}
      {children}
    </div>
  );
};

export default ActiveFrame;
