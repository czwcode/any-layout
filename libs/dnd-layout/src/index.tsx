import {
  EditContainer,
  EditContainerPanel,
  Row,
  Col,
  EditNestAtom,
  AbsoluteLayer,
  AbsoluteAtom,
  GridAtom,
  GridLayer,
  NestLayer,
  PreviewGridAtom,
} from '@czwcode/dnd-layout-base-layer';
import {
  PreviewContainer,
  PreviewNestAtom,
  PreviewContainerPanel,
} from '@czwcode/dnd-layout-base-layer';
export * from '@czwcode/dnd-layout-renderer';
export * from '@czwcode/dnd-layout-base-layer';
import { regist, clearRegist } from '@czwcode/dnd-layout-renderer';

export function registPreview() {
  clearRegist()
  regist(EditContainer);
  regist(EditContainerPanel);
  regist(Row);
  regist(Col);
  regist(PreviewNestAtom);
  regist(AbsoluteLayer);
  regist(AbsoluteAtom);
  regist(GridLayer);
  regist(PreviewGridAtom);
  regist(NestLayer);
}
export function registEditor() {
  clearRegist()
  regist(EditContainer);
  regist(EditContainerPanel);
  regist(Row);
  regist(Col);
  regist(EditNestAtom);
  regist(AbsoluteLayer);
  regist(AbsoluteAtom);
  regist(GridLayer);
  regist(GridAtom);
  regist(NestLayer);
  
}
