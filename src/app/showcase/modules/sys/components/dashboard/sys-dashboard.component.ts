import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { MenuModule, MenuItem } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

import { SCREEN, webPath } from '../../../../core/routing/screen';

// KURAL: selector rs- ön takısı ile bağlamalıdır.
// KURAL: stil, html ve ts dosyaları aynı isimde olmalıdır.
// KURAL: isimlendirmede kebabcase ile ekranı açıklayıcı subfix
//        kullanılmalıdır. -list, -card, -analize gibi
@Component({
    selector: 'rs-sys-dashboard',
    templateUrl: 'sys-dashboard.component.html',
    styleUrls: [
        'sys-dashboard.component.scss'
    ]
})

export class SysDashboardComponent implements OnInit {


    menuItems: MenuItem[];

    constructor(
        private translate: TranslateService,
        private router: Router,
        private http: Http,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {

    }


    edi() {
        this.router.navigate([webPath(SCREEN.EDI.ACTION.PATH)]);
    }

    autoCode() {
        this.router.navigate([webPath(SCREEN.SYS.AUTOCODE.PATH)]);
    }

    sysVersion() {
        this.router.navigate([webPath(SCREEN.SYS.VERSION.PATH)]);
    }

}