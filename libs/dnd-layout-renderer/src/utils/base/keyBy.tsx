export function keyBy<T>(arr: T[], code: string) {
  let m = {} as { [key: string]: T}
  arr.forEach(item => {
    m[item[code]] = item
  })
  return m
}