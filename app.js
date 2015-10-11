'use strict'
const fs = require('fs')
const path = require('path')
const koa = require('koa')
const serveIndex = require('koa-serve-index')
const logger = require('koa-logger')
const serve = require('koa-static')
const allow = require('./lib/allow')
const filter = require('./lib/filter')
const sort = require('./lib/sort')
const auth = require('./lib/auth')
const setDefaults = require('./lib/set-defaults')

const defaults = {
  dir: process.cwd(),
  serve: {
    defer: true
  },
  serveIndex: {
    view: 'details',
    icons: true,
    fileSort: null,
    stylesheet: path.join(__dirname, 'public', 'style.css')
  },
}

function setByFlags(config) {
  if (config.filterExtension || config.filterDays) {
    config.serveIndex.filter = filter(config)
    delete config.filterExtension
    delete config.filterDays
  }
  if (config.byDate) {
    config.serveIndex.fileSort = sort.byDate(config.byDate)
    delete config.byDate
  }
  return config
}

module.exports = function(config) {
  let app = koa()
  config = setDefaults(config, defaults)
  config.dir = fs.realpathSync(config.dir)
  config = setByFlags(config)
  app.use(logger())
  if (config.allowed) {
    app.use(allow(config.allowed))
  }
  if (config.auth) {
    if (!config.auth.keys) {
      config.auth.keys = [ 'secret' ]
    }
    auth(app, config.auth)
  }
  app.use(serve(config.dir, config.serve))
  app.use(serveIndex(config.dir, config.serveIndex))
  return app
}

