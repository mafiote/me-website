import { Component, Input, OnInit, EventEmitter, ViewChild, trigger, state, transition, style, animate } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { AuthService } from "../../../modules/auth/services/index";
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { TranslateService, } from '@ngx-translate/core';
import { AccountService } from '../../../modules/auth/services/account.service';
import { StorageService, StorageKey } from '../../../core/storage/index';

@Component({
    selector: 'app-inline-profile',
    templateUrl: './app.profile.component.html',
    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class InlineProfileComponent {

    active: boolean;
    changePassDialogActive: boolean = false;
    confirmPassword: string;
    newPassword: string;
    oldPassword: string;
    personelImage: string;
    userName: string;

    constructor(private authService: AuthService,
        private translate: TranslateService,
        private confirmationService: ConfirmationService,
        private accountService: AccountService,
        private storageService: StorageService) {
        this.personelImage = this.storageService.getItem(StorageKey.PER_CODE);
        this.userName = this.storageService.getItem(StorageKey.EMAIL);
    }


    onClick(event) {
        this.active = !this.active;
        event.preventDefault();
    }

    logout() {
        this.authService.logout();
    }

    changePass() {
        this.changePassDialogActive = true;
    }

    changePassDialogClose() {
        this.changePassDialogActive = false;
    }

    changePassRequest() {
        console.log({ oldPassword: this.oldPassword, newPassword: this.newPassword, confirmPassword: this.confirmPassword });
        this.accountService.setPassword
            ({ newPassword: this.newPassword, confirmPassword: this.confirmPassword })
            .subscribe(
            res => {
                console.log(res);
                this.changePassDialogClose();
            }
            );
    }

}
