import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';

import { IRsHttpService, RsHttpService } from '../../../core/http/rs-http.service';
import { ApiPaths } from '../../../core/routing/index';
import { StorageService } from '../../../core/storage/storage.service';
import { EdiActionDto } from '../dto/edi-action';
import { RsRefType } from '../dto/enum';
import { Observable } from 'rxjs/Observable';

export class EdiActionParamsGet {
    code: string;
    name: string;
    isImport: boolean;
}

@Injectable()
export class EdiActionService extends RsHttpService implements IRsHttpService {
    constructor(
        http: Http,
        storageService: StorageService,
        messageService: MessageService,
        router: Router, public translate: TranslateService
    ) {
        super(http, storageService, messageService, router, translate);
        this.path = ApiPaths.EDI.ACTION;
    }

    getList(params: any): Observable<Array<EdiActionDto>> {

        return super.get(params).map(
            (res: EdiActionDto[]) => {
                for (let i = 0; i < res.length; i++) {
                    const el = res[i];
                    for (let j = 0; j < el.ediDataLinks.length; j++) {
                        const dataLink = el.ediDataLinks[j];
                        dataLink.refTypeName = RsRefType[dataLink.refType];
                    }
                }

                return res;
            }
        );

    }

    getById(id: string, apiPath?: string): Observable<any> {
        return super.getById(id, apiPath).map(
            (res: EdiActionDto) => {
                for (let j = 0; j < res.ediDataLinks.length; j++) {
                    const dataLink = res.ediDataLinks[j];
                    dataLink.refTypeName = RsRefType[dataLink.refType];
                }
                return res;
            }
        );
    }


}