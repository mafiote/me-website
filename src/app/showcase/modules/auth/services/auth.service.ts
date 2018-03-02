import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import "rxjs/add/operator/do";

import { ApiPaths } from '../../../core/routing/index';
import { LoginDto } from '../dto/index';

// Services
import { RsHttpService, IRsHttpService } from "../../../core/http/rs-http.service";
import { StorageService, StorageKey } from '../../../core/storage/index';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { TranslateService } from '@ngx-translate/core';
import { SCREEN, webPath } from '../../../core/routing/screen';


@Injectable()
export class AuthService extends RsHttpService implements IRsHttpService {

    constructor(
        http: Http,
        storageService: StorageService,
        messageService: MessageService,
        public router: Router, public translate: TranslateService
    ) {
        super(http, storageService, messageService, router, translate);
    }

    login(vm: LoginDto): Observable<Response> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');

        return this.http.post(
            ApiPaths.TOKEN,
            'grant_type=password&username=' + vm.username + '&password=' + vm.password,
            { headers: headers }
        )
            .map(response => response.json(), err => console.log(err))
            .do(data => {
                // console.log(data);
                this.storageService.setItem(StorageKey.TOKEN, data.access_token);
                this.storageService.setItem(StorageKey.USERNAME, data.UserName);
                this.storageService.setItem(StorageKey.EMAIL, data.email);
            })
            .catch(this.handleErrors);
    }

    logout() {
        this.post(null, 'logout', ApiPaths.ACCOUNT.BASE)
            .subscribe(
                res => {
                    this.clearStorage();
                    this.router.navigate([webPath(SCREEN.AUTH.LOGIN.PATH)]);
                },
                // geçersiz token olduğu zaman logout işlemi de 401 hatasına düşüyor.
                err => {
                    this.clearStorage();
                    this.router.navigate([webPath(SCREEN.AUTH.LOGIN.PATH)]);
                });
    }


    clearStorage() {
        this.storageService.removeItem(StorageKey.TOKEN);
        this.storageService.removeItem(StorageKey.USERNAME);
        this.storageService.removeItem(StorageKey.EMAIL);
    }
}