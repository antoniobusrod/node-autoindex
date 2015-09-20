exports.byDate = function(revert) {
  return function byDate(a, b) {
    var compare = a.stat.ctime.getTime() - b.stat.ctime.getTime();
    return revert ? -compare : compare;
  };
};

