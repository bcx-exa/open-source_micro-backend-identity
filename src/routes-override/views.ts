/* eslint-disable */
import passport from 'passport';

export const login = passport.authenticate('local', { session: true, successReturnToOrRedirect: '/', failureRedirect: 'auth/signin' });
export const loginForm = (_request, response) => response.render('login');
export const createForm = (_request, response) => response.render('createAccount');
export const forgotForm = (_request, response) => response.render('forgot');
export const validateForm = (_request, response) => response.render('validate');
export const resetForm = (_request, response) => response.render('reset');
export const logout = (request, response) => {
  request.logout();
  response.redirect('/');
};
