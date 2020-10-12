import passport from 'passport';
import express from 'express';
import { loginForm, login, logout, createForm, forgotForm, validateForm, resetForm } from './views';
import { AnyCnameRecord } from 'dns';
export const router = express.Router();


// Authentication overrides
router.get('/login', loginForm);
router.get('/create', createForm);
router.get('/forgot', forgotForm);
router.get('/validated', validateForm);
router.get('/resettoken', (_request, response) => response.render('reset', { token: _request.query.token }));

router.post('/login', login);
router.get('/logout', logout);
router.get("/google",
  passport.authenticate("google", {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/user.phonenumbers.read'
    ]
  }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: '/auth/login' }), function (req: any, res: any) { 
  // Need to go to logged in page of UI, then ui should initiate request to oauth/authorize
  console.log(req.user);
  res.redirect('/oauth/authorize');
});

router.get("/facebook",
  passport.authenticate("facebook"));

router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: '/auth/login' }), function (_req, res) {
  // Need to go to logged in page of UI, then ui should initiate request to oauth/authorize
  res.redirect(process.env.UI_DOMAIN + '/home');
});
