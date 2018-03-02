import { SysRoleService } from './role.service';
import { EdiService } from './edi.service';
import { AutocodeService } from './autocode.service';

export const SYS_PROVIDERS: any[] = [
    EdiService,
    AutocodeService,
    SysRoleService
];

export * from './edi.service';
export * from './autocode.service';
export * from './role.service';
