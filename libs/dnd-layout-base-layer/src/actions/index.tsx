import {
  Action,
  DropOptions,
  INode,
  DragDirection,
  ISizeOptions,
} from '@czwcode/dnd-layout-renderer';
import { IAnyLayoutTheme, ILayerContext } from '../context/layerContext';

export interface IAnyDropOptions<ITheme> extends DropOptions {
  layerContext: ILayerContext<ITheme>;
}
export abstract class AnyAction<ITheme> extends Action {
  abstract onDrag(): void;
  abstract onDrop(
    dragPath: number[],
    dropPath: number[],
    options: IAnyDropOptions<ITheme>
  ): void;
  abstract onRemove(): INode;
  abstract onMove(
    dragPath: number[],
    dropPath: number[],
    options: DropOptions
  ): void;
  abstract onSizeChange(path: number[], options: ISizeOptions): void;
}

class Animal {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }
  public move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
