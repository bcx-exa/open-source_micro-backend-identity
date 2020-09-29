/* eslint-disable */
const passport = require('passport');
const login = require('connect-ensure-login');

module.exports.index = (_request, response) => response.send('OAuth 2.0 Server');
module.exports.login = passport.authenticate('local', { session: true, successReturnToOrRedirect: '/', failureRedirect: 'auth/signin' });
module.exports.loginForm = (_request, response) => response.render('login');

module.exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};

module.exports.account = [
  login.ensureLoggedIn('/auth/login'),
  (request, response) => response.render('account', { user: request.user }),
];
