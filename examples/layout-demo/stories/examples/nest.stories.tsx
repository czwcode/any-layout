import React, { useState } from 'react';
import { RenderCore, DragFrame, ILayout, AnyLayout } from 'dnd-layout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import uuid from 'uuid';
import { produce } from 'immer';
export default {
  title: 'demos/嵌套布局',
  component: RenderCore,
  parameters: {
    info: { inline: true },
  },
};

export const 自定义拖拽展示 = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <AnyLayout
        onLayoutChange={() => {}}
        dragLayerFrameRenderer={() => {
          return <div>自定义拖拽</div>;
        }}
        layout={[
          {
            type: 'container',
            id: '11',
            children: [
              {
                type: 'containerPanel',
                id: '22',
                children: [
                  {
                    type: 'nestLayer',
                    id: '2222',
                    children: [
                      {
                        type: 'row',
                        id: '33',
                        children: [
                          {
                            id: '44',
                            type: 'col',
                            w: 12,
                            children: [
                              {
                                id: '4444',
                                type: 'nestAtom',
                                h: 6,
                              },
                            ],
                          },
                          {
                            id: '55',
                            type: 'col',
                            w: 12,
                            children: [
                              {
                                id: '555',
                                type: 'nestAtom',
                                h: 6,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]}
      />
    </DndProvider>
  );
};
function createLayout() {
  const layout = [
    {
      type: 'container',
      id: '11',
      children: [
        {
          type: 'containerPanel',
          id: '22',
          children: [
            {
              type: 'nestLayer',
              id: '33',
              children: generateLayouts(),
            },
          ],
        },
      ],
    },
  ];
  return layout;
}
function getColor() {
  const r = Math.random() * 255;
  const g = Math.random() * 255;
  const b = Math.random() * 255;
  return `rgb(${r}, ${g}, ${b})`;
}
const rowNums = 4;
function generateAtoms(nums) {
  const height = 15;
  const middle = height / nums;
  let atoms = [];
  let sum = 0;
  for (let index = 0; index < nums - 1; index++) {
    const currentH = Math.ceil((Math.random() * middle) / 2) + middle / 2;
    sum += currentH;
    atoms.push({
      id: uuid(),
      type: 'nestAtom',
      h: currentH,
      state: {
        background: getColor(),
      },
    });
  }

  atoms.push({
    id: uuid(),
    type: 'nestAtom',
    h: height - sum,
    state: {
      background: getColor(),
    },
  });
  return atoms;
}
function generateCols() {
  let cols = [];
  const w1 = Math.ceil(Math.random() * 5) + 5;
  const w2 = Math.ceil(Math.random() * 5) + 5;
  cols.push({
    id: uuid(),
    type: 'col',
    w: w1,
    children: generateAtoms(Math.ceil(Math.random() * 3) + 1),
  });
  cols.push({
    id: uuid(),
    type: 'col',
    w: w2,
    children: generateAtoms(Math.ceil(Math.random() * 3) + 1),
  });
  cols.push({
    id: uuid(),
    type: 'col',
    w: 24 - w1 - w2,
    children: generateAtoms(Math.ceil(Math.random() * 3) + 1),
  });
  return cols;
}

function generateLayouts() {
  let rowItems = [];
  for (let i = 0; i < rowNums; i++) {
    const cols = generateCols();
    rowItems.push({
      type: 'row',
      id: uuid(),
      children: cols,
    });
  }
  return rowItems;
}

export const Atom自定义渲染 = () => {
  const createL = createLayout();
  console.log('createL: ', createL);
  const [layout, setLayout] = useState(createL);

  return (
    <DndProvider backend={HTML5Backend}>
      <button
        onClick={() => {
          const l = createLayout();
          console.log('createL: ', l);
          setLayout(l);
        }}
      >
        重新生成布局
      </button>
      <AnyLayout
        AtomRenderer={(props) => {
          const { width, height, node } = props;
          return (
            <div
              style={{
                width,
                height,
                background: node.state && node.state.background,
              }}
            >
              111
            </div>
          );
        }}
        onLayoutChange={() => {}}
        layout={layout}
      />
    </DndProvider>
  );
};

export const 外部拖入 = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragFrame
        getData={() => ({
          id: uuid(),
          type: 'nestAtom',
          h: 6,
        })}
      >
        <div style={{ width: 200, padding: 12, border: '1px solid #23a' }}>
          外部组件
        </div>
      </DragFrame>
      <AnyLayout
        onLayoutChange={(layout) => {
          console.log('layout', layout);
        }}
        DragBoxRenderer={() => {
          return <div>自定义拖拽</div>;
        }}
        layout={[
          {
            type: 'container',
            id: '11',
            children: [
              {
                type: 'containerPanel',
                id: '22',
                children: [
                  {
                    type: 'containerPanel',
                    id: '222',
                    children: [
                      {
                        type: 'nestLayer',
                        id: '2222',
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]}
      />
    </DndProvider>
  );
};

export const 外部修改atom状态 = () => {
  const [layout, setLayout] = useState<ILayout[]>([
    {
      type: 'container',
      id: '11',
      children: [
        {
          type: 'containerPanel',
          id: '22',
          children: [
            {
              type: 'nestLayer',
              id: '222',
              children: [
                {
                  type: 'row',
                  id: '33',
                  children: [
                    {
                      id: '44',
                      type: 'col',
                      w: 12,
                      children: [
                        {
                          id: '444',
                          type: 'nestAtom',
                          h: 6,
                          state: {
                            a: 1,
                          },
                        },
                      ],
                    },
                    {
                      id: '55',
                      type: 'col',
                      w: 12,
                      children: [
                        {
                          id: '555',
                          type: 'nestAtom',
                          h: 6,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  return (
    <div>
      <button
        onClick={() => {
          const newLayout = produce(layout, (layout) => {
            layout[0].children[0].children[0].children[0].children[0].children[0].state.a++;
          });
          setLayout(newLayout);
        }}
      >
        修改atom的状态
      </button>
      <DndProvider backend={HTML5Backend}>
        <AnyLayout
          onLayoutChange={(layout) => {
            setLayout(layout);
          }}
          AtomRenderer={(props) => {
            const { node } = props;
            const { state } = node;
            return <div>{state ? state.a : '未定义'}</div>;
          }}
          layout={layout}
        />
      </DndProvider>
    </div>
  );
};
