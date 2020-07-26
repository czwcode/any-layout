// export { sumBy } from 'lodash'
const isString = (v)=> typeof  v === 'string'
export function sumBy<T>(arr: T[], getValue: string | ((v: T) => number)) {
  return arr.reduce((sum, item) => {
    return sum + (isString(getValue) ? item[getValue as string] : (getValue as any)(item))
  }, 0)
}