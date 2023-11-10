export interface UserEntity {
    id?: string;
    username: string;
    pwdHash: string | null;
    salt: string | null;
    isAdmin: boolean;
};
