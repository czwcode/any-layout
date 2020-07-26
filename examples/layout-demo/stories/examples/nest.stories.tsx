import React, { useState } from 'react';
import { RenderCore, DragFrame, ILayoutTheme, ILayout } from 'dnd-layout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { produce} from 'immer'
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
      <RenderCore
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
                            h: 300,
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
                            h: 300,
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

export const Atom自定义渲染 = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <RenderCore
        atomFrameRenderer={(props) => {
          const { width, height, node } = props;
          const r = Math.random() * 255;
          const g = Math.random() * 255;
          const b = Math.random() * 255;
          return (
            <div style={{ width, height, background: `rgb(${r}, ${g}, ${b})` }}>
              111
            </div>
          );
        }}
        onLayoutChange={() => {}}
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
                    type: 'row',
                    id: '33',
                    children: [
                      {
                        id: '44',
                        type: 'col',
                        w: 6,
                        children: [
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 600,
                          },
                        ],
                      },
                      {
                        id: '44',
                        type: 'col',
                        w: 6,
                        children: [
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 600,
                          },
                        ],
                      },
                      {
                        id: '55',
                        type: 'col',
                        w: 6,
                        children: [
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 300,
                          },
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 300,
                          },
                        ],
                      },
                      {
                        id: '66',
                        type: 'col',
                        w: 6,
                        children: [
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 300,
                          },
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 300,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'row',
                    id: '33',
                    children: [
                      {
                        id: '44',
                        type: 'col',
                        w: 6,
                        children: [
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 600,
                          },
                        ],
                      },
                      {
                        id: '44',
                        type: 'col',
                        w: 6,
                        children: [
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 600,
                          },
                        ],
                      },
                      {
                        id: '55',
                        type: 'col',
                        w: 6,
                        children: [
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 300,
                          },
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 300,
                          },
                        ],
                      },
                      {
                        id: '66',
                        type: 'col',
                        w: 6,
                        children: [
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 300,
                          },
                          {
                            id: '77',
                            type: 'nestAtom',
                            h: 300,
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

export const 外部拖入 = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragFrame
        data={{
          type: 'nestAtom',
          h: 200,
        }}
      >
        <div style={{ width: 200, padding: 12, border: '1px solid #23a' }}>
          外部组件
        </div>
      </DragFrame>
      <RenderCore
        onLayoutChange={(layout) => {
          console.log('layout', layout);
        }}
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
                children: [],
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
                      h: 300,
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
                      h: 300,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ])
  return (
    <div>
      <button onClick={() => {
        const newLayout = produce(layout, (layout) => {
          layout[0].children[0].children[0].children[0].children[0].state.a ++ 
        })
        setLayout(newLayout)
      }}>修改atom的状态</button>
      <DndProvider backend={HTML5Backend}>
        <RenderCore
          onLayoutChange={(layout) => {
            setLayout(layout)
          }}
          atomFrameRenderer={(props) => {
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
