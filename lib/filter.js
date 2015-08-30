module.exports = function(extensions) {
  var regExps = extensions.map(function(extension) {
    return new RegExp('\.'+extension+'$');
  });
  return function filter(file, i, files, originalDir) {
    return regExps.some(function(extensionRegExp) {
      return extensionRegExp.test(file);
    });
  };
};
