import React from 'react';
export type TreeData<T extends { children?: TreeData<T>[] }> = T;
export interface ITreeTravseRenderer<T> {
  path?: number[];
  node: TreeData<T>;
  parent: TreeData<T>;
  children?: React.ReactNode;
}
export interface ITreeTravse<T> {
  TreeTravseRenderer: (props: ITreeTravseRenderer<T>) => JSX.Element;
  dataSource: TreeData<T>[];
  path?: number[];
  getKey?: (data: T, path: number[]) => number | string;
  parent?: TreeData<T>;
}
export function TreeTravse<T extends { children?: TreeData<T>[] }>(
  props: ITreeTravse<T>
) {
  const {
    dataSource,
    TreeTravseRenderer,
    path = [],
    parent,
    getKey = (data: any, path) => data.id //+'--'+path.join('.'),
  } = props;
  return (
    <>
      {dataSource.map((currentLayout, index) => {
        const currentPath = [...path, index];
        return (
          <TreeTravseRenderer
            key={getKey(currentLayout, currentPath)}
            parent={parent}
            path={currentPath}
            node={currentLayout}
          >
            <TreeTravse
              parent={currentLayout}
              path={currentPath}
              dataSource={currentLayout.children}
              TreeTravseRenderer={TreeTravseRenderer}
            />
          </TreeTravseRenderer>
        );
      })}
    </>
  );
}
