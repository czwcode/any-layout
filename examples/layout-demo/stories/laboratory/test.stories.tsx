import React, {
  memo,
  useState,
  useMemo,
  Context,
  useContext,
  createContext,
  Children,
  useEffect,
  useRef,
} from 'react';
import { usePrevious } from '../../../../libs/dnd-layout-base-layer/src/layers/grid/Layer';
export default {
  title: '实验室/Test',
  parameters: {
    info: { inline: true },
  },
};

function safeUseContext(c: any) {
  useMemo(() => {
    React.useContext(c);
  }, []);
  return;
}
function FCTest(props: T) {
  const a = useContext(Context);
  const c = useContext(Context);
  const b = useContext(Context2);
  // const b = usePrevious(a);
  // console.log(a === b);
  console.log('render', a);
  return <div> ----FCTest---{props.a}</div>;
}

function FCTest2(props: T) {
  const a = useContext(Context);
  // const b = usePrevious(a);
  // console.log(a === b);
  console.log('render2', a);
  return <div> ----FCTest2---{props.a}</div>;
}

interface T {
  a?: number;
}
const MemoFC = memo(FCTest, () => {
  return true;
});
class ClassPureTest extends React.PureComponent {
  render() {
    return <div>ClassTest--Pure--</div>;
  }
}
class ClassTest extends React.Component<T> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div>ClassTest--{this.props.a}</div>;
  }
}

const ddd = { a: 3 };
const Context = createContext(null);
const Context2 = createContext({ a: 1 });
export function T() {
  const [_, setState] = useState(1);
  const v = useMemo(() => {
    return { a: 2 };
  }, []);
  return (
    <Context.Provider value={ddd}>
      <div>
        <button
          onClick={() => {
            setState((state) => state + 1);
          }}
        >
          触发刷新
        </button>
        {/* <FCTest a={_} /> */}
        <MemoFC />
        {/* <ClassTest a={_} /> */}
        <ClassPureTest />
      </div>
    </Context.Provider>
  );
}

const a = createContext<string>(null);
const b = createContext<string>(null);

export const testRemove = () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  const [state, setState] = useState(data);
  return (
    <div>
      <button
        onClick={() => {
          // setState(state.slice(0, state.length - 1));
          setState(state.slice(0));
        }}
      >
        移除数据第一个元素
      </button>
      {state.map((item, index) => (
        <Item key={item.id} {...item}/>
      ))}
    </div>
  );
};
const Item = (props: { id: any }) => {
  console.log("render", props.id)
  return <div>{props.id}</div>;
};
