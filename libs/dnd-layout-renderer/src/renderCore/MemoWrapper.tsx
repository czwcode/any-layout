import React, { memo } from 'react';
import { ILayout } from '../types/layout';
import { IAtomRenderer } from '../register';
function Wrapper({
  children,
}: {
  layout: ILayout<any>;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
let MemoWrapper = null;
export function getMemoWrapper<ITheme>() {
  if (!MemoWrapper) {
    MemoWrapper = memo<
      IAtomRenderer<ITheme> & {
        layout: ILayout<any>;
        children: React.ReactNode;
      }
    >(Wrapper, (preProps, nextProps) => {
      // 布局大小改变，不应该在这里校验
      const checkAttribute = ['layout', 'activePath'];
      return checkAttribute.every((key) => {
        return !nextProps[key] ? false : preProps[key] === nextProps[key];
      });
    });
  }
  return MemoWrapper as React.ComponentClass<
    IAtomRenderer<ITheme> & {
      layout: ILayout<any>;
      children: React.ReactNode;
    }
  >;
}
