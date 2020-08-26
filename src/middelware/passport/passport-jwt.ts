import { StrategyOptions, Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import { PassportStatic } from 'passport';
import fs from 'fs';
import { IdentityService } from "../../services/identity";
import { UserIdentityJWT } from '@/models/identity';

export const authenticateUser = (passport: PassportStatic): void => {
    const pubKeyPath = process.cwd() + '/src/crypto-keys/pub.pem';
    const pubKey = fs.readFileSync(pubKeyPath, 'utf8');    

    const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        issuer: process.env.API_DOMAIN,
        secretOrKey: pubKey,
        algorithms: ['RS256']
    };

    passport.use(new Strategy(options, async (jwtPayload: UserIdentityJWT, done: VerifiedCallback) => {
        
        const identityService = new IdentityService();
        const identityUser = await identityService.GetIdentityById(jwtPayload.sub);

        if (identityUser) return done(identityUser, false);
        if (!identityUser) {
            return done(null, false);
        } else {
            return done(null, identityUser, {issuedAt: jwtPayload.iat});
        }
    }));
};

export const expressAuthentication = passport.authenticate('jwt', {session: false});