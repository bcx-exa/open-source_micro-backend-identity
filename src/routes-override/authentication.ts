import express from 'express';
import { loginForm, login, logout } from './views';
export const router = express.Router();

// Authentication overrides
router.get('/login', loginForm);
router.post('/login', login);
router.get('/logout', logout);
