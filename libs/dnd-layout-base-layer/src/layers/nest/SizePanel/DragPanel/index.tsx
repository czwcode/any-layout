import React, { Component } from 'react'
import clazz from 'classnames'
import Bar, { DIRECTION, POSITION } from '../Bar'
import styled from 'styled-components'
import { DragDirection } from 'dnd-layout-renderer'

const StyledDiv = styled.div`
  &.drag-panel.active {
    pointer-events: none;
    top: 0px;
    position: absolute;
    box-sizing: border-box;
    border: 2px dashed #23a3ff;
  }
`
export interface DragPanelProps {
  isFirst: boolean
  isLast: boolean
  activeDragBarDirection: DragDirection
  width: number
  height: number | string
  left: number
  top: number
  offsetY: number
  offsetX: number
  withRef: any
  startResize: (dragDirection: DragDirection, ev: React.MouseEvent) => void
}

export function DragPanel(props: DragPanelProps) {
  let placehoderClass = clazz({
    'drag-panel': true,
    active: true,
  })
  const {
    withRef,
    isFirst,
    isLast,
    activeDragBarDirection: dragDirection,
    width,
    height,
    left,
    top,
    offsetY,
    offsetX,
    startResize,
  } = props
  let bars = [
    <Bar
      isActive={dragDirection === DragDirection.BOTTOM}
      simple={width < 40}
      key={DragDirection.BOTTOM}
      dragDirection={DragDirection.BOTTOM}
      offsetY={offsetY}
      onMouseDown={startResize}
    />,
  ]
  if (!isFirst) {
    bars.push(
      <Bar
        isActive={dragDirection === DragDirection.LEFT}
        key={DragDirection.LEFT}
        dragDirection={DragDirection.LEFT}
        offsetX={offsetX}
        simple={height < 40}
        onMouseDown={startResize}
        direction={DIRECTION.VERTICAL}
        position={POSITION.LC}
      />,
    )
  }
  if (!isLast) {
    bars.push(
      <Bar
        isActive={dragDirection === DragDirection.RIGHT}
        key={DragDirection.RIGHT}
        dragDirection={DragDirection.RIGHT}
        offsetX={offsetX}
        simple={height < 40}
        onMouseDown={startResize}
        direction={DIRECTION.VERTICAL}
        position={POSITION.RC}
      />,
    )
  }

  return (
    <StyledDiv
      ref={withRef}
      style={{ left, top, width: '100%', height: '100%', zIndex: 100, position: 'absolute' }}
      className={placehoderClass}
    >
      {bars}
    </StyledDiv>
  )
}

export default DragPanel
