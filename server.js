var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var setDefaults = require('./lib/set-defaults');
var autoindex = require('./app');

var defaults = {
  httpPort: 8080,
  httpsPort: 8443,
  key: path.join(__dirname, 'data', 'key'),
  cert: path.join(__dirname, 'data', 'cacert.pem'),
};

function server(config) {
  var httpsOptions;
  setDefaults(config, defaults);
  try {
    httpsOptions = {
      key: fs.readFileSync(config.key, 'utf-8'),
      cert: fs.readFileSync(config.cert, 'utf-8'),
    };
  } catch (e) {
    console.error(e.message);
    console.error('Cannot read server TLS files, HTTPS server disabled');
  }
  var app = autoindex(config);
  http.createServer(app.callback()).listen(config.httpPort);
  console.log('Listening incoming connections');
  console.log('HTTP server: http://localhost:'+config.httpPort);
  if (httpsOptions) {
    https.createServer(httpsOptions, app.callback()).listen(config.httpsPort);
    console.log('HTTPS server: https://localhost:'+config.httpsPort);
  }
}

module.exports = server;

