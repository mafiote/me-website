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


export class ParamAutocode {
    code: string;
    dateTime: object;
}

@Injectable()
export class AutocodeService extends RsHttpService implements IRsHttpService {
    constructor(
        http: Http,
        storageService: StorageService,
        messageService: MessageService,
        router: Router, public translate: TranslateService
    ) {
        super(http, storageService, messageService, router, translate);
        this.path = ApiPaths.SYS.AUTOCODE;
    }

    autoCodeGenerate(params): Observable<any> {
        return this.get(params, 'AutoCodeGenerate');
    }



}