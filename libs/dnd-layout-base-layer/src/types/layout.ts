import { SizeOptions } from "dnd-layout-renderer";
import { ILayerContext, IAnyLayoutTheme } from "../context/theme";

export interface IAnySizeOptions extends SizeOptions{
  layerContext: ILayerContext<IAnyLayoutTheme>
}