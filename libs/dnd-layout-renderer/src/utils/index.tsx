export function encodePath(paths: number[] = []) {
  return paths.join('.');
}

export function encodePathWithChildren(paths: number[] = []) {
  const newPaths = paths.reduce((root, item, index) => {
    if(index !== paths.length - 1) {
      return root.concat([item, 'children'])
    } else {
      return root.concat([item])
    }
  }, [])
  return newPaths.join('.');
}