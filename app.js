var fs = require('fs');
var koa = require('koa');
var serveIndex = require('koa-serve-index');
var logger = require('koa-logger');
var serve = require('koa-static');
var allow = require('./lib/allow');
var filter = require('./lib/filter');
var auth = require('./lib/auth');
var setDefaults = require('./lib/set-defaults');

var defaults = {
  dir: process.cwd(),
  serve: {
    defer: true
  },
  serveIndex: {
    view: 'details',
    icons: true
  },
};

module.exports = function(config) {
  setDefaults(config, defaults);
  var app = koa();
  if (config.filter) {
    config.serveIndex.filter = filter(config.filter);
  }
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

