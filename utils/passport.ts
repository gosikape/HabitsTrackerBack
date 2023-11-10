import passport from 'passport';
import {Strategy} from 'passport-local';
import {UserRecord} from "../records/user.record";
import {PasswordRecord} from "../records/password.record";
import {Request} from "express";
import {NotFoundError} from "./errorHandler";

const verifyCallback = async (username: string, password: string, done: CallableFunction): Promise<CallableFunction> => {

    try {
        const user = await UserRecord.getOneByUsername(username);
        //console.log(`user`, user);
        if (user === null) {
            throw new NotFoundError('There is no user with given username in the database');
            //return done(null, false)
        }
        const isValid = await PasswordRecord.validatePwd(password, user.pwdHash, user.salt);

        //console.log(`valid`, isValid);
        if (user.username == username && isValid) {
            return done(null, user);
        } else {
            return done(null, false, {msg: 'Email or password is incorrect'});
        }
    } catch (err) {
        console.log(err);
        done(err);
    }
};

const strategy = new Strategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((req: Request, user: UserRecord, done: CallableFunction) => {
    //console.log(`serialize`,user);
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await UserRecord.getOne(id);
        //console.log(`deserialize`,user)
        done(null, user);
    } catch (err) {
        done(err);
    }
});
