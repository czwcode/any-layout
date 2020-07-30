import * as React from 'react';
import { useLayoutDrag, IDragConfig } from 'dnd-layout-renderer';
export function useAnyLayoutDrag<T>(dragProps: IDragConfig) {
  return useLayoutDrag<T>(dragProps) 
}