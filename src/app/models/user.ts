import { Role } from "./role";

export class User {
    userId: string;
    name: string;
    emailAddress: string;
    roles: Role[];
}
