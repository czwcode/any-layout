import React, { useState } from 'react';
import { RenderCore, DragFrame, ILayout, AnyLayout } from '@czwcode/dnd-layout';
import { Table, Balloon, Button } from '@alifd/next';
import '@alifd/next/dist/next.css';
import { getLayoutList, linkToMockPage } from './utils';
export default {
  title: '工作台首页生成',
  component: RenderCore,
  parameters: {
    info: { inline: true },
  },
};

export const 生产物料 = () => {
  const data = getLayoutList();
  return <Table  dataSource={data} >
    <Table.Column width={100}  title={'模板名称'} dataIndex={'name'} />
    <Table.Column title={'模板描述json'} dataIndex={'layout'} cell={(value) => {
      return <Balloon trigger={<div > {JSON.stringify(value)}</div>}>
        <div > {JSON.stringify(value)}</div>
      </Balloon> 
    }}/>
    <Table.Column title={'操作栏'} dataIndex={'layout'} cell={(value) => {
      return <div>
        <Button onClick={() => {
          linkToMockPage()
        }} type='primary' shape='text' >跳转到mcok测试页面</Button>
      </div>
    }}/>
  </Table>;
};
