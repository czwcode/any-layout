import * as React from 'react';
import { useLayoutDrop, IDropConfig, DropOptions } from 'dnd-layout-renderer';
import {
  IAnyLayoutTheme,
  LayerContext,
  ILayerContext,
} from '../context/layerContext';

export interface IAnyDropOptions extends DropOptions {
  layerContext: ILayerContext<IAnyLayoutTheme>;
}
export function useAnyLayoutDrop<T extends HTMLDivElement>(
  dropProps: IDropConfig<IAnyDropOptions>
) {
  const theme = React.useContext<any>(LayerContext);
  return useLayoutDrop<T>({
    ...dropProps,
    onDrop: (dragPath, dropPath, options) => {
      dropProps.onDrop(dragPath, dropPath, {
        ...options,
        layerContext: theme,
      });
    },
    onHover: (dragPath, dropPath, options) => {
      dropProps.onHover(dragPath, dropPath, {
        ...options,
        layerContext: theme,
      });
    },
  });
}
