import * as crypto from "crypto";

import {PasswordEntity} from "../types";
import {PasswordGen} from "../types/password/password";
import {NotAuthorizedError, ValidationError} from "../utils/errorHandler";

export class PasswordRecord implements PasswordEntity {
    password: string;
    hash: string;
    salt: string;

    constructor(obj: PasswordEntity) {
        if (!obj.password || obj.password.length < 8 || obj.password.length > 30) {
            throw new ValidationError('Password must have at least 8 and at most 30 characters');
        }

        this.password = obj.password;
        this.hash = obj.hash;
        this.salt = obj.salt;
    }

    static async genPassword(password: string): Promise<PasswordGen> {
        const salt = crypto.randomBytes(32).toString('hex');
        const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        return {
            salt: salt,
            hash: genHash,
        }
    };

    static async validatePwd(password: string, hash: string, salt: string): Promise<boolean> {
        const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        if (hash !== hashVerify) {
            throw new NotAuthorizedError('Username or password is incorrect!')
        }
        return hash === hashVerify;
    };

};
