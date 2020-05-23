const request = require('request');

module.exports = function (options) {
  const { loginUrl, emailPostfix } = options;

  this.bindHook('third_login', (ctx) => {
    let token = ctx.request.body.token || ctx.request.query.token;
    return new Promise((resolve, reject) => {
      request(loginUrl + token, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let result = JSON.parse(body);
          if (result && result.status === 'success') {
            let ret = {
              email: result.data.email,
              username: result.data.username
            };
            resolve(ret);
          } else {
            reject(result);
          }
        }
        reject(error);
      });
    });
  })
}