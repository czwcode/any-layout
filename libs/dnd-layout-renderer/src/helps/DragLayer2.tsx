import React, { PureComponent } from 'react';
import { DragLayer, XYCoord, DragLayerMonitor } from 'react-dnd';
import { CSSProperties } from 'react';
import { ILayout, LayerType, INode } from '../types';
import BoxDragPreview from './BoxDragPreview';
import { DragInfo } from '../hooks/useDrag';
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
} as CSSProperties;

function getItemStyles(props: ItemStyleProps) {
  const { initialOffset, clientOffset } = props;
  if (!initialOffset || !clientOffset) {
    return null;
  }
  let { moveX: x, moveY: y } = clientOffset;
  x -= initialOffset.moveX;
  y -= initialOffset.moveY;
  x += initialOffset.moveX;
  y += initialOffset.moveY;

  const transform = `translate(${x}px, ${y}px)`;
  return transform;
}

export interface ItemStyleProps {
  initialOffset: XYCoord;
  currentOffset: XYCoord;
  clientOffset: XYCoord;
}

export interface IDragLayerFrameRenderer {
  node: INode;
  layerType: LayerType;
  type: string;
}
export interface CustomDragLayerProps {
  layerRef: HTMLDivElement | null;
  dragLayerFrameRenderer?: (props: IDragLayerFrameRenderer) => React.ReactNode;
  isDragging: boolean;
  item: DragInfo;
}
let dragPreviewRef: HTMLDivElement = null;
let subscribedToOffsetChange = false;
class CustomDragLayer extends PureComponent<CustomDragLayerProps> {
  render() {
    const {
      isDragging,
      item,
      dragLayerFrameRenderer = () => {
        return (
          <div
            style={{ height: 40, width: 80, background: 'lightgreen' }}
          ></div>
        );
      },
    } = this.props;
    if (!isDragging) {
      dragPreviewRef = null;
      return <div></div>;
    }
    return (
      <div style={layerStyles} ref={(d) => (dragPreviewRef = d)}>
        {dragLayerFrameRenderer &&
          dragLayerFrameRenderer({
            node: item.data,
            type: item.type,
            layerType: item.layerType,
          })}
      </div>
    );
  }
}
const onOffsetChange = (monitor: DragLayerMonitor) => () => {
  if (!dragPreviewRef) return;

  const transform = getItemStyles({
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
  });
  if (!transform) return;

  dragPreviewRef.style['transform'] = transform;
  dragPreviewRef.style['-webkit-transform' as any] = transform;
};

export default DragLayer((monitor) => {
  if (!subscribedToOffsetChange) {
    (monitor as any).subscribeToOffsetChange(onOffsetChange(monitor));
    subscribedToOffsetChange = true;
  }
  return {
    item: monitor.getItem() as DragInfo,
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
  };
})(CustomDragLayer);
