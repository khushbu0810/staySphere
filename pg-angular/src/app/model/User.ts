export interface User {
    userId?: number;
    email: string;
    password: string;
    username: string;
    role?: string;
    accountStatus: boolean;
}
