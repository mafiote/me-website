import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';

import { RsHttpService } from '../../../../core/http/rs-http.service';
import { StorageService } from '../../../../core/storage/index';
import { SimpleSettingsDto } from '../../dto/simpleSettingsDto';

@Component({
    selector: 'rs-simple-settings',
    templateUrl: 'simple-settings.component.html',
    styles: [
        `
            .form-container {
                padding: 0px !important;
            }
            .form-container>* {
                padding: 1.2em 5px;
            }
        `
    ]
})

export class RsSimpleSettingsComponent implements OnInit {

    @Input() title: string;
    @Input() apiPath: string;

    recs: any[] = [];
    isEditing: boolean = false;
    selectedRec: any = null;

    private service: RsHttpService;

    constructor(
        private http: Http,
        private storageService: StorageService,
        private router: Router,
        protected messageService: MessageService,
        protected confirmationService: ConfirmationService,
        protected translate: TranslateService
    ) {
        this.service = new RsHttpService(http, storageService, messageService, router, translate);
    }

    ngOnInit(): void {
        this.service.path = this.apiPath;
        this.getList();
    }

    async getList() {
        this.recs = await this.service.get(null).toPromise();
    }

    onEditInit(event) {
        this.selectedRec = event.data;
    }

    add() {
        const record = new SimpleSettingsDto();
        record.code = "";
        record.name = "";
        record.id = "";
        this.recs = [...this.recs, record];
        this.isEditing = true;
    }

    async save(rowData) {
        // Validation
        if (!rowData.code || !rowData.name || rowData.code === "" || rowData.name === "") {
            this.translate.get('COMMON.MSG').subscribe((lang: any) => {
                this.messageService.add({ severity: 'error', summary: lang.E_SAVE_002, detail: lang.E_SAVE_002 });
            });
            return;
        }
        // rowdan gelen verileri gönderir.
        if (rowData.id === "") {
            await this.service.post(rowData).toPromise();
        } else {
            await this.service.put(rowData).toPromise();
        }
        this.selectedRec = null;
        this.isEditing = true;
        this.getList();
    }

    async remove(rowData) {
        if (!rowData.id || rowData.id === "") {
            return;
        }
        //  silme işlemi
        await this.service.delete(rowData.id).toPromise();
        // gridden elle silme işlemi
        this.isEditing = false;
        this.selectedRec = null;
        const index = this.recs.findIndex(s => s.id === rowData.id);
        if (index > -1) {
            this.recs.splice(index, 1);
            this.recs = [...this.recs];
        }
    }

}