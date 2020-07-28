import React from 'react';
import styled from 'styled-components';
import { HoverDirection } from '../calcHover';


const StyledDiv = styled.div`
  .drag-column.left {
    background: linear-gradient(90deg, #ffc0cb 50%, #ffffff 50%);
  }

  .drag-column.right {
    background: linear-gradient(270deg, #ffc0cb 50%, #ffffff 50%);
  }
  .drag-column.bottomOut {
    background: linear-gradient(360deg, #ffc0cb 25%, #ffffff 25%);
  }
  .drag-column.bottom {
    background: linear-gradient(360deg, #ffc0cb 50%, #ffffff 50%);
  }
  .drag-column.topOut {
    background: linear-gradient(180deg, #ffc0cb 25%, #ffffff 25%);
  }
  .drag-column.top {
    background: linear-gradient(180deg, #ffc0cb 50%, #ffffff 50%);
  }

  .drag-column {
    height: 100%;
    width: 100%;
    /* background: red; */
    z-index: 20;
    pointer-events: none;
    position: absolute;
    opacity: 0.3;
  }
`;

export default (props: { direction: HoverDirection}) => {
  return (
    <StyledDiv>
        <div className={`drag-column ${props.direction}`}></div>
    </StyledDiv>
  )
};