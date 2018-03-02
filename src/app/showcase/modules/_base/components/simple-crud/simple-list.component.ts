import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { RsHttpService } from '../../../../core/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseDto } from '../../dto/baseDto';
import { MenuItem } from 'primeng/primeng';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AllValidationErrors, getFormValidationErrors } from '../../../../core/lib/form';
import { getFormFilledValues, isDate } from '../../../../core/lib/form';

@Component({
    selector: 'rs-simple-list',
    template: ``
})

export class RsSimpleListComponent<
    D extends BaseDto,
    S extends RsHttpService
    > implements OnInit {

    isCardShow: boolean = false;
    loading: boolean = false;

    filter: any;
    filterForm: FormGroup;
    filterFormLabels: any = {};

    recs: Array<D> = [];
    selectedRec: D = null;

    @ViewChild('card') childCard: any; // RsSimpleCardComponent;

    menuItems: MenuItem[];

    constructor(
        protected translate: TranslateService,
        protected http: Http,
        @Inject(RsHttpService) protected service: S,
        public fb: FormBuilder
    ) { }

    ngOnInit() {
        this.setMenu();
        this.buildFilterForm();
    }

    async setMenu() {
        const lang = await this.translate.get(['COMMON.MENU']).toPromise();
        const langCommon = lang['COMMON.MENU'];

        this.menuItems = [
            {
                label: langCommon.FILTER, icon: 'ui-icon-filter-list', command: (event) => {
                    this.getList();
                }
            },
            {
                label: langCommon.ADD, command: (event) => {
                    this.addRecord();
                }
            }
        ];
    }

    getValidationErrors(): AllValidationErrors[] {
        return getFormValidationErrors(this.filterForm.controls);
    }

    buildFilterForm() {
        // ilk değer atamaları için üst sınıflarda ezilebilir
        // this.filterForm = this.fb.group({});
    }

    prepareFilterDto() {
        // TODO: alan tiplerini algılayarak atama yapmayı dene
    }

    onFilterSubmit() {
        if (this.filterForm.valid) {
            this.prepareFilterDto();
            this.getList();
        }
    }

    // List Methods

    getList() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        this.service.get(this.filter).subscribe(
            res => {
                this.recs = res;
                this.loading = false;
            },
            err => {
                console.log(err);
                this.loading = false;
            }
        );
    }

    addRecord() {
        this.selectedRec = null;
        this.isCardShow = true;
    }

    editRecord(rec) {
        if (this.loading) {
            return;
        }
        this.loading = true;
        this.service.getById(rec.id).subscribe(
            (res) => {
                this.selectedRec = res;
                this.isCardShow = true;
                this.loading = false;
            },
            (err) => { console.log(err); this.loading = false; }
        );
    }

    getTotal(list: any[], field: string) {
        const result = list.reduce((sum, current) => ({ field: sum[field] + current[field] }), { field: 0 });
        return result[field];
    }

    // Card Results

    onSave(rec: D) {
        const index = this.recs.findIndex(s => s.id === rec.id);
        if (index > -1) {
            this.recs[index] = _.cloneDeep(rec);
            this.recs = [...this.recs]; // gridin diziyi yeniden yüklemesi için hack!
        } else {
            this.recs = [...this.recs, rec]; // gridin diziyi yeniden yüklemesi için hack!
        }
    }

    onCancel(event) {
        this.isCardShow = false;
        this.selectedRec = null;
    }

    onDel(id: string) {
        this.delRow(id);
        this.isCardShow = false;
    }

    delRow(id: string) {
        const index = this.recs.findIndex(s => s.id === id);
        this.recs.splice(index, 1);
        if (index > -1) {
            this.recs = [...this.recs]; // gridin diziyi yeniden yüklemesi için hack!
        }
    }

    getActiveFilters() {
        return getFormFilledValues(this.filterForm.controls);
    }

    checkDate(val) {
        return isDate(val);
    }


}