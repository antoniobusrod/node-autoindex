exports.byDate = function(revert) {
  return function byDate(a, b) {
    const compare = a.stat.ctime.getTime() - b.stat.ctime.getTime()
    return revert ? -compare : compare
  }
}

