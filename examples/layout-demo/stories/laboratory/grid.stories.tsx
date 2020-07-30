import React from 'react';
import { RenderCore, DragFrame, AnyLayout } from 'dnd-layout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
export default {
  title: '实验室/Grid布局',
  parameters: {
    info: { inline: true },
  },
};

export const RenderCoreTest = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragFrame
        data={{
          type: 'nestAtom',
        }}
      >1111</DragFrame>
      <AnyLayout
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
                    type: 'gridLayer',
                    id: '33',
                    w: 24,
                    h: 900,
                    children: [
                      {
                        id: '44',
                        type: 'gridAtom',
                        w: 6,
                        h: 6,
                        x: 6,
                        y: 0
                      },
                      {
                        id: '55',
                        type: 'gridAtom',
                        w: 6,
                        h: 6,
                        x: 12,
                        y: 0
                      },
                      {
                        id: '66',
                        type: 'gridAtom',
                        w: 6,
                        h: 6,
                        x: 18,
                        y: 0
                      },
                      {
                        id: '77',
                        type: 'gridAtom',
                        w: 6,
                        h: 6,
                        x: 18,
                        y: 6
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

