import * as React from 'react';
import { AlgType } from "../alg"
import { transform } from '@babel/core';
// 布局生成算法

const testlayoutJson = [
  {
    w: 4,
    h: 12,
    x: 8,
    y: 0,
    id: 'A'
  },
  {
    w: 8,
    h: 12,
    x: 0,
    y: 0,
    id: 'B'
  }
]
export interface IGridNode {
  id: string;
  w: number;
  h: number;
  x: number;
  y: number;
}

const GridRenderer = (props: { nodes: IGridNode[], nodeRender: (id: string) => React.ReactNode}) => {
  const { nodes, nodeRender} = props
  return <div>
    {
      nodes.map(node => <GridNodeRenderer node={node} nodeRender={nodeRender} />)
    }
  </div>
}
const GridNodeRenderer = (props: { node: IGridNode, nodeRender: (id: string) => React.ReactNode}) => {
  const { node, nodeRender} = props
  const { id, x, y, w, h} = node
  return <div style={{
    position: 'absolute',
    transform: `translate(${x}, ${y})`,
    overflow: 'auto',
    width: w,
    height: h
  }}>
    {nodeRender(id)}
  </div>
}
export default GridRenderer