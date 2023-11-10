import Router from 'express';
import {PasswordRecord} from '../records/password.record';
import passport from "passport";
import {UserRecord} from "../records/user.record";
import {NotAuthorizedError} from "../utils/errorHandler";

export const loginRouter = Router();

loginRouter

    .get('/', async (req, res) => {
        res.json({
            ok: true,
        });
    })

    .post('/', passport.authenticate('local'), async (req, res) => {
        const {username, password} = req.body;
        if (await UserRecord.getOneByUsername(username)) {
            const {pwdHash, salt} = await UserRecord.getOneByUsername(username)
            const verification = await PasswordRecord.validatePwd(password, pwdHash, salt);

            const user = req.user as UserRecord;

            //console.log(`userFROMReqUserPOST`,req.user);
            //console.log(`isAuthenticatedPOST`,req.isAuthenticated())

            if (req.isAuthenticated()) {
                res.json({
                    ok: true,
                    user,
                });
            } else {
                throw new NotAuthorizedError('Username or password is incorrect!');
            }
        }
    });
