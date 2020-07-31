import React, { memo, useState } from 'react';
export default {
  title: '实验室/Test',
  parameters: {
    info: { inline: true },
  },
};

function FCTest(props: T) {
  return <div>FCTest---{props.a}</div>;
}
interface T {
  a?: number;
}
const MemoFC = memo(FCTest);
class ClassPureTest extends React.PureComponent {
  render() {
    return <div>ClassTest--Pure--</div>;
  }
}
class ClassTest extends React.Component<T> {
  render() {
    return <div>ClassTest--{this.props.a}</div>;
  }
}
export function T() {
  const [_, setState] = useState(1);
  return (
    <div>
      <button
        onClick={() => {
          setState((state) => state+ 1);
        }}
      >
        触发刷新
      </button>
      <FCTest a={_} />
      <MemoFC a={_} />
      <ClassTest a={_} />
      <ClassPureTest />
    </div>
  );
}
