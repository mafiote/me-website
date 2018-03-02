import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

import { StorageKey, StorageService } from '../../../../../core/storage';
import { RsSimpleListComponent } from '../../../../_base/components/index';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormBuilder } from '@angular/forms';
import { getFormFilledValues, isDate } from '../../../../../core/lib/form';
import { NotificationService } from '../../../../auth/services';
import { MyNotificationsDto } from '../../../dto/notificationDto';

@Component({
    selector: 'sys-notification-list',
    templateUrl: 'sys-notification-list.component.html',
    styles: [
        `
        .rs-list-filter-container>div {
            margin-right: 10px;
        }

        @media (max-width: 1330px) {
            #code-filter {
                margin-bottom: 22px;
            }
        }

        `
    ]
})

export class SysNotificationListComponent
    extends RsSimpleListComponent<MyNotificationsDto, NotificationService>
    implements OnInit {

    previewMod: boolean = false;
    notificationList: any[] = [];

    constructor(
        protected translate: TranslateService,
        protected http: Http,
        protected service: NotificationService,
        public storageService: StorageService,
        private messageService: MessageService,
        public fb: FormBuilder
    ) {
        super(translate, http, service, fb);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    rowDblClick(event) {
        super.editRecord(event.data);
    }

    getList() {

        this.service.getMyNotification().subscribe(
            res => {
                this.translate.get('NOTIFICATION.CODES').subscribe((lang: any) => {
                    this.notificationList = res;
                    if (res.length !== 0) {
                        const messageCode = this.parseNotificationData(this.notificationList[0].notificationMessage);
                        this.notificationList[0].notificationMessage = lang[messageCode[0]];
                    }
                });
                for (let i = 0; i < this.notificationList.length; i++) {
                    this.notificationList[i].passingTime = this.calcPassingTime(this.notificationList[i].notificationSendDate);
                }
            },
            err => console.log(err)
        );

    }

    calcPassingTime(date) {
        const __startTime = moment(date).format();
        const __endTime = moment(new Date()).format();

        const __duration = moment.duration(moment(__endTime).diff(__startTime));
        const __hours = __duration.asHours();
        switch (true) {
            case (__hours > 0 && __hours <= 0.035):
                return "Şimdi";
            case (__hours > 0.035 && __hours < 1):
                return Math.floor(__hours * 60) + " dakika önce";
            case (__hours >= 1 && __hours < 24):
                return Math.floor(__hours) + " saat önce";
            default:
                const monthMinusOneName = moment(__startTime).locale('tr').subtract(0, "month").startOf("month").format('MMMM');
                return moment(__startTime).format("DD") + " " + monthMinusOneName;
        }


    }

    parseNotificationData(notificationData?: string) {
        if (notificationData === "") {
            return [];
        } else {
            return notificationData.split("#");
        }
    }

}