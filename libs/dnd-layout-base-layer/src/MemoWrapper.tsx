import React, { memo } from 'react';
import { ILayout, IComponentRender } from 'dnd-layout-renderer';
function Wrapper({ children }: { layout: ILayout; children: React.ReactNode }) {
  return <>{children}</>;
}
let MemoWrapper = null;
export function getMemoWrapper() {
  if (!MemoWrapper) {
    MemoWrapper = memo<
      IComponentRender & {
        layout: ILayout;
        active: any;
        children: React.ReactNode;
      }
    >(Wrapper, (preProps, nextProps) => {
      // 布局大小改变，不应该在这里校验
      const checkAttribute = ['layout', 'active'];
      return checkAttribute.every((key) => {
        return !nextProps[key] ? false : preProps[key] === nextProps[key];
      });
    });
  }
  return MemoWrapper as React.ComponentClass<{
    layout: ILayout;
    active: any;
    children: React.ReactNode;
  }>;
}
