var session = require('koa-session');
var passport = require('koa-passport');
var BasicStrategy = require('passport-http').BasicStrategy;

function serializeUser(user, done) {
  done(null, user.id);
}

function deserializeUser(id, done) {
  done(null, { id: id });
}

function basicAuthentication(auth) {
  return function(username, password, done) {
    var isUsernameValid = username === auth.username;
    var isPasswordValid = password === auth.password;
    if (isUsernameValid && isPasswordValid) {
      done(null, { id: username });
    } else {
      done(null, false);
    }
  };
}

function authentication(_this, next) {
  return function*(err, user, info) {
    if (err) {
      throw err;
    }
    if (user === false) {
      _this.status = 401;
      _this.set('WWW-Authenticate', 'Basic realm="Secure autoindex area"');
    } else {
      yield _this.login(user);
      yield next;
    }
  };
}

module.exports = function(app, auth) {
  app.keys = auth.keys;
  app.use(session(app));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function*(next) {
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use('local', new BasicStrategy(basicAuthentication(auth)));
    yield next;
  });
  app.use(function*(next) {
    if (this.isAuthenticated()) {
      yield next;
    } else {
      var _this = this;
      yield passport.authenticate('local', authentication(_this, next)).call(this, next);
    }
  });
};

