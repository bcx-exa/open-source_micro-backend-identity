import passport from 'passport';
import express from 'express';
import { loginForm, login, logout, createForm, forgotForm, validateForm } from './views';
export const router = express.Router();
import { generateTokens } from '../components/security/tokens';


// Authentication overrides
router.get('/login', loginForm);
router.get('/create', createForm);
router.get('/forgot', forgotForm);
router.get('/validated', validateForm);
router.get('/resettoken', (_request, response) => response.render('reset', { token: _request.query.token }));

router.post('/login', login);
router.get('/logout', logout);
router.get("/google",
    function(req: any, _res: any, next: any) {
      // Edit request object here
      req.root = 'Whatever I want';
      next();
    },
  passport.authenticate("google", {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/user.phonenumbers.read'
    ]
  }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: '/auth/login' }), async function (req: any, res: any) { 
  // Need to go to logged in page of UI, then ui should initiate request to oauth/authorize
  const tokens = await generateTokens(req.user, req.user.client, req.user.scope);
  res.body = tokens;
  res.redirect(req.user.redirect_uri);
});

router.get("/facebook",
  passport.authenticate("facebook"));

router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: '/auth/login' }), async function (req: any, res: any) {
  const tokens = await generateTokens(req.user, req.user.client, req.user.scope);
  res.body = tokens;
  res.redirect(req.user.redirect_uri);
});
