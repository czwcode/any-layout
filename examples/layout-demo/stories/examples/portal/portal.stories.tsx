import React, {  useMemo } from 'react';
import { RenderCore, AnyLayout, registPreview } from '@czwcode/dnd-layout';
import { rectanglePacking, IBaseNode } from '@czwcode/layout-portal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
export default {
  title: '工作台首页生成',
  component: RenderCore,
  parameters: {
    info: { inline: true },
  },
};

function classficationBox(nodes: (IBaseNode & { type: string })[]) {
  const m = new Map<string, IBaseNode[]>();
  for (let node of nodes) {
    const { type, ...rest } = node;
    if (m.has(type)) {
      m.get(type).push(rest);
    } else {
      m.set(type, [rest]);
    }
  }
  return m;
}
export const 经典布局 = () => {
  useMemo(() => {
    registPreview();
  }, []);
  const task = [
    {
      type: 'A',
      w: 4,
      h: 2,
    },
    {
      type: 'A',
      w: 4,
      h: 2,
    },
    {
      type: 'A',
      w: 4,
      h: 2,
    },
    {
      type: 'A',
      w: 4,
      h: 2,
    },
    {
      type: 'A',
      w: 4,
      h: 2,
    },
    {
      type: 'A',
      w: 4,
      h: 2,
    },
    {
      type: 'B',
      w: 4,
      h: 4,
    },
    {
      type: 'B',
      w: 4,
      h: 4,
    },
    {
      type: 'B',
      w: 4,
      h: 4,
    },
    {
      type: 'B',
      w: 4,
      h: 4,
    },
    {
      type: 'B',
      w: 4,
      h: 4,
    },
    {
      type: 'B',
      w: 4,
      h: 4,
    },
  ];
  const taskM = classficationBox(task);
  function scale(current, currentMax, targetMax) {
    return current / (currentMax) * (targetMax )
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <AnyLayout
        onLayoutChange={() => {}}
        AtomRenderer={({ node, parent }) => {
          const { id } = node;
          const nodes = taskM.get(id) || [];
          const currentMax = parent.w / 2;
          const targetMax = 24;
          return (
            <AnyLayout
              layout={[
                {
                  type: 'container',
                  id: 'g',
                  children: [
                    {
                      type: 'containerPanel',
                      id: 'gg',
                      children: [
                        {
                          type: 'gridLayer',
                          id: 'ggg',
                          h: 24,
                          w: 24,
                          children: rectanglePacking(nodes, currentMax).map((item, index) => ({
                            ...item,
                            x: scale(item.x, currentMax, targetMax),
                            w: scale(item.w, currentMax, targetMax),
                            id: id + '-' +index,
                            type: 'gridAtom',
                          })),
                        },
                      ],
                    },
                  ],
                },
              ]}
            />
          );
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
                            w: 16,
                            children: [
                              {
                                id: 'A',
                                type: 'nestAtom',
                                h: 12,
                              },
                            ],
                          },
                          {
                            id: '55',
                            type: 'col',
                            w: 8,
                            children: [
                              {
                                id: 'B',
                                type: 'nestAtom',
                                h: 12,
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
