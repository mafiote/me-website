import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, ConfirmationService, Button } from 'primeng/primeng';

import { StorageService } from '../../../../core/storage/index';
import { AutocodeService, ParamAutocode } from '../../services/index';
import { SCREEN_LIST, SCREEN, webPath } from '../../../../core/routing/screen';
import { element } from 'protractor';

@Component({
    selector: 'cd-autocode',
    templateUrl: 'autocode.component.html',
    styles: [

    ]
})

export class AutocodeComponent implements OnInit {

    filter: ParamAutocode;

    editable: boolean = false;

    menuItems: MenuItem[];
    codeFormat: string = "";
    lastCodeNumber: string = "";

    _screenList: any[] = SCREEN_LIST; // property ler code path
    screenList: any = [];
    codelist: any[] = [];
    menuUpdateButtonName: string = "UPDATE_OFF";
    buttonEditable: boolean = false;
    buttonName: string = "";

    selectedRec: any = null;

    constructor(
        private translate: TranslateService,
        private router: Router,
        private http: Http,
        private autocodeService: AutocodeService,
        protected confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private storageService: StorageService
    ) { }

    ngOnInit() {
        this.filter = new ParamAutocode();
        // Screen listesi auto complate içinde kullanılacak hale geitriliyor.

        this.translate.get(['COMMON.MENU', 'NAVIGATION', 'SYS.AUTOCODE']).subscribe((lang: any) => {
            const langCommon = lang['COMMON.MENU'];
            const langNav = lang['NAVIGATION'];
            const langSys = lang['SYS.AUTOCODE'];

            for (let i = 0; i < this._screenList.length; i++) {
                this.screenList[i] = {};
                this.screenList[i].id = this._screenList[i].CODE;
                this.screenList[i].text = langNav['/' + this._screenList[i].PATH];
            }
        });

        this.getList();
    }


    getList() {
        this.autocodeService.get(null).subscribe(
            res => {

                // screenCode aynı olan kaydı birleştir yada yeniden oluştur.
                for (let i = 0; i < this.screenList.length; i++) {
                    const index = res.findIndex(s => s.screenCode === this.screenList[i].id);
                    if (index === -1) {
                        res.push({
                            codeFormat: "",
                            screenCode: this.screenList[i].id,
                            screenName: this.screenList[i].text,
                            lastCodeNumber: 0
                        });
                    } else {
                        res[index].screenName = this.screenList[i].text;
                        // bulundu guncelle
                    }
                }
                this.codelist = res;
                // this.getDepartmentList();
            }
        );
    }

    save(data) {
        if (data.id) {

            const updModel = {
                codeFormat: data.codeFormat,
                lastCodeNumber: data.lastCodeNumber,
                id: data.id
            };

            this.autocodeService.put(updModel).subscribe(
                res => {
                    this.getList();
                },
                err => {
                    console.log(err);
                    this.getList();
                }
            );

        } else {

            const addModel = {
                lastCodeNumber: data.lastCodeNumber,
                screenCode: data.screenCode,
                codeFormat: data.codeFormat,

            };

            this.autocodeService.post(addModel).subscribe(
                res => {
                    this.getList();
                },
                err => {
                    console.log(err);
                    this.getList();
                }
            );

        }

    }

    onEditInit(event) {
        this.selectedRec = event.data;
    }

    cancel() {
        this.router.navigate([webPath(SCREEN.SYS.DASHBOARD.PATH)]);
    }

}