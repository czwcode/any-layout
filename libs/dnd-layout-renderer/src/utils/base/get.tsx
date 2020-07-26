export function get(o, path, defaultValue?: any) {
  const keys = Array.isArray(path) ? path : `${path}`.split('.')
  if (o === null || o === undefined) {
    return defaultValue
  }
  if (keys && keys.length > 0) {
    let temp = o
    let index = 0
    for (let key of keys) {
      if(temp === null) {
        return defaultValue
      }
      if (index === keys.length - 1) {
        return temp[key] === undefined ? defaultValue : temp[key]
      } else if (temp[key] === undefined) {
        return defaultValue
      } else {
        temp = temp[key]
      }
      index++
    }
  } else {
    return o
  }
}
