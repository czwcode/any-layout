// export { mapValues } from 'lodash'
export function mapValues<T>(obj: { [key: string]: T}, callback: (o: T) => any) {
  return Object.keys(obj).reduce((root, key) => {
    root[key] = callback(obj[key])
    return root
  }, {} as any)
}