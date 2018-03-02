import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService, MenuItem } from 'primeng/primeng';
import { StorageService, StorageKey } from '../../../../core/storage/index';
import { version } from '../../../../../../environments/version';
import { SCREEN, webPath } from '../../../../core/routing/screen';
import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'rs-version-changes',
    templateUrl: 'version-changes.component.html',
    styles: [
        `
        `
    ]
})

export class VersionChangesComponent implements OnInit {

    recs;
    lang: string = "";

    constructor(
        private http: Http,
        private storageService: StorageService,
        private router: Router,
        protected messageService: MessageService,
        protected confirmationService: ConfirmationService,
        protected translate: TranslateService
    ) {

    }

    ngOnInit() {
        if (this.storageService.getItem(StorageKey.VERSION) !== version) {
            this.storageService.setItem(StorageKey.VERSION, version);
        }

        this.lang = this.storageService.getItem(StorageKey.LANG);

        this.getVersion().subscribe(
            res => {
                this.recs = res;
                return this.recs || {};
            }
        );
    }

    cancel() {
        this.router.navigate([webPath(SCREEN.SYS.DASHBOARD.PATH)]);
    }
    // Kaç adet changes varsa onun numarasını girerirz html tarafında o sayı adedince döner.
    counter(i: number) {
        return new Array(i);
    }

    getVersion(): Observable<any> {
        console.log("Mock: GET");
        return this.http.get('assets/_releaseLog/releaseLog.json')
            .map(
                response => <Array<any>>response.json(),
                err => console.log(err)
            );
    }
}