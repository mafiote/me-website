import { AutocodeComponent } from './autocode/autocode.component';
import { SysDashboardComponent } from './dashboard/sys-dashboard.component';
import { VersionChangesComponent } from './version/version-changes.component';
import { SYS_ROLE_COMPONENTS } from './role/index';
import { SysNotificationListComponent } from './notifications/list/sys-notification-list.component';

export const SYS_COMPONENTS: any[] = [
    SysDashboardComponent,
    SysNotificationListComponent,
    AutocodeComponent,
    VersionChangesComponent,
    SYS_ROLE_COMPONENTS
];

export * from "./dashboard/sys-dashboard.component";
export * from "./autocode/autocode.component";
export * from './version/version-changes.component';
export * from './role/index';
export * from './notifications/list/sys-notification-list.component';
