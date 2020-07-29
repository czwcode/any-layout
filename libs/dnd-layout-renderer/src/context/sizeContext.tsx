import { createContext } from 'react';

export interface ISizeContext {
  width?: number;
  height?: number;
}

export const SizeContext = createContext<ISizeContext>(null);
