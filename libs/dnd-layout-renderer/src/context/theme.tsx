import { createContext, Context } from 'react';

export let ThemeContext = null;
export  function getThemeContext<T>(){
  if(!ThemeContext) {
    ThemeContext = createContext<T>(null)
  }
  return ThemeContext as Context<T>
}
