import { Directive, OnInit, Host, Self, Optional, NgModule } from '@angular/core';
import { Calendar } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { StorageService, StorageKey } from '../storage/index';

// tslint:disable-next-line:directive-selector
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[rsCalendar]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
    }
})
export class RsCalendarDirective implements OnInit {

    currentLang: any;
    locale = {
        tr: {
            firstDayOfWeek: 1,
            dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
            dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
            dayNamesMin: ["Pa", "Pz", "Sa", "Ca", "Pe", "Cu", "Cm"],
            monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz",
                "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
            monthNamesShort: ["Oca", "Sub", "Mar", "Nis", "May", "Haz", "Tem", "Aug", "Eyl", "Ekm", "Kas", "Ara"],
            today: 'Bugün',
            clear: 'Temizle'
        },
        en: {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: 'Today',
            clear: 'Clear'
        }
    };

    dateFormat = {
        tr: 'dd.mm.yy',
        en: 'mm.dd.yy'
    };


    constructor(
        @Host() @Self() @Optional() public hostCalendar: Calendar,
        private translate: TranslateService,
        private storageService: StorageService
    ) {
        const lang = storageService.getItem(StorageKey.LANG);

        if (this.hostCalendar) {
            this.hostCalendar.showIcon = true;
            this.hostCalendar.showButtonBar = true;
            this.hostCalendar.locale = this.locale[lang];
            this.hostCalendar.dateFormat = this.dateFormat[lang];
        }
    }

    ngOnInit() {

    }
}

@NgModule({
    imports: [CommonModule],
    exports: [RsCalendarDirective],
    declarations: [RsCalendarDirective]
})
export class RsCalendarModule { }