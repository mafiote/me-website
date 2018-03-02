import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';

import { IRsHttpService, RsHttpService } from '../../../core/http/rs-http.service';
import { ApiPaths } from '../../../core/routing';
import { StorageService } from '../../../core/storage/storage.service';

export class RoleGetFilterDto {
    code: string;
    personnelID: string;
    identityRoleID: string;
}

@Injectable()
export class SysRoleService extends RsHttpService implements IRsHttpService {
    constructor(
        http: Http,
        storageService: StorageService,
        messageService: MessageService,
        router: Router, public translate: TranslateService
    ) {
        super(http, storageService, messageService, router, translate);

        this.path = ApiPaths.SYS.ROLE_GROUP;
    }

}