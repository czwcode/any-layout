
import {
  EditContainer,
  EditContainerPanel,
  Row,
  Col,
  EditAtom,
  AbsoluteLayer,
  AbsoluteAtom,
  GridAtom,
  GridLayer
} from 'dnd-layout-base-layer';
export * from 'dnd-layout-renderer';
import { regist } from 'dnd-layout-renderer';

regist(EditContainer);
regist(EditContainerPanel);
regist(Row);
regist(Col);
regist(EditAtom);
regist(AbsoluteLayer);
regist(AbsoluteAtom);
regist(GridLayer);
regist(GridAtom);
