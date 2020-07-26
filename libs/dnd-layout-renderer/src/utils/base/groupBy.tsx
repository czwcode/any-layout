export function groupBy<T>(arr: T[], key: string) {
  return arr.reduce((root, item) => {
    const current = root[item[key]]
    if(current) {
      current.push(item)
    } else {
      root[item[key]] = [item]
    }
    return root
  }, {})
}