node-autoindex
==============

Basic index of a directory, as Apache's `mod_autoindex`.

Installation
------------

It requires last Node.js version (0.12), to use ES6 (Harmony) features.

`npm install -g git+https://github.com/antoniobusrod/node-autoindex.git`

Install module globally and use it from command line.

Command-line tool
-----------------

```bash
  Usage: node-autoindex [options] dir

  Basic index of a directory, as Apache's mod_autoindex

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    --port <port>               custom port
    --httpsPort <httpsPort>     custom https port
    --allow <ip1,ip2>           list of allowed IPs
    --filter <ext1,ext2>        filter files by extensions by ","
    --auth <username:password>  HTTP Basic Authentication by "username:password
    --cert <cert>               https server cert file path
    --key <key>                 https server key file path
```

