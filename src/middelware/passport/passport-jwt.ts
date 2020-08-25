import * as express from 'express';
import { StrategyOptions, Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import { PassportStatic } from 'passport';
import fs from 'fs';
import { UserService } from "../../services/users";
import { User } from '@/models/user';

export const authenticateUser = (passport: PassportStatic) => {
    const pubKeyPath = process.cwd() + '/src/crypto-keys/pub.pem';
    const pubKey = fs.readFileSync(pubKeyPath, 'utf8');    

    const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        issuer: process.env.API_DOMAIN,
        secretOrKey: pubKey,
        algorithms: ['RS256']
    };

    passport.use(new Strategy(options, async (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
        const userService = new UserService();
        const user = await userService.GetUserById(jwtPayload.user.id);

        if (user) return done(user, false);
        if (!user) {
            return done(null, false);
        } else {
            return done(null, user, {issuedAt: jwtPayload.iat});
        }
    }));

    
};

export const expressAuthentication = passport.authenticate('jwt', {session: false});


interface IJwtPayload {
    user?: User;
    iat?: Date;
}
