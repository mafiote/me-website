import { Injectable, transition } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Services
import { StorageService } from '../../../core/storage/storage.service';
import { ApiPaths } from '../../../core/routing/index';
import { RsHttpService, IRsHttpService } from '../../../core/http/rs-http.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class NotificationService extends RsHttpService implements IRsHttpService {
    constructor(
        http: Http,
        storageService: StorageService,
        messageService : MessageService,
        public router  : Router, public translate : TranslateService
    ) {
        super(http, storageService, messageService, router , translate);
        this.path = ApiPaths.NOTIFICATION.BASE;
    }

    getMyNotification() {
        return this.get(null, 'MyNotificationList');
    }

}