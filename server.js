const request = require('request');

module.exports = function (options) {
  const { loginUrl } = options;

  this.bindHook('third_login', (ctx) => {
    return new Promise((resolve, reject) => {
      const cookieHeader = ctx.headers.cookie || '';
      const authCookies = cookieHeader
        .split(';')
        .map(cookie => cookie.trim())
        .filter(cookie =>
          cookie.indexOf('toon_internal_user_token=') === 0 ||
          cookie.indexOf('toon_internal_user_uuid=') === 0
        )
        .join('; ');

      if (!authCookies) {
        return reject(new Error('Admin login cookie not found'));
      }

      request({
        url: loginUrl,
        headers: { Cookie: authCookies },
        json: true
      }, function (error, response, result) {
        if (error) {
          return reject(error);
        }

        if (response.statusCode !== 200) {
          return reject(new Error('Admin user verification failed: HTTP ' + response.statusCode));
        }

        if (!result || !result.email || !result.username) {
          return reject(new Error('Admin user response is missing email or username'));
        }

        resolve({
          email: result.email,
          username: result.username
        });
      });
    });
  })
}
