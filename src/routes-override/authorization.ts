import express from 'express';
import { authorization, decision, token } from '../middelware/passport/passport-oauth2orize';
export const router = express.Router();

// Authorization overrides
router.get('/authorize', authorization);
router.post('/decision', decision);
router.post('/token', token); 