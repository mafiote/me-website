import { Component } from '@angular/core';
import { FullLayoutComponent } from '../full-layout.component';
import { AuthService } from '../../../modules/auth/services/index';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../modules/auth/services/notification.service';
import * as moment from 'moment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { StorageService, StorageKey } from '../../../core/storage/index';
import { SignalR, SignalRModule, IConnectionOptions, BroadcastEventListener } from 'ng2-signalr';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})

export class AppTopBarComponent {

    currentPage: string = 'C Matris';

    // TODO DTO Eklenecek
    notificationList: any[] = [];
    constructor(
        public app: FullLayoutComponent,
        private authService: AuthService,
        private translate: TranslateService,
        private notificationService: NotificationService,
        private router: Router,
        private storageService: StorageService,
        private _signalR: SignalR
    ) {
        router.events.forEach((event) => {
            if (event instanceof NavigationEnd) {
                const tempIndex = event.url.indexOf(';');
                if (tempIndex > 0) {
                    this.currentPage = event.url.slice(0, tempIndex);
                } else {
                    this.currentPage = event.url;
                }

            }
        });
        // this.connect();

        // this._signalR.connect();
        const conx = this._signalR.createConnection();
        conx.start().then((c) => {
            console.log(c);
            conx.status.subscribe((s) => console.warn(s.name));
            const onNotificationSent$ = new BroadcastEventListener('SendMessage');
            conx.listen(onNotificationSent$);
            onNotificationSent$.subscribe((notificationMessage: any) => {
                console.log(notificationMessage);
            });
            this.getNote();
        });
    }

    logout() {
        this.authService.logout();
    }

    changeLang(lang) {
        this.storageService.setItem(StorageKey.LANG, lang);
        this.translate.use(lang);
    }

    getNote() {

        this.notificationService.getMyNotification().subscribe(
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

    seenNote(id) {
        // console.log(temp);
        this.notificationService.put({ id: id }).subscribe(
            res => {
                // console.log(res);
                this.getNote();
            }
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
        }
        else {
            return notificationData.split("#");
        }
    }
}
