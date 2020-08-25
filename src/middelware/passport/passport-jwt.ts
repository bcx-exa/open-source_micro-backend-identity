import passport from 'passport';
import { JwtStrategy, ExtractJwt } from 'passport-jwt';
import fs from 'fs';
import { GetUserById } from "../../services/users";
import { User } from "../../models/user";

const pubKeyPath = process.cwd() + '/src/crypto-keys/pub.pem';
const pubKey = fs.readFileSync(pubKeyPath, 'utf8');

// We are using the public key as this is to verify the validity of the signed token
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: pubKey,
    algorithms: ['RS256']
};

const jwtStrategy = new JwtStrategy(options, (payload, done) => {
    //Get id from payload
    GetUserById(payload.sub)
        .then(user => {
            // if user exists return it
            if(user) return done(null, user);
            // if user doesn't exist then return not found
            else return done(null, false);
        })
        .catch(e => done(e));
});

passport.use(jwtStrategy);

passport.serializeUser((user: User, done) => {
    done(null, user.id);
});

passport.deserializeUser((Id: string, done) => {
    GetUserById(id)
        .then((user) => {
            done(null, user);
        })
        .catch(e => done(e));
})

