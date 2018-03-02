import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'rs-calendar',
    template: `

    <div *ngIf="!isInputField; else inputTemplate">
        <p-calendar
            [(ngModel)]="dateModel"
            [showIcon]="true"
            [showTime]="showTime"
            [locale]="currentLang"
            [showButtonBar]="true"
            [disabled]="disabled"
            [required]="required"
            (onSelect)="onSelect($event)"
            (onBlur)="onBlur($event)"
            dateFormat="{{'COMMON.DATE.PRIME_DATE_FORMAT' | translate}}"></p-calendar>
    </div>

<ng-template #inputTemplate>

    <span class="md-inputfield">
        <p-calendar
            [(ngModel)]="dateModel"
            [showIcon]="true"
            [showTime]="showTime"
            [locale]="currentLang"
            [showButtonBar]="true"
            [disabled]="disabled"
            [required]="required"
            (onSelect)="onSelect($event)"
            (onBlur)="onBlur($event)"
            dateFormat="{{'COMMON.DATE.PRIME_DATE_FORMAT' | translate}}"></p-calendar>
        <label>{{label | translate}}</label>
    </span>

</ng-template>

    `
})

export class RsCalendarComponent implements OnInit {

    // Görünümünün inputField (Material Design tarzı) mı yoksa
    // normal tek giriş şeklinde mi olacağı bilgisi
    @Input() isInputField: boolean = true;

    @Input() showTime: boolean = false;

    @Input() disabled: boolean = false;

    @Input() required: boolean = false;

    @Input() label: string = 'COMMON.DATE.DATE';

    // region @Input() model

    dateModel: Date;

    @Output() modelChange = new EventEmitter();
    private _modelVal: Date;
    @Input()
    get model(): Date {
        return this._modelVal;
    }

    set model(val: Date) {
        this._modelVal = val;
        this.dateModel = val; // moment(val).toDate();
        this.modelChange.emit(this._modelVal);
    }

    // endregion -- MODEL --



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
    currentLang: any;


    constructor(
        private translate: TranslateService,
    ) {
    }

    ngOnInit() {
        this.setLang().then(
            () => {
                if (this.model) {
                    this.dateModel = moment(this.model).toDate();
                }
            }
        );
    }

    async setLang() {
        const lang = await this.translate.get('COMMON.DATE').toPromise();
        const currentPrimeLangKey = lang["PRIME_LANG"];
        this.currentLang = this.locale[currentPrimeLangKey];
    }

    // Listeden seçim yapıldığında dışarıdan gelen model değeri güncellenir.
    onSelect(event: Date) {
        // Time zone dan kaynaklanan problem giderildi.
        // TODO: Farklı bir çözüm varmı kontrol et.
        if (event) {
            this.model = new Date(event.valueOf() - event.getTimezoneOffset() * 60000);
        }
    }

    onBlur(event) {
        // Time zone dan kaynaklanan problem giderildi.
        if (this.dateModel) {
            this.model = new Date(this.dateModel.valueOf() - this.dateModel.getTimezoneOffset() * 60000);
        }
    }
}