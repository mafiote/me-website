import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Services
import { StorageService } from '../../../core/storage/storage.service';
import { ApiPaths } from '../../../core/routing/index';
import { RsHttpService, IRsHttpService } from '../../../core/http/rs-http.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router } from '@angular/router';
import { transition } from '@angular/core/src/animation/dsl';

export class EdiGetFilterDto {
    filter1: string;
    filter2: string;
}

export class EdiGetLogFilterDto {
    code: string;
    date: Date;
    refTable: string;
    isRead: boolean;
    isReImport: boolean;
    desc: string;
}

@Injectable()
export class EdiService extends RsHttpService implements IRsHttpService {
    constructor(
        http: Http,
        storageService: StorageService,
        messageService: MessageService,
        router: Router, public translate: TranslateService
    ) {
        super(http, storageService, messageService, router, translate);
        // TODO: path değeri ApiPaths sabitlerinden çekilmeli
        this.path = ApiPaths.SYS.EDI;
    }

    read(id: string): Observable<Response> {
        return this.put({ 'id': id }, 'read');
    }


    reImport(id: string): Observable<Response> {
        return this.put({ 'id': id }, 'ReImport');
    }

}