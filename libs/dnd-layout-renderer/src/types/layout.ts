
export interface IBaseNode<ITheme> {
  id?: string;
  w?: number;
  h?: number;
  state?: any
  type: string;
  theme?: ITheme
}
export interface INode<ITheme> extends IBaseNode<ITheme>{
  x?: number;
  y?: number;
}

export interface ILayout<ITheme> extends INode<ITheme>{
  children?: ILayout<ITheme>[]
}
export enum LayoutType {
  Container = 'Container',
  ContainerPanel = 'ContainerPanel',
  Layer = 'Layer',
  Layout = 'Layout',
  Atom = 'Atom',
}

export enum LayerType {
  Absolute = 'Absolute',
  Gird = 'Gird',
  Nest = 'Nest',
}


