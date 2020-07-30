import { createContext } from 'react';
import { CSSProperties } from 'styled-components';
import { NestLayoutType, GridLayoutType } from '../types/componentTypes';
import React from 'react';
export interface INestLayoutTheme {
  row: {
    gap: number;
  };
  col: {
    gap: number;
  };
  atom: {
    style?: CSSProperties
    gap: number;
  };
}
export interface IGridLayoutTheme {
  rowHeight: number;
  gapX: number;
  gapY: number;
}
export type IAnyLayoutTheme = INestLayoutTheme & IGridLayoutTheme

export interface ILayoutTheme {
  [NestLayoutType.Layer]: INestLayoutTheme
  [GridLayoutType.Layer]: IGridLayoutTheme
}
export const defaultTheme: ILayoutTheme = {
  [NestLayoutType.Layer]: {
    row: { gap: 10 },
    col: { gap: 10 },
    atom: { gap: 5, style: { background: 'white'} },
  },
  [GridLayoutType.Layer]: {
    gapX: 10,
    gapY: 5,
    rowHeight: 30
  },
};
export interface ILayerContext<T>  {
  theme: T
  width: number
}
export const LayerContext = createContext<ILayerContext<IAnyLayoutTheme>>(null);
export function useLayerContext<T>(): ILayerContext<T> {
  return React.useContext(LayerContext) as any
}

export const AnyLayoutTheme = React.createContext<ILayoutTheme>(defaultTheme);