import passport from 'passport';
import express from 'express';
import { loginForm, login, logout, createForm, forgotForm, validateForm, resetForm } from './views';
export const router = express.Router();

// Authentication overrides
router.get('/login', loginForm);
router.get('/create', createForm);
router.get('/forgot', forgotForm);
router.get('/reset', resetForm);
router.get('/validate', validateForm);
router.post('/login', login);
router.get('/logout', logout);
router.get("/google",
  //passport.authenticate(["basic", "oauth2-client-password"], { session: false }),
  passport.authenticate("google", {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/user.phonenumbers.read'
    ]
  }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: '/auth/login' }), function (_req, res) {
  res.redirect("/");
});

router.get("/facebook",
  //passport.authenticate(["basic", "oauth2-client-password"], { session: false }),
  passport.authenticate("facebook"));

router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: '/auth/login' }), function (_req, res) {
  res.redirect("/");
});
