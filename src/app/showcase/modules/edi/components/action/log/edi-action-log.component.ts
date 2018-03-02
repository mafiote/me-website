import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { EdiLogDto } from '../../../../sys/dto/ediDto';
import { EdiGetLogFilterDto, EdiService } from '../../../../sys/services/edi.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AllValidationErrors, getFormValidationErrors, getFormFilledValues, isDate } from '../../../../../core/lib/form';
@Component({
    selector: 'edi-action-log',
    templateUrl: 'edi-action-log.component.html',
    styles: [
        `
        .rs-list-filter-container>div {
            margin-right: 10px;
        }
        `
    ]
})

export class EdiActionLogComponent implements OnInit {

    recs: Array<EdiLogDto> = [];
    filter: EdiGetLogFilterDto;
    filterForm: FormGroup;
    filterFormLabels: any = {};

    @Output() onBack = new EventEmitter();

    isReadList: any[] = [];
    isReImportList: any[] = [];

    constructor(
        private translate: TranslateService,
        private service: EdiService,
        public fb: FormBuilder
    ) {
        this.filter = new EdiGetLogFilterDto();
    }

    ngOnInit() {
        this.buildFilterForm();
        this.translate.get('COMMON.DIALOG').subscribe((lang: any) => {
            this.isReadList = [
                { id: "true", text: lang.YES },
                { id: "false", text: lang.NO }
            ];
            this.isReImportList = [
                { id: "true", text: lang.YES },
                { id: "false", text: lang.NO }
            ];
        });
    }

    onFilterSubmit() {
        if (this.filterForm.valid) {
            this.prepareFilterDto();
            this.getList();
        }
    }


    buildFilterForm() {
        const now = new Date();

        this.filterForm = this.fb.group({
            code: [null],
            desc: [null],
            date: [now],
            isRead: [{ id: null, text: null }],
            isReImport: [{ id: null, text: null }]
        });

        this.filterFormLabels = {
            code: "COMMON.FIELD.CODE",
            desc: "COMMON.FIELD.DESC",
            date: "COMMON.DATE.DATE",
            isRead: "SYS.EDI.IS_READ",
            isReImport: "SYS.EDI.IS_RE_IMPORT",
        };
    }

    prepareFilterDto() {
        const formValue = this.filterForm.value;

        this.filter.desc = formValue.desc;
        this.filter.code = formValue.code;
        this.filter.date = new Date(formValue.date);
        this.filter.isRead = (formValue.isRead || {})['id'];
        this.filter.isReImport = (formValue.isReImport || {})['id'];
    }

    getList() {
        this.service.get(this.filter).subscribe(
            res => {
                this.recs = res;
            },
            err => console.log(err)
        );
    }


    read(data) {
        this.service.read(data.id).subscribe(
            res => {
                data.isRead = true;
            },
            err => console.log(err)
        );
    }

    reImport(data) {
        this.service.reImport(data.id).subscribe(
            res => {
                data.isReImport = true;
            },
            err => console.log(err)
        );
    }

    getActiveFilters() {
        return getFormFilledValues(this.filterForm.controls);
    }

    checkDate(val) {
        return isDate(val);
    }

}