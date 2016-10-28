// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')

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

}

util.inherits(Strategy, OAuth2Strategy);


// 获取个人信息
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    done(err, body.data)
  })
}

// Expose constructor.
module.exports = Strategy;
