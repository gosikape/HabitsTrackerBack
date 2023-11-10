import {UserEntity} from "../user";

export type CreateUserReq = Omit<UserEntity, `id`>;
