import { Permission } from "./permission";

export class Role {
    roleId: string;
    name: string;
    code: string;
    permissions: Permission[];
}
