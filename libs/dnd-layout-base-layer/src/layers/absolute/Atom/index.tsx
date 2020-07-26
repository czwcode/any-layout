import React from 'react';
import PreviewAtom from './preview';
import { IAtomRenderer, useLayoutDrag, LayoutType, LayerType } from 'dnd-layout-renderer';
import ActiveFrame from '../../nest/SizePanel/ActiveFrame';
import { toReal } from '../../../utils/calcWidth';

const EditContainer = {
  ...PreviewAtom,
  renderer: (props: IAtomRenderer) => {
    const {
      layout,
      activePath,
      onActive,
      layer,
      onSizeChange,
      hidden,
      onDrag,
      onDragEnd,
      path,
      size,
    } = props;
    const { x, y, w, h } = layout;
    const Renderer = PreviewAtom.renderer;
    // @ts-ignore
    const [collectDragProps,ref] = useLayoutDrag<HTMLDivElement>({
      onDrag,
      layerType: LayerType.Absolute,
      data: JSON.parse(JSON.stringify(layout)),
      onDragEnd,
      path,
    });
    return (
      <div
        style={{
          left: x,
          top: y,
          transition: 'all 200ms ease',
          width: toReal(layout.w, size.width),
          height: h,
          position: 'absolute',
        }}
      >
        <div
          ref={ref}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              boxSizing: 'border-box',
              top: 0,
              border: '1px dashed lightgrey',
            }}
          ></div>

          <Renderer {...props} />
          <ActiveFrame
            onActive={() => {
              onActive(path);
            }}
            ActiveOperateComponent={() => {
              return <div></div>;
            }}
            activePath={activePath}
            onSizeChange={(direction, size) => {
              onSizeChange(path, direction, size);
            }}
            layer={layer}
            path={path}
          />
        </div>
      </div>
    );
  },
};
export default EditContainer;
