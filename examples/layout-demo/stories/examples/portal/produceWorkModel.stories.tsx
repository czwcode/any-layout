import React, { useState, useMemo } from 'react';
import { RenderCore, DragFrame, ILayout, AnyLayout, registPreview } from '@czwcode/dnd-layout';
import { linkTo } from '@storybook/addon-links';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Input } from '@alifd/next';
import '@alifd/next/dist/next.css';
import { createLayout, linkToMockPage } from './utils';
export default {
  title: '工作台首页生成',
  component: RenderCore,
  parameters: {
    info: { inline: true },
  },
};

const materiels = ['通用工具', '数据卡片', '任务卡片', '操作卡片'];
export const 生产物料 = () => {
  useMemo(() => {
    registPreview();
  }, []);
  const [layout, onLayoutChange] = useState<ILayout[]>([
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
              children: [],
            },
          ],
        },
      ],
    },
  ]);
  const [name, setName] = useState('');
  return (
    <DndProvider backend={HTML5Backend}>
      <h2>1. 根据基础物料类型，构建工作模式模板</h2>
      <div style={{ marginBottom: 12 }}>
        <strong>工作模式名称：</strong>
        <Input
          value={name}
          onChange={setName}
          placeholder={'请输入模式名称'}
        ></Input>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex' }}>
          {materiels.map((materiel) => (
            <DragFrame
              getData={() => ({
                id: materiel,
                type: 'nestAtom',
                h: 6,
              })}
            >
              <div
                style={{ width: 200, padding: 12, border: '1px solid #23a' }}
              >
                {materiel}
              </div>
            </DragFrame>
          ))}
        </div>
        <Button
          type='primary'
          onClick={() => {
            createLayout(name, layout);
            linkToMockPage();
          }}
        >
          保存工作模式
        </Button>
      </div>
      <span>TODO: 使用过的模式应该置灰，或者排除</span>

      <AnyLayout
        onLayoutChange={(layout) => {
          console.log('layout: ', layout);
          onLayoutChange(layout);
        }}
        AtomRenderer={({ node, parent }) => {
          return <div>{node.id}</div>;
        }}
        layout={layout}
      />
    </DndProvider>
  );
};
