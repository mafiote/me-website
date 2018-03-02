import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService, StorageKey } from '../../../core/storage/index';
import { SCREEN, webPath } from '../../../core/routing/screen';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private storageService: StorageService) { }

    canActivate() {
        if (this.storageService.getItem(StorageKey.TOKEN)) {
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate([webPath(SCREEN.AUTH.LOGIN.PATH)]);
        return false;
    }
}
