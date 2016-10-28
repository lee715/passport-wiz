// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , urllib = require('urllib')

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api2.wiz.cn/auth/authorize';
  options.tokenURL = options.tokenURL || 'https://api2.wiz.cn/auth/access_token';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-wiz';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'wiz';
  this._userProfileURL = options.userProfileURL || 'https://api2.wiz.cn/api/user/get_info';
  this._oauth2.useAuthorizationHeaderforGET(true);

  this._oauth2.getOAuthAccessToken = function(code, params, callback) {
    urllib.request(this._getAccessTokenUrl(), {
      dataType: 'json',
      contentType: 'json',
      data: {
        code: code,
        client_id: this._clientId,
        client_secret: this._clientSecret
      },
      method: 'POST'
    }, function (err, body) {
      if (err) return callback(err)
      if (body.errno) return callback(new Error('obtain access_token failed'))
      callback(null, body.data.access_token, null, body.data)
    })
  }
}

util.inherits(Strategy, OAuth2Strategy);


// 获取个人信息
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2._request("GET", this._userProfileURL, {
    'Content-Type': 'application/json',
    'Wiz-Access-Token': accessToken
  }, null, null, function (err, body) {
    if (err) return done(err)
    try {
      var body = JSON.parse(body)
      if (body.errno) return done(new Error('fetch user profile failed'))
      done(null, body.data)
    } catch (e) {
      done(e)
    }
  })
}

// Expose constructor.
module.exports = Strategy;
