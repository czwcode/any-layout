// export { merge } from 'lodash'
export function pick(obj: { [key: string]: any}, arr: string[]) {
  return Object.keys(obj).reduce((root, key) => {
    root[key] = obj[key]
    return root
  }, {})
}