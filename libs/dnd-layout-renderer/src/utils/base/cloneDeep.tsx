// export { merge } from 'lodash'
export function cloneDeep(v: any) {
  return JSON.parse(JSON.stringify(v))
}
