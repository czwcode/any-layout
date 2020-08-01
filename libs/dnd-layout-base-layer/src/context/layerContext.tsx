import { CSSProperties } from 'styled-components';
import { NestLayoutType, GridLayoutType } from '../types/componentTypes';
import React, { createContext, useContext } from 'react';
export interface INestLayoutTheme {
  row: {
    gap: number;
  };
  col: {
    gap: number;
  };
  atom: {
    style?: CSSProperties;
    gap: number;
  };
  rowHeight: number;
  cols: number;
}
export interface IGridLayoutTheme {
  rowHeight: number;
  gapX: number;
  gapY: number;
  cols: number;
}
export type IAnyLayoutTheme = INestLayoutTheme & IGridLayoutTheme;

export interface ILayoutTheme {
  [NestLayoutType.Layer]: INestLayoutTheme;
  [GridLayoutType.Layer]: IGridLayoutTheme;
}
export const defaultTheme: ILayoutTheme = {
  [NestLayoutType.Layer]: {
    row: { gap: 10 },
    col: { gap: 10 },
    atom: { gap: 5, style: { background: 'white' } },
    rowHeight: 30,
    cols: 24,
  },
  [GridLayoutType.Layer]: {
    gapX: 10,
    gapY: 5,
    rowHeight: 30,
    cols: 24,
  },
};
export interface ILayerContext<T> {
  theme: T;
  width: number;
}
export const LayerContext = createContext<ILayerContext<IAnyLayoutTheme>>(null);
export function useLayerContext<T>(): ILayerContext<T> {
  return useContext(LayerContext) as any;
}

export const AnyLayoutTheme = createContext<ILayoutTheme>(defaultTheme);
