import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';

import { version } from '../../../../../../environments/version';
import { SCREEN, webPath } from '../../../../core/routing/screen';
import { StorageKey, StorageService } from '../../../../core/storage';
import { NotificationService } from '../../../auth/services';

@Component({
    selector: 'home-dashboard',
    templateUrl: 'home-dashboard.component.html',
    styles: [
        `
        `,
    ]
})

export class HomeDashboardComponent implements OnInit {


    constructor(
        private storageService: StorageService,
        private router: Router,
        private notificationService: NotificationService
    ) {

    }
    ngOnInit() {
        /* Notification'a get atarak tokenın geçerli olup olmadığı kontrol edilir.
        Eğer version güncellenmişse ve token geçerli ise version sayfasına yönlendirilir. */
        if (this.storageService.getItem(StorageKey.VERSION) !== version) {
            this.notificationService.getMyNotification().subscribe(
                res => {
                    this.router.navigate([webPath(SCREEN.SYS.VERSION.PATH)]);
                },
                err => console.log(err)
            );
        }
    }

}