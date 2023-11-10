import {PasswordEntity} from "./password-entity";

export type PasswordGen = Omit<PasswordEntity, 'password'>;
