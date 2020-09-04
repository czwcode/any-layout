import React, { useState } from 'react';
import { Button, Select, NumberPicker } from '@alifd/next';
import styled from 'styled-components';
export default {
  title: '实验室',
  parameters: {
    info: { inline: true },
  },
};

enum transitionFunction {
  ease = 'ease',
  'easeIn' = ' ease-in ',
  'easeOut' = ' ease-out ',
  'easeInOut' = ' ease-in-out ',
  'cubicBezier' = ' cubic-bezier',
}
const Card = styled.div`
  padding: 12px;
  margin-top: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;
export const 单个元素动画 = () => {
  const [current, setCurrent] = useState({
    width: 200,
    top: 0,
    left: 0,
    height: 200,
  });
  const [target, setTarget] = useState({
    width: 400,
    top: 200,
    left: 400,
    height: 400,
  });
  const [effect, setEffect] = useState<{
    time: number;
    timeFunction: transitionFunction;
  }>({
    time: 2,
    timeFunction: transitionFunction.ease,
  });

  const [switchS, setSwitch] = useState(false);
  let style = !switchS ? current : target;
  return (
    <div>
      <Card>
        过度动画，
        当前的卡片，朝着目标卡片，根据变换的事件函数，在规定的变换时间内将卡片进行变换。
      </Card>
      <div>
        <Card>
          <h4>当前卡片属性:</h4>
          <div>{JSON.stringify(current)}</div>
        </Card>
        <Card>
          <h4>目标卡片属性:</h4>
          <div>{JSON.stringify(target)}</div>
        </Card>
      </div>

      <Card>
        <Button type='primary' onClick={() => setSwitch(!switchS)}>
          {!switchS ? '切换为目标位置' : '切换为原始位置'}{' '}
        </Button>
      </Card>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <strong style={{ width: 200 }}>变换的时间函数</strong>
          <Select
            onChange={(v) => {
              setEffect({ ...effect, timeFunction: v });
            }}
            value={effect.timeFunction}
            dataSource={Object.values(transitionFunction).map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
          <strong style={{ width: 200 }}>变换时间</strong>
          <NumberPicker
            onChange={(v) => {
              setEffect({ ...effect, time: v });
            }}
            value={effect.time}
          />
        </div>
      </Card>

      <Card>
        <div style={{ position: 'relative', height: 600 }}>
          <div
            style={{
              position: 'absolute',
              background: 'lightgrey',
              transition: `all ${effect.time}s ${effect.timeFunction}`,
              ...style,
            }}
          >
            卡片
          </div>
        </div>
      </Card>
    </div>
  );
};
export const 动效实验室 = () => {
  const data = ['2x2 <=> 2x4', '2x2 <=> 4x2', '2x2 <=> 4x4'];
  return (
    <div>
      {data.map((item) => {
        return <div>{item}</div>;
      })}
    </div>
  );
};
