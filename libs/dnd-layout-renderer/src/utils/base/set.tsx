export function set(target = {}, path, value) {
  const paths = `${path}`.split('.');
  if (paths && paths.length > 0) {
    let temp = target;
    let index = 0;
    for (let path of paths) {
      if (index === paths.length - 1) {
        temp[path] = value;
      } else {
        if (temp[path] === undefined) {
          temp[path] = {};
        }
        temp = temp[path];
      }

      index++;
    }
  }
  return target;
}
