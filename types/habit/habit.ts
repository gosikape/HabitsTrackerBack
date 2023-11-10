import {HabitEntity} from "./habit-entity";

export type CreateHabitReq = Omit<HabitEntity, `id` | `userId`>;

export interface SetHabitUpdateReq {
    title: string;
    description: string;
    totalRepeatCount: number;
    userRepeatCount: number;
    isActive: boolean;
}

export interface SetHabitAsDoneUpdateReq {
    userRepeatCount: number;
    isActive: boolean;
}

export interface GetSingleHabitRes {
    habitUnit: HabitEntity;
}



