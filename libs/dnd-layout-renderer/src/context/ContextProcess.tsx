import React, { useContext, Context } from 'react';

export interface IContextProcess<T> {
  Ctx: Context<T>;
  value: T;
  enable: boolean;
  children?: React.ReactNode;
}

export default function ContextProcess<T>(props: IContextProcess<T>) {
  const { enable, Ctx, children, value } = props;
  if (enable) {
    const contextValue = useContext(Ctx)
    return <Ctx.Provider value={value || contextValue as any}>{children}</Ctx.Provider>;
  } else {
    return <>{children}</>;
  }
}
