import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router } from '@angular/router';
import { RsAutoCompleteItem } from '../../../../../core/http';
import { StorageService } from '../../../../../core/storage';
import { RsSimpleListComponent } from '../../../../_base/components/index';
import { EdiActionDto } from '../../../dto/edi-action';
import { EdiActionParamsGet, EdiActionService } from '../../../services/edi-action.service';
import { SCREEN, webPath } from '../../../../../core/routing/screen';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'edi-action-list',
    templateUrl: 'edi-action-list.component.html',
    styles: [
        `
        .rs-list-filter-container>div {
            margin-right: 10px;
        }

        `
    ]
})

export class EdiActionListComponent
    extends RsSimpleListComponent<EdiActionDto, EdiActionService>
    implements OnInit {

    isLogShow: boolean = false;

    filter: EdiActionParamsGet;
    filterIsImportItems: RsAutoCompleteItem[];

    constructor(
        protected translate: TranslateService,
        protected http: Http,
        protected service: EdiActionService,
        public storageService: StorageService,
        private messageService: MessageService,
        private router: Router,
        public fb: FormBuilder
    ) {
        super(translate, http, service, fb);
        this.filter = new EdiActionParamsGet();
    }

    ngOnInit() {
        super.ngOnInit();

        this.translate.get('EDI.ACTION').subscribe((lang: any) => {
            this.filterIsImportItems = [
                { id: "true", text: lang.IMPORT },
                { id: "false", text: lang.EXPORT }
            ];
        });
    }

    buildFilterForm() {
        const now = new Date();

        this.filterForm = this.fb.group({
            code: [null],
            name: [null],
            isImport: [{ id: null, text: null }]
        });

        this.filterFormLabels = {
            code: "COMMON.FIELD.CODE",
            name: "COMMON.FIELD.NAME",
            isImport: "EDI.ACTION.FIELD.IS_IMPORT"
        };
    }

    prepareFilterDto() {
        const formValue = this.filterForm.value;

        this.filter.name = formValue.name;
        this.filter.code = formValue.code;
        this.filter.isImport = (formValue.isImport || {})['id'];
    }

    rowDblClick(event) {
        super.editRecord(event.data);
    }

    getList() {
        super.getList();
    }

    logOnBack(event) {
        this.isLogShow = false;
    }

    cancel() {
        this.router.navigate([webPath(SCREEN.SYS.DASHBOARD.PATH)]);
    }

}