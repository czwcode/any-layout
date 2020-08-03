import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDirection } from 'dnd-layout-renderer';
const StyledDiv = styled.div`
  .drag-layout-bar {
    position: absolute;
    width: 40px;
    height: 20px;
    cursor: row-resize;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    pointer-events: auto;
    /* pointer-events: auto; */
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none;
  }
  .drag-layout-bar.bc.active {
    width: 100% !important;
    left: 0px !important;
    margin-left: 0px !important;
    z-index: 1000;
  }

  .drag-layout-bar.bc.active .drag-layout-bar-inner {
    width: 100% !important;
  }

  .drag-layout-bar.lc.active {
    height: 100% !important;
    top: 0px !important;
    margin-top: 0px !important;
  }

  .drag-layout-bar.lc.active .drag-layout-bar-inner {
    height: 100% !important;
  }

  .drag-layout-bar.rc.active {
    height: 100% !important;
    top: 0px !important;
    margin-top: 0px !important;
  }

  .drag-layout-bar.rc.active .drag-layout-bar-inner {
    height: 100% !important;
  }

  .drag-layout-bar.horizontal {
    transform: translate(-50%, -50%);
  }

  .drag-layout-bar.rc {
    width: 20px;
    height: 40px;
    top: 50%;
    right: -10px;
    margin-top: -20px;
    cursor: col-resize;
  }
  .drag-layout-bar.bc {
    bottom: -10px;
    left: 50%;
    margin-left: -20px;
  }
  .drag-layout-bar.lc {
    width: 20px;
    height: 40px;
    top: 50%;
    cursor: col-resize;
    margin-top: -20px;
    left: -10px;
  }

  .drag-layout-bar.rc .drag-layout-bar-inner,
  .drag-layout-bar.lc .drag-layout-bar-inner {
    width: 8px;
    height: 40px;
  }

  .drag-layout-bar.tc .drag-layout-bar-inner,
  .drag-layout-bar.bc .drag-layout-bar-inner {
    width: 40px;
    height: 6px;
  }
  &.simple {
    .drag-layout-bar.rc .drag-layout-bar-inner,
    .drag-layout-bar.lc .drag-layout-bar-inner {
      width: 6px;
      height: 16px;
      border-radius: 4px;
    }

    .drag-layout-bar.tc .drag-layout-bar-inner,
    .drag-layout-bar.bc .drag-layout-bar-inner {
      width: 8px;
      height: 8px;
    }
  }
  .drag-layout-bar-inner {
    margin: 0 auto;
    border-radius: 3px;
    background: #23a3ff;
    /* background-image: url(https://img.alicdn.com/tfs/TB1asuoxKL2gK0jSZFmXXc7iXXa-200-200.svg); */
    position: absolute;
  }
`;
export enum DIRECTION {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}
export enum POSITION {
  TC = 'tc',
  RC = 'rc',
  BC = 'bc',
  LC = 'lc',
}
export interface BarProps {
  prefix?: string;
  isActive?: boolean;
  offsetY?: number;
  offsetX?: number;
  simple?: boolean;
  onMouseDown: (dragDirection: DragDirection, ev: React.MouseEvent) => void;
  direction?: DIRECTION;
  position?: POSITION;
  dragDirection: DragDirection;
}
class Bar extends Component<BarProps> {
  target: HTMLDivElement | null = null;
  constructor(props: BarProps) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    prefix: 'drag-layout-bar',
    isActive: true,
    offsetY: 0,
    offsetX: 0,
    direction: DIRECTION.HORIZONTAL,
    position: POSITION.BC,
  };

  onMouseDown = (ev: React.MouseEvent) => {
    const { onMouseDown, dragDirection } = this.props;
    ev.preventDefault();
    ev.stopPropagation();
    onMouseDown && onMouseDown(dragDirection, ev);
  };

  render() {
    const { simple, prefix, offsetX, offsetY, isActive, position } = this.props;
    let style = { zIndex: 10} as React.CSSProperties;
    if (isActive) {
      style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    return (
      <StyledDiv className={simple ? 'simple' : ''}>
        <div
          ref={(ref) => {
            this.target = ref;
          }}
          className={`${prefix} ${position}  ${isActive ? 'active' : ''}`}
          style={style}
          onMouseDown={this.onMouseDown}
        >
          <div className={`${prefix}-inner`}></div>
        </div>
      </StyledDiv>
    );
  }
}

export default Bar;
