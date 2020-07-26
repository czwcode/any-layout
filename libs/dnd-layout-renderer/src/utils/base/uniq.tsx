import { unionWith } from "./unionWith";

export function uniq(arr: any[]) {
  return unionWith(arr, (pre, next) => pre === next)
}