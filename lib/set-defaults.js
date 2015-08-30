module.exports = function(map, defaults) {
  for (key in defaults) {
    value = defaults[key];
    if (map[key] === undefined) {
      map[key] = value;
    }
  }
  return map;
};

