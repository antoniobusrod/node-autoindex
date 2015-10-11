'use strict'
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const setDefaults = require('./lib/set-defaults')
const autoindex = require('./app')

const defaults = {
  httpPort: 8080,
  httpsPort: 8443,
  key: path.join(__dirname, 'data', 'key'),
  cert: path.join(__dirname, 'data', 'cacert.pem'),
}

function server(config) {
  let httpsOptions = null
  setDefaults(config, defaults)
  try {
    httpsOptions = {
      key: fs.readFileSync(config.key, 'utf-8'),
      cert: fs.readFileSync(config.cert, 'utf-8'),
    }
  } catch (e) {
    console.error(e.message)
    console.error('Cannot read server TLS files, HTTPS server disabled')
  }
  const app = autoindex(config)
  http.createServer(app.callback()).listen(config.httpPort)
  console.log('Listening incoming connections')
  console.log('HTTP server: http://localhost:'+config.httpPort)
  if (httpsOptions) {
    https.createServer(httpsOptions, app.callback()).listen(config.httpsPort)
    console.log('HTTPS server: https://localhost:'+config.httpsPort)
  }
}

module.exports = server

