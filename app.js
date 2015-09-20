var fs = require('fs');
var koa = require('koa');
var serveIndex = require('koa-serve-index');
var logger = require('koa-logger');
var serve = require('koa-static');
var allow = require('./lib/allow');
var filter = require('./lib/filter');
var sort = require('./lib/sort');
var auth = require('./lib/auth');
var setDefaults = require('./lib/set-defaults');

var defaults = {
  dir: process.cwd(),
  serve: {
    defer: true
  },
  serveIndex: {
    view: 'details',
    icons: true,
    fileSort: null
  },
};

module.exports = function(config) {
  var app = koa();
  config = setDefaults(config, defaults);
  config = setByFlags(config);
  app.use(logger());
  var dir = fs.realpathSync(config.dir);
  if (config.allowed) {
    app.use(allow(config.allowed));
  }
  if (config.auth) {
    if (!config.auth.keys) {
      config.auth.keys = [ 'secret' ];
    }
    auth(app, config.auth);
  }
  app.use(serve(dir, config.serve));
  app.use(serveIndex(dir, config.serveIndex));
  return app;
};

function setByFlags(config) {
  if (config.filter) {
    config.serveIndex.filter = filter(config.filter);
    delete config.filter;
  }
  if (config.byDate) {
    config.serveIndex.fileSort = sort.byDate(config.byDate);
    delete config.byDate;
  }
  return config;
}
