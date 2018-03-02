import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { StorageService, StorageKey } from '../storage/index';
import { ApiPaths } from '../routing/api-path';
import { Router } from '@angular/router';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { MessageService } from 'primeng/components/common/messageservice';
// import { componentFactoryName } from '@angular/compiler';
import { TranslateService } from '@ngx-translate/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { environment } from '../../../../environments/environment';

import * as moment from 'moment';
import { SCREEN, webPath } from '../routing/screen';

export interface IRsHttpService {
    headerWithToken(): Headers;
    convertToUrlParams(prms: any): URLSearchParams;

    get(params: any, method?: string, apiPath?: string): Observable<Array<any>>;
    getById(id: string, apiPath?: string): Observable<any>;
    post(model: any, method?: string, apiPath?: string): Observable<Response>;
    put(model: any, method?: string, apiPath?: string): Observable<Response>;
    delete(id: string, method?: string, apiPath?: string): Observable<Response>;

}

@Injectable()
export class RsHttpService implements IRsHttpService {
    /**
     * Devir alınan üst serviste özelleştirilecek servis path yolu
     * Bu bilgi routing api-path altındaki sabitlerden alınacak
    */
    public path: string;

    /**
     * Türetilen servisin sistemden bağımsız olarak mock çalışmasını sağlar
     */
    public useMock: boolean;

    constructor(
        protected http: Http,
        protected storageService: StorageService,
        public messageService: MessageService,
        public router: Router,
        public translate: TranslateService
    ) {
        this.useMock = false;
    }

    // region TOOLS

    headerWithToken(): Headers {

        const headers = new Headers();
        headers.set('Authorization', 'bearer ' + this.storageService.getItem(StorageKey.TOKEN));
        headers.set('Content-Type', 'application/json');

        // console.log(headers);
        return headers;
    }

    convertToUrlParams(prms: any): URLSearchParams {
        const result = new URLSearchParams();
        if (!prms) {
            return result;
        }

        for (const key in prms) {
            if (prms[key] !== null && 'object' === typeof prms[key] && moment(prms[key]).isValid()) {
                const dateVal = moment(prms[key]).format('YYYY.MM.DD');
                result.set(key, dateVal);
            } else if (prms.hasOwnProperty(key)) {
                result.set(key, prms[key]);
            }
        }

        return result;
    }

    // endregion TOOLS

    // region HTTP

    get(params: any, method?: string, apiPath?: string): Observable<Array<any>> {
        const urlPath = (apiPath || this.path) + '/' + (method || 'get');

        return this.getUrl(params, urlPath);
    }

    getUrl(params: any, url: string): Observable<Array<any>> {
        const urlParams: URLSearchParams = this.convertToUrlParams(params);

        if (this.useMock || environment.useMockData) {
            console.log('Mock: GET');
            console.log(url);
            return this.http.get('assets/_mockdata/' + url + '.json')
                .map(
                    response => {
                        const allResult = <Array<any>>response.json();
                        return this.mockdataSearch(urlParams, allResult);
                    }
                )
                .catch(this.handleErrors);
        } else {
            return this.http.get(ApiPaths.API + url, { params: urlParams, headers: this.headerWithToken() })
                .map(
                    response => <Array<any>>response.json()
                )
                .catch(err => {
                    const result = this.handleErrors(err, this);
                    return result;
                });
        }
    }

    getById(id: string, apiPath?: string): Observable<any> {
        return this.get({ 'id': id }, 'GetByID', apiPath).map(
            res => {
                let result: any = null;
                if (res && res.length > 0) {
                    result = res[0];
                } else {
                    result = res;
                }
                return result;
            }
        );
    }

    post(model: any, method?: string, apiPath?: string): Observable<Response> {
        const urlPath = (apiPath || this.path) + '/' + (method || 'add');

        return this.postUrl(model, ApiPaths.API + urlPath);
    }

    postUrl(model: any, url: string): Observable<Response> {
        if (this.useMock || environment.useMockData) {
            return new EmptyObservable();
        } else {
            return this.http.post(url, model, { headers: this.headerWithToken() })
                .catch(err => {
                    return this.handleErrors(err, this);
                });
        }
    }

    put(model: any, method?: string, apiPath?: string): Observable<Response> {
        const urlPath = (apiPath || this.path) + '/' + (method || 'update');
        return this.putUrl(model, ApiPaths.API + urlPath);
    }

    putUrl(model: any, url: string): Observable<Response> {
        if (this.useMock || environment.useMockData) {
            return new EmptyObservable();
        } else {
            return this.http.put(url, model, { headers: this.headerWithToken() })
                .catch(err => {
                    const result = this.handleErrors(err, this);
                    return result;
                });
        }
    }

    delete(id: string, method?: string, apiPath?: string): Observable<Response> {
        const urlPath = (apiPath || this.path) + '/' + (method || 'delete');
        return this.deleteUrl(id, ApiPaths.API + urlPath);
    }

    deleteUrl(id: string, url: string): Observable<Response> {
        if (this.useMock || environment.useMockData) {
            return new EmptyObservable();
        } else {
            return this.http.delete(url + '?id=' + id, { headers: this.headerWithToken() })
                .catch(err => {
                    return this.handleErrors(err, this);
                });
        }
    }
    // endregion HTTP

    // region MOCK DATA

    public mockdataSearch(params?: URLSearchParams, list?: Array<any>): Array<any> {


        if (!params || !params.paramsMap) {
            return list;
        } else {
            const filteredResult = <Array<any>>[];
            for (let i = 0; i < list.length; i++) {
                const item = list[i];

                let isEqual = true;

                params.paramsMap.forEach((values, k) => {
                    if (item.hasOwnProperty(k)) {
                        const val1 = String(item[k]).toLowerCase();
                        const val2 = String(values[0]).toLowerCase();

                        if (val1.indexOf(val2) !== 0) {
                            isEqual = false;
                        }
                    }
                });

                if (isEqual) {
                    filteredResult.push(item);
                }

            }

            return filteredResult;
        }

    }

    public mockdataSearchWithObj(params?: any, list?: Array<any>): Array<any> {

        if (!params || !list) {
            return list;
        }

        const urlParams = this.convertToUrlParams(params);
        return this.mockdataSearch(urlParams, list);
    }

    // endregion MOCK DATA

    // region ERROR

    public handleErrors(error: Response, obj: any): ErrorObservable {
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


    // endregion ERROR
}