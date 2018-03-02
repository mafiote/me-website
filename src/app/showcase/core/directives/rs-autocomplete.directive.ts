import { CommonModule } from '@angular/common';
import { Directive, Host, Input, NgModule, Optional, Self, OnInit } from '@angular/core';
import { AutoComplete } from 'primeng/primeng';

import { RsHttpAutoCompleteService, IRsAutoCompleteItem, RsAutoCompleteItem } from '../http';
import { Observable } from 'rxjs/Observable';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[rsAutoComplete]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(completeMethod)': 'getlist($event)',
        '(onSelect)': 'onSelect()',
        '(onClear)': 'onClear()',
        '[class.ui-inputwrapper-filled]': 'itemFilled'
    }
})
export class RsAutoCompleteDirective implements OnInit {
    @Input() apiPath: string;
    @Input() dataList: any[];
    @Input() searchParams: any = {};
    @Input() method: string = 'AutoCompleteList';

    itemFilled: boolean = false;
    list: any[] = [];

    constructor(
        @Host() @Self() @Optional() public hostAutoComplete: AutoComplete,
        private service: RsHttpAutoCompleteService
    ) {
        if (this.hostAutoComplete && !this.hostAutoComplete.field) {
            this.hostAutoComplete.field = "text";
        }
    }

    ngOnInit() {
        // Autocomplete ekrana basıldığında eğer içerisinde değer var ise
        // Label stil problemi giderildi.
        if (this.hostAutoComplete && this.hostAutoComplete.value && this.hostAutoComplete.value.id) {
            this.itemFilled = true;
        }
    }

    private prepareFilter(query: string) {

        // let params = this.getParams(query);
        this.searchParams = this.searchParams || {};
        if (query && query !== "") {
            this.searchParams.text = query;
        } else {
            if (this.searchParams.text) {
                delete this.searchParams.text;
            }
        }
    }

    async getlist(event) {

        this.hostAutoComplete.loading = true;

        if (this.dataList) {
            this.hostAutoComplete.suggestions = this.searchLocal(event.query.toLowerCase());
        } else if (this.apiPath) {
            this.hostAutoComplete.suggestions = await this.searchAPIAsync(event.query.toLowerCase()).toPromise();
        } else {
            this.hostAutoComplete.suggestions = [];
        }

        this.hostAutoComplete.loading = false;
    }

    onSelect() {
        this.itemFilled = true;
    }

    onClear() {
        this.hostAutoComplete.value = { id: null, text: null };
        this.itemFilled = false;
    }

    private searchLocal(query: string): Array<IRsAutoCompleteItem> {
        if (!this.dataList) {
            return;
        }

        // console.log(query);
        this.prepareFilter(query);
        // tslint:disable-next-line:max-line-length
        const filteredResult = <Array<RsAutoCompleteItem>>this.service.mockdataSearchWithObj(this.searchParams, this.dataList);

        return filteredResult;
    }

    private searchAPIAsync(query: string): Observable<Array<IRsAutoCompleteItem>> {
        if (!this.apiPath) {
            return;
        }

        this.prepareFilter(query);

        return this.service.getACList(this.apiPath, this.searchParams, this.method);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [RsAutoCompleteDirective],
    declarations: [RsAutoCompleteDirective]
})
export class RsAutoCompleteModule { }