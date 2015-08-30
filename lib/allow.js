var ipaddr = require('ipaddr.js');

module.exports = function(allowed) {
  allowed = sanitize(allowed || []);
  if (hasFilter) {
    console.log('Allowed IPs: ' + (Object.keys(allowed).join(', ')));
  }
  return function*(next) {
    if (!allowed[ipaddr.process(this.ip).toString()]) {
      this.status = 400;
      this.body = 'IP forbidden, sorry';
      return;
    }
    yield next;
  };
};

function sanitize (allowed) {
  var allowedMap = {
    '127.0.0.1': true
  };
  for (var ip of allowed) {
    allowedMap[ip.trim()] = true;
  }
  return allowedMap;
}

