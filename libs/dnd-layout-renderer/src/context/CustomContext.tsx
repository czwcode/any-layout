// import React, { useEffect, useState, useRef } from 'react';

// const CustomContext = React.createContext(null)
// export interface Context<T> {
//   Provider: Provider<T>;
//   Consumer: Consumer<T>;
//   _regist: (fn: (v: T) => void) => number;
//   _unRegist: (id: number) => void;
//   displayName?: string;
//   _cacheValue: { value: T };
// }

// // Context via RenderProps
// export interface ProviderProps<T> {
//   value: T;
//   children?: React.ReactNode;
// }

// export interface ConsumerProps<T> {
//   children: (value: T) => React.ReactNode;
// }

// export type Provider<T> = React.FC<ProviderProps<T>>;
// export type Consumer<T> = React.FC<ConsumerProps<T>>;

// export function useContext<T>(context: Context<T>) {
//   const [state, setState] = useState<T>(context._cacheValue.value);
//   useEffect(() => {
//     const id = context._regist(setState);
//     return () => {
//       context._unRegist(id);
//     };
//   }, []);
//   return state;
// }

// export function createContext<T>(defaultValue: T): Context<T> {
//   let count = 0;
//   let callbackMap = new Map<number, (v: T) => void>();
//   let cacheValue = {
//     value: defaultValue,
//   };
//   let isFirstTrigger = true;
  
//   function Provider(props: { value: T; children?: React.ReactNode }) {
//     const innerRef = useRef({
//       count: 0,
//       isFirstTrigger: true,
//       callbackMap:  new Map<number, (v: T) => void>()
//     })
//     function _regist(func: (v: T) => void) {
//       count++;
//       callbackMap.set(count, func);
//       return count;
//     }
//     function _unRegist(id: number) {
//       callbackMap.delete(id);
//     }
//     const { children, value } = props;
//     cacheValue.value = value;
//     useEffect(() => {
//       if (!isFirstTrigger) {
//         Array.from(callbackMap.values()).forEach((func) => {
//           func(cacheValue.value);
//         });
//       }
//       isFirstTrigger = false;
//     }, [cacheValue.value]);
//     return <CustomContext.Provider>{children}</CustomContext.Provider>;
//   }
//   function Consumer(props: { children: (v: T) => React.ReactNode }) {
//     const [state, setState] = useState<T>(cacheValue.value);
//     // 找到最近的父级
//     useEffect(() => {
//       const currentCount = count++;
//       callbackMap.set(currentCount, setState);
//       return () => {
//         console.log('unmount');
//         callbackMap.delete(currentCount);
//       };
//     }, []);
//     const { children } = props;
//     return <>{children(state)}</>;
//   }
//   return {
//     Provider,
//     Consumer,
//     _regist,
//     _unRegist,
//     _cacheValue: cacheValue,
//   };
// }
