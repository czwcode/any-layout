import { createContext } from 'react';


export interface ILayoutTheme {
  nest: {
    row: {
      gap: number;
    };
    col: {
      gap: number;
    };
    atom: {
      gap: number;
    };
  };
  grid: {
    gapX: number;
    gapY: number;
  };
}
export const defaultTheme = {
  nest: {
    row: { gap: 10 },
    col: { gap: 10 },
    atom: { gap: 5 },
  },
  grid: {
    gapX: 10,
    gapY: 5,
  },
};
export const ThemeContext = createContext<ILayoutTheme>(defaultTheme);
