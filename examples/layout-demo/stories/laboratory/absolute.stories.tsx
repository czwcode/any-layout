import React, { useState } from 'react';
import { DragFrame, AnyLayout } from '@czwcode/dnd-layout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@alifd/next';
export default {
  title: '实验室/绝对布局',
  parameters: {
    info: { inline: true },
  },
};

export const RenderCoreTest = () => {
  const [state, setState] = useState()
  return (
    <DndProvider backend={HTML5Backend}>
      <Button onClick={() => {
        setState(null)
      }}>测试刷新</Button>
      <AnyLayout
        AtomRenderer={() => {
          console.log("刷新拉")
          return <div>111</div>
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
                    type: 'absoluteLayer',
                    id: '33',
                    w: 24,
                    h: 900,
                    children: [
                      {
                        id: '44',
                        type: 'absoluteAtom',
                        w: 6,
                        h: 200,
                        x: 100,
                        y: 100,
                      },
                      {
                        id: '55',
                        type: 'absoluteAtom',
                        w: 6,
                        h: 200,
                        x: 200,
                        y: 200,
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
