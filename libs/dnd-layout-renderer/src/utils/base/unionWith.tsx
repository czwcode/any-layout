export function unionWith<T>(arr: T[], getValue: (pre: T, next: T) => boolean) {
  let newArr = [] as T[]
  arr.forEach(arrItem => {
    if(newArr.every(item => {
      return !getValue(arrItem, item)
    })) {
      newArr.push(arrItem)
    }
  })
  return newArr
}
