import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
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

@Injectable()
export class AccountService extends RsHttpService implements IRsHttpService {
    constructor(
        http: Http,
        storageService: StorageService,
        public router  : Router, public translate : TranslateService,
        messageService : MessageService
    ) {
        super(http, storageService, messageService, router , translate);
        this.path = ApiPaths.ACCOUNT.BASE;
    }

    // TODO: Model objesi oluştur
    setPassword(model?: any): Observable<Response> {
        return this.post(model, 'ChangePassword');
    }

}