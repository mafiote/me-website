import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { SCREEN, webPath } from '../routing/screen';

import { Injectable } from '@angular/core';
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';
import { StorageService, StorageKey } from '../storage/index';
import { ApiPaths } from '../routing/index';


export class RsFileGetInfo {
    id: string;
    originalName: string;
    extension: string;
    size: number;

    inProgress: boolean;

    constructor() {
        this.id = null;
        this.originalName = '';
        this.extension = '';
        this.size = 0;
        this.inProgress = false;
    }
}


export interface IRsFileService {
    download(id: string);
    upload(refID: string, screenCode: string, file: any): Observable<Response>;
}

@Injectable()
export class RsFileService implements IRsFileService {

    public path: string;

    constructor(
        private http: Http,
        private storageService: StorageService
    ) {
        this.path = ApiPaths.SYS.FILE;
    }

    private headerWithToken(): Headers {
        const headers = new Headers();
        headers.set('Authorization', 'bearer ' + this.storageService.getItem(StorageKey.TOKEN));
        return headers;
    }

    private handleErrors(error: Response, obj: any): ErrorObservable {
        const errData = error.json();
        if (error.status === 401) {
            obj.router.navigate([webPath(SCREEN.AUTH.LOGIN.PATH)]);
            obj.translate.get('COMMON.DIALOG').subscribe((lang: any) => {
                obj.messageService.add({ severity: 'warn', summary: lang.SEVERITY.WARN, detail: lang.AUTHORIZATION.LOGOUT });
                return Observable.throw(error.json());
            });
        } else if (errData.message) {
            obj.translate.get('COMMON.MSG').subscribe((lang: any) => {
                obj.messageService.add({ severity: 'error', summary: lang.SEVERITY.ERROR, detail: lang[errData.message] });
                return Observable.throw(error.json());
            });

        } else {
            console.log(errData);
        }
        return Observable.throw(error.json());
    }

    download(id: string): Observable<any> {
        const url = ApiPaths.API + this.path + '/Download?id=' + id;
        return this.http.get(url, {
            headers: this.headerWithToken(),
            responseType: ResponseContentType.ArrayBuffer
        }).map(res => res.blob())
            .catch(err => {
                return this.handleErrors(err, this);
            });
    }

    upload(refID: string, screenCode: string, file: any): Observable<Response> {
        const model = new FormData();
        model.append('file', file, file.name);

        const url = ApiPaths.API + this.path + '/Upload?refID=' + refID + '&screenCode=' + screenCode;
        return this.http.post(url, model, { headers: this.headerWithToken() })
            .catch(err => {
                return this.handleErrors(err, this);
            });
    }

    get(refID: string, screenCode: string): Observable<Array<RsFileGetInfo>> {
        const url = ApiPaths.API + this.path + '/Get?refID=' + refID + '&screenCode=' + screenCode;
        return this.http.get(url, { headers: this.headerWithToken() }).map(
            (res) => <Array<RsFileGetInfo>>res.json()
        );
    }

    del(id: string): Observable<any> {
        const url = ApiPaths.API + this.path + '/Delete?id=' + id;
        return this.http.delete(url, { headers: this.headerWithToken() })
            .catch(err => {
                return this.handleErrors(err, this);
            });
    }

}