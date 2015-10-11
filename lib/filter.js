'use strict'
const fs = require('fs')
const path = require('path')
const dayMs = 1000 * 60 * 60 * 24

function byDaysRange(days, dir) {
  return function isFileOlderThanMinDate(file) {
    const nowTime = (new Date()).getTime()
    const minTime = nowTime - (days * dayMs)
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    return stat.mtime.getTime() >= minTime
  }
}

function byExtension(extensions) {
  var regExps = extensions.map(function(extension) {
    return new RegExp('\.'+extension+'$')
  })
  return function isFileExtensionValid(file) {
    return regExps.some(function(extensionRegExp) {
      return extensionRegExp.test(file)
    })
  }
}

function registerFilters(config) {
  const filtersMap = {
    0: byExtension,
    1: byDaysRange
  }
  const filters = [ 
    config.filterExtension,
    config.filterDays
  ].map(function(filterConfig, i) {
    return !filterConfig ? null : filtersMap[i](filterConfig, config.dir)
  }).filter((i) => i !== null)
  return function(file) {
    return filters.every((filter) => filter(file))
  }
}

module.exports = registerFilters

