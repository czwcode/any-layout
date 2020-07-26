export function flatten<T>(data: T[][]) {
  return data.reduce((root, item) => {
    return [...root, ...item]
  }, [])
}