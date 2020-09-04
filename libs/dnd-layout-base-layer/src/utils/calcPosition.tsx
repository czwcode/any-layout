import { XYCoord } from '@czwcode/dnd-layout-renderer';
export function calcMovePosition(
  originPosition: XYCoord,
  currentPosition: XYCoord
) {
  return {
    x: currentPosition.x - originPosition.x,
    y: currentPosition.y - originPosition.y,
  };
}
