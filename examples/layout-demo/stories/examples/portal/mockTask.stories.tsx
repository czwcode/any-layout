import React, { useState, useMemo, useEffect } from 'react';
import { RenderCore, AnyLayout, registPreview } from '@czwcode/dnd-layout';
import { rectanglePacking } from '@czwcode/layout-portal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getLatestLayout } from './utils';
import { Select, Button } from '@alifd/next';
export default {
  title: '工作台首页生成',
  component: RenderCore,
  parameters: {
    info: { inline: true },
  },
};

function classficationBox(nodes: { taskTypeId: number; type: string }[]) {
  const m = new Map<string, { taskTypeId: number }[]>();
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
const taskTypes = [
  '2x2',
  '4x4',
  '2x4',
  '4x2',
  { mini: '2x2', lite: '4x2' },
  { mini: '2x2', lite: '2x4' },
  { mini: '2x2', lite: '4x4' },
];
export const 任务mock测试 = () => {
  useMemo(() => {
    registPreview();
  }, []);
  const [task, setTasks] = useState<{ type: string; taskTypeId: number }[]>([]);
  console.log('task: ', task);
  const workMode = useMemo(() => getLatestLayout(), []);
  function getTypes() {
    let types = [];
    function travse(root) {
      for (let child of root || []) {
        if (child.type === 'nestAtom') {
          types.push(child.id);
        }
        if (child.children) {
          travse(child.children);
        }
      }
    }
    travse(workMode.layout);
    return types;
  }
  const taskM = classficationBox(task);
  function scale(current, currentMax, targetMax) {
    return (current / currentMax) * targetMax;
  }
  return (
    // 1. 如果存在默认多种状态，那么默认展示哪种状态怎么决定
    // 2. 切换状态是组件内部做，还是外部实现，内部实现需要提供api，外部实现位置很难摆
    <DndProvider backend={HTML5Backend}>
      <h5>
        tips:
        通过选择下拉框中的卡片类型，模拟向工作模式的坑位中填入卡片，测试算法效果
      </h5>
      <h4>模式名称： {workMode.name}</h4>
      <div style={{ display: 'flex'}}>
        {getTypes().map((item) => {
          return (
            <div>
              <strong>
                {item}{' '}
                <Select
                  value={undefined}
                  autoWidth={false}
                  dataSource={taskTypes.map((item, index) => {
                    return {
                      label: JSON.stringify(item),
                      value: index,
                    };
                  })}
                  onChange={(v) => {
                    setTasks([...task, { type: item, taskTypeId: v }]);
                  }}
                />
              </strong>
            </div>
          );
        })}
      </div>
      <AnyLayout
        onLayoutChange={() => {}}
        AtomRenderer={useMemo(
          () => ({ node, parent }) => {
            const { id } = node;
            const nodes = taskM.get(id) || [];
            const currentMax = parent.w / 2;
            const targetMax = 24;
            const [taskStatus, setTaskStatus] = useState({});
            return (
              <AnyLayout
                AtomRenderer={useMemo(
                  () => ({ node, width, height }) => {
                    console.log('height: ', height, width);
                    return (
                      <div
                        style={{
                          display: 'absolute',
                          width: '100%',
                          height: height,
                          background: 'lightgreen',
                        }}
                      >
                        {node.id}{' '}
                        <Button
                          onClick={() => {
                            const newTaskStatus = {
                              ...taskStatus,
                              [node.id]: !taskStatus[node.id],
                            };
                            setTaskStatus(newTaskStatus);
                          }}
                        >
                          切换大小
                        </Button>
                      </div>
                    );
                  },
                  [taskStatus]
                )}
                layout={useMemo(
                  () => [
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
                              children: rectanglePacking(
                                nodes.map((item, index) => {
                                  const key = id + '-' + index;
                                  const taskTypeContent =
                                    taskTypes[item.taskTypeId];
                                  const [w, h] =
                                    typeof taskTypeContent === 'string'
                                      ? taskTypeContent.split('x')
                                      : taskTypeContent[
                                          taskStatus[key] ? 'lite' : 'mini'
                                        ].split('x');
                                  return { w: Number(w), h: Number(h) };
                                }),
                                currentMax
                              ).map((item, index) => ({
                                ...item,
                                x: scale(item.x, currentMax, targetMax),
                                w: scale(item.w, currentMax, targetMax),
                                id: id + '-' + index,
                                type: 'gridAtom',
                              })),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  [taskStatus]
                )}
              />
            );
          },
          [workMode.layout, task]
        )}
        layout={workMode.layout}
      />
    </DndProvider>
  );
};
