/* eslint-disable */
import passport from 'passport';

export const login = passport.authenticate('local', { session: true, successReturnToOrRedirect: '/', failureRedirect: 'auth/signin' });
export const loginForm = (_request, response) => response.render('login');
export const logout = (request, response) => {
  request.logout();
  response.redirect('/');
};
