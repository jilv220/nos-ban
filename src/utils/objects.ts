import { A } from '@mobily/ts-belt'

export function areObjsEqual(obj1: object, obj2: object): boolean {
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  // If the objects don't have the same number of keys, they are not equal
  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  // Check if each key in obj1 has the same value as the corresponding key in obj2
  return A.eq(obj1Keys, obj2Keys, (_1, _2) => _1 === _2)
}

export default {
  areObjsEqual,
}
