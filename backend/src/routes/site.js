/* eslint-disable */
const passport = require('passport');
const login = require('connect-ensure-login');

module.exports.index = (_request, response) => response.send('OAuth 2.0 Server');

module.exports.loginForm = (_request, response) => response.render('login');

module.exports.login = passport.authenticate('local', { session: true, successReturnToOrRedirect: '/', failureRedirect: '/login' })

module.exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};

module.exports.account = [
  login.ensureLoggedIn(),
  (request, response) => response.render('account', { user: request.user }),
];
