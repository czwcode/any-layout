export interface IBaseNode {
  id?: string;
  w?: number;
  h?: number;
  state?: any;
  type: string;
  theme?: any;
}
export interface INode extends IBaseNode {
  x?: number;
  y?: number;
}

export interface ILayout extends INode {
  children?: ILayout[];
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

export interface XYCoord {
  x: number;
  y: number;
}
