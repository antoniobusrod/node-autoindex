'use strict'
module.exports = function(map, defaults) {
  for (let key in defaults) {
    let value = defaults[key]
    if (map[key] === undefined) {
      map[key] = value
    }
  }
  return map
}

