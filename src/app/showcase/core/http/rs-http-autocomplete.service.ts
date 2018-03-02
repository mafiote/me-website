import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable } from 'rxjs/Observable';

import { StorageService } from '../storage/index';
import { RsHttpService } from './rs-http.service';

export interface IRsAutoCompleteItem {
    id: string;
    text: string;
}

export class RsAutoCompleteItem implements IRsAutoCompleteItem {
    constructor(public id: string, public text: string) {

    }
}

export interface IRsHttpAutoCompleteService {
    getACList(path: string, params?: any): Observable<Array<any>>;
}

@Injectable()
export class RsHttpAutoCompleteService extends RsHttpService implements IRsHttpAutoCompleteService {

    constructor(http: Http, storageService: StorageService, messageService: MessageService,
        public router: Router, public translate: TranslateService) {
        super(http, storageService, messageService, router, translate);
    }

    getACList(path: string, params?: any, method: string = 'AutoCompleteList'): Observable<Array<any>> {
        if (!method) {
            method = 'AutoCompleteList';
        }

        return this.get(params, method, path);
    }

}