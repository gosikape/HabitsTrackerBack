import {pool} from "../utils/db";
import {v4 as uuid} from "uuid";
import {UserEntity} from "../types";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/errorHandler";

type UserRecordResults = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserEntity {
    id?: string;
    username: string;
    pwdHash: string | null;
    salt: string | null;
    isAdmin: boolean;

    constructor(obj: UserEntity) {

        if (!obj.username || obj.username.indexOf('@') === -1 || obj.username.length > 255) {
            throw new ValidationError('Mail address is incorrect - it must have at most 255 characters and includes' +
                ' "@"');
        }

        this.id = obj.id;
        this.username = obj.username;
        this.pwdHash = obj.pwdHash;
        this.salt = obj.salt;
        this.isAdmin = obj.isAdmin;
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert something that has been already inserted!');
        }

        await pool.execute("INSERT INTO `users`(`id`, `username`, `pwdHash`, `salt`) VALUES(:id, :username," +
            " :pwdHash, :salt)", {
            id: this.id,
            username: this.username,
            pwdHash: this.pwdHash,
            salt: this.salt,
        });

        return this.id;
    };

    static async listAll(): Promise<UserRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `users` ORDER BY `username` ASC")) as UserRecordResults;
        return results.map(obj => new UserRecord(obj));
    };

    static async getOne(id: string): Promise<null | UserRecord> {
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `id` = :id", {
            id,
        })) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0]);
    };

    static async getOneByUsername(username: string): Promise<null | UserRecord> {
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `username` = :username", {
            username,
        })) as UserRecordResults;
        console.log(results);
        return results.length === 0 ? null : new UserRecord(results[0]);
    };

    async update(): Promise<void> {
        await pool.execute("UPDATE `users` SET `username`=:username WHERE `id`=:id", {
            id: this.id,
            username: this.username,
        });
    };
};
