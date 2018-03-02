/**
 *
 *          -- !! YAPIM AŞAMASINDA !! --
 *          --   PROJEDE KULLANMAYIN  --
 *
 */


import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RsAutoCompleteItem, RsHttpAutoCompleteService } from '../../http/rs-http-autocomplete.service';


@Component({
    selector: 'rs-multiSelect',
    template: `
        <div class="rs-multi-select-container">
            <button pButton type="button" class="add-button" (click)="opMs.toggle($event)" icon="mode-edit"></button>
            <p-overlayPanel #opMs>
                <p-listbox [options]="dataList" [(ngModel)]="selectedRecs" (onChange)="onChange($event)"
                    multiple="true" checkbox="true" optionLabel="name">
                    <p-header *ngIf="title">
                        {{ title | translate}}
                    </p-header>
                </p-listbox>
            </p-overlayPanel>
            <div *ngFor="let selRec of selectedRecs" class="rs-multi-select-chip">
                {{selRec.text}}
            </div>
        </div>
    `
})

export class RsMultiSelectComponent implements OnInit {

    @Input() dataList: RsAutoCompleteItem[] = null;

    @Input() apiPath: string = null;
    @Input() title: string = null;

    // -- model nesnesi
    private _modelVal: string[];
    @Input()
    get model(): string[] {
        return this._modelVal;
    }
    set model(val: string[]) {
        this._modelVal = val;
        this.modelChange.emit(this._modelVal);
    }
    @Output() modelChange = new EventEmitter();
    // -- model nesnesi -- end

    selectedRecs: RsAutoCompleteItem[];

    constructor(
        private autocompleteService: RsHttpAutoCompleteService
    ) { }

    ngOnInit() {
        this.initList();
    }

    async initList() {
        if (this.dataList == null && this.apiPath != null) {
            this.dataList = await this.autocompleteService.getACList(this.apiPath, null).toPromise();
        }

        this.selectedRecs = [];

        if (this._modelVal && this._modelVal.length > 0) {
            this._modelVal.forEach(el => {
                const data = this.dataList.find(s => s.id === el);
                if (data) {
                    this.selectedRecs.push(data);
                }
            });
        }

    }

    onChange(event) {
        this.convertListToModel();
    }

    convertListToModel() {
        const tempModel: string[] = [];

        if (this.selectedRecs && this.selectedRecs.length > 0) {
            this.selectedRecs.forEach(el => {
                tempModel.push(el.id);
            });
        }

        this.model = [...tempModel];
    }
}