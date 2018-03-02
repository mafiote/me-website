export class SysRoleDto {
    id: string;
    code: string;
    roleGroupDetails: RoleGroupDetailDto[];
    users: RoleGroupUserDto[];
    identityRoleListID: string;
    identityRoleListName: string;
    pdPersonnelID: string;
    pdPersonnelCode: string;
    pdPersonnelName: string;
    userListID: string;
    userListName: string;
}

export class RoleGroupDetailDto {
    id: string;
    identityRoleID: string;
    identityRoleName: string;
    isDeleted: boolean;
}

export class RoleGroupUserDto {
    id: string;
    identityUserID: string;
    identityUserName: string;
    pdPersonnelID: string;
    pdPersonnelCode: string;
    pdPersonnelName: string;
    isDeleted: boolean;
}