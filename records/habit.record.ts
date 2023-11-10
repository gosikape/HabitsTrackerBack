import {pool} from "../utils/db";
import {ValidationError} from "../utils/errorHandler";
import {v4 as uuid} from "uuid";
import {HabitEntity} from "../types";
import {FieldPacket} from "mysql2";

type HabitRecordResults = [HabitRecord[], FieldPacket[]];

export class HabitRecord implements HabitEntity {
    id?: string;
    createdAt: Date;
    title: string;
    description: string;
    userRepeatCount: number;
    totalRepeatCount: number;
    isActive: boolean | number;
    userId: string;

    constructor(obj: HabitEntity) {
        if (!obj.title || obj.title.length < 3 || obj.title.length > 150) {
            throw new ValidationError('Title must have at least 3 and at most 150 characters');
        }
        if (obj.description.length > 1000) {
            throw new ValidationError('Description must have and at most 1000 characters');
        }
        if (obj.userRepeatCount < 0 || obj.userRepeatCount > obj.totalRepeatCount || obj.userRepeatCount > 90) {
            throw new ValidationError('Finished reps number cannot be larger than total reps number and 90');
        }
        if (!obj.totalRepeatCount || obj.totalRepeatCount < 1 || obj.totalRepeatCount < obj.userRepeatCount || obj.totalRepeatCount > 90) {
            throw new ValidationError('Total reps number must be between 1 and 90 and cannot be lower than' +
                ' finished reps number');
        }

        this.id = obj.id;
        this.createdAt = obj.createdAt;
        this.title = obj.title;
        this.description = obj.description;
        this.userRepeatCount = obj.userRepeatCount;
        this.totalRepeatCount = obj.totalRepeatCount;
        this.isActive = obj.isActive;
        this.userId = obj.userId;
    }

    async insert(userId: string): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert something that is already inserted!');
        }

        await pool.execute("INSERT INTO `habits`(`id`,`title`, `createdAt`, `totalRepeatCount`,`userId`) VALUE" +
            " (:id,:title,:createdAt, :totalRepeatCount, :userId)", {
            id: this.id,
            title: this.title,
            createdAt: this.createdAt,
            totalRepeatCount: this.totalRepeatCount,
            userId,
        });
        return this.id, this.userId;
    };

    static async listAllForUser(userId: string): Promise<HabitRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `habits` WHERE `userId`= :userId  ORDER BY `createdAt` DESC", {
            userId,
        })) as HabitRecordResults;
        return results.map(obj => new HabitRecord(obj));
    };

    static async getOne(id: string): Promise<null | HabitRecord> {
        const [results] = (await pool.execute("SELECT * FROM `habits` WHERE `id`= :id ", {
            id
        })) as HabitRecordResults;
        return results.length === 0 ? null : new HabitRecord(results[0]);
    };

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `habits` WHERE `id` = :id ", {
            id: this.id,
        });
    };

    async update(): Promise<void> {
        await pool.execute("UPDATE `habits` SET `title`=:title, `description`=:description," +
            " `userRepeatCount`=:userRepeatCount," +
            " `totalRepeatCount`=:totalRepeatCount, `isActive`=:isActive WHERE `id`=:id", {
            id: this.id,
            title: this.title,
            description: this.description,
            userRepeatCount: this.userRepeatCount,
            totalRepeatCount: this.totalRepeatCount,
            isActive: this.isActive,
        });
    };

}
