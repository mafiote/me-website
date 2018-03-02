
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AccountService } from './account.service';
import { NotificationService } from './notification.service';

export const AUTH_PROVIDERS: any[] = [
    AuthGuard,
    AuthService,
    AccountService,
    NotificationService
];

export * from './auth.guard';
export * from './auth.service';
export * from './account.service';
export * from './notification.service';
