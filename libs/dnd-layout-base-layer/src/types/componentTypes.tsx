

export type ComponentType = NestLayoutType & GridLayoutType & AbsoluteLayoutType


export enum NestLayoutType {
  Layer = 'nestLayer',
  Row = 'row',
  Col = 'col',
  Atom = 'nestAtom',
}

export enum GridLayoutType {
  Layer = 'gridLayer',
  Atom = 'gridAtom',
}
export enum AbsoluteLayoutType {
  Layer = 'absoluteLayer',
  Atom = 'absoluteAtom',
}
export const ComponentType = {
  Nest: NestLayoutType,
  Grid: GridLayoutType,
  Absolute: AbsoluteLayoutType
}