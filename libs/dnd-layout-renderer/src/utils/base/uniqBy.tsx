export function uniqBy<T>(arr: T[], getValue: (pre:T) => any) {
  let newArr = [] as T[]
  const set = new Set()
  arr.forEach((arrItem) => {
    const v = getValue(arrItem)
    if(!set.has(v)) {
      set.add(v)
      newArr.push(arrItem)
    }
  })
  return newArr
}