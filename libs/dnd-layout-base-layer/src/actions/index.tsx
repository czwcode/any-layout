import { Action, DropOptions, INode, DragDirection, SizeOptions } from 'dnd-layout-renderer';
import { IAnyLayoutTheme, ILayerContext } from '../context/theme';

export interface AnyDropOptions extends DropOptions {
  layerContext: ILayerContext<IAnyLayoutTheme>
}
export abstract class AnyAction extends Action {
  abstract onDrag(): void;
  abstract onDrop(
    dragPath: number[],
    dropPath: number[],
    options: AnyDropOptions
  ): void;
  abstract onRemove(): INode;
  abstract onMove(
    dragPath: number[],
    dropPath: number[],
    options: DropOptions
  ): void;
  abstract onSizeChange(path: number[], options: SizeOptions): void;
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
