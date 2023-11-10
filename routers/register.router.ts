import Router from 'express';
import {PasswordRecord} from "../records/password.record";
import {CreateUserReq} from "../types";
import {UserRecord} from "../records/user.record";
import {ValidationError} from "../utils/errorHandler";


export const registerRouter = Router();

registerRouter

    .get('/', async (req, res) => {
        res.json({
            ok: true,
        });
    })

    .post('/', async (req, res, next) => {
        const {username, password} = req.body;
        const saltHash = await PasswordRecord.genPassword(password);
        const salt = saltHash.salt;
        const pwdHash = saltHash.hash;

        const newUser = new UserRecord({username, pwdHash, salt} as CreateUserReq);

        console.log(await UserRecord.getOneByUsername(username))
        if (await UserRecord.getOneByUsername(username)) {
            throw new ValidationError('Username already exists. You have to change it.')
        }
        if (username.indexOf('@') === -1) {
            throw new ValidationError('Mail address is incorrect - it must have at most 250 characters and includes "@"');
        }
        if (password.length > 30) {
            throw new ValidationError('Password must have at most 30 characters');
        }
        const regexp = new RegExp('(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[|.!@#’$%&+*\/()\?\^\-])')
        if (!regexp.test(password)) {
            throw new ValidationError('Password must have at least 8 characters and contains at least one' +
                ' digit, one capital letter, one regular letter and one special character')
        }

        await newUser.insert();
        res.status(200).json(newUser);
    });
