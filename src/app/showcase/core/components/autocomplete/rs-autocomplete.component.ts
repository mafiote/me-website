import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { RsHttpAutoCompleteService, RsAutoCompleteItem, IRsAutoCompleteItem } from "../../http/rs-http-autocomplete.service";
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

/* tslint:disable no-access-missing-member */
@Component({
    selector: 'rs-autoComplete',
    template: `

    <div *ngIf="!isInputField; else inputTemplate">
        <p-autoComplete
            [(ngModel)]='selectedItem'
            [suggestions]='suggestions'
            (completeMethod)='filter($event)'
            (onSelect) = 'onSelect()'
            [dropdown]="isDropdown"
            [readonly]="isReadonly"
            field='{{displayFieldName}}'
            placeholder='{{label}}'
            [disabled]="disabled"
            (onClear)="clearField()"
            [required]="required"
            [inputId]="name"
            [minLength]='minLength'></p-autoComplete>
    </div>

    <ng-template #inputTemplate>
        <span class="md-inputfield">
            <p-autoComplete
                [(ngModel)]='selectedItem'
                [suggestions]='suggestions'
                (completeMethod)='filter($event)'
                (onSelect) = 'onSelect()'
                field='{{displayFieldName}}'
                [class.ui-inputwrapper-filled]="selectedItem"
                (onClear)="clearField()"
                [dropdown]="isDropdown"
                [readonly]="isReadonly"
                [disabled]="disabled"
                [required]="required"
                [inputId]="name"
                [minLength]='minLength'></p-autoComplete>
            <label>{{label}}</label>
        </span>
    </ng-template>

    `
})

export class RsAutoCompleteComponent implements OnInit, AfterViewInit {

    @Output() onSelected = new EventEmitter();

    // Eğer liste olarak enum kullanılacaksa bu değişken kullnılır
    // ngInit üzerinde bu değişken dolu ise dataList e yüklenir.
    @Input() enum: {
        enumObj: any,
        langKey: string
    };


    // Bizim ngModel objemiz, id değerini alıp geri döndürür
    // sadece [(model)]="obj" şeklinde kullanılır
    private _firstValSetted: boolean = false;

    private _modelVal: string;
    @Output() modelChange = new EventEmitter();

    @Input()
    get model(): string {
        return this._modelVal;
    }

    set model(val: string) {
        const valIsNull = this._modelVal == null;

        this._modelVal = val;
        this.modelChange.emit(this._modelVal);

        if (valIsNull && val && !this._firstValSetted) {
            this._firstValSetted = true;
            this.enumCheck().then(
                () => {
                    if (this._modelVal) {
                        this.setDefaultObject(this._modelVal);
                    }
                }
            );
        }

    }
    // -------------

    // Sayfa yüklenirken dolu bir değer ile autocomplete çağırılmak istendiğinde
    // eğer autocomplete e yüklenen id değeri ile name, code gibi text değeri de
    // biliniyorsa tekrar sorgu atmadan seçilen objenin text değeri olarak atamak için kullanılır.
    // Bu değer boş ise ve id değeri dolu ise ngInit te sorgu ile bu değer bulunur.
    @Input() defaultText: string;

    /** Objeyi değiştirilemez kılar */
    @Input() disabled: boolean = false;

    @Input() name: string = "";

    /** Bu alanın girişini zorunlu kılar */
    @Input() required: boolean = false;

    // Görünümünün inputField (Material Design tarzı) mı yoksa
    // normal tek giriş şeklinde mi olacağı bilgisi
    @Input() isInputField: boolean = true;

    // kullanıcıya gösterilecek bilgi. Translate edilerek atılmalı
    @Input() label: string;

    // Kullanıcıya gösterilecek alan adı
    @Input() displayFieldName: string = "text";

    // Aramaya başlayacağı karakter sayısı
    @Input() minLength = 1;

    // Autocomplete in çalışacağı Api Adresi yazılır.
    @Input() apiPath: string = "";

    @Input() apiMethod: string = "AutoCompleteList";

    // Sürekli API isteği göndermesini istemediğimiz kısa listelerde kullanılır.
    // Eğer dataList objesi atanmışsa apiPath ataması geçersiz sayılır.
    @Input() dataList: RsAutoCompleteItem[] = null;

    // Component Dropdown Görünümünde olması için gonderilen boolean değerdir,
    //  [isDropdown]="false" şeklinde kullanılabilir
    @Input() isDropdown: boolean = false;

    // Dropdown modunda sadece seçime izin vermesi yada disable tarzı kullanım için kullanılabilir.
    @Input() isReadonly: boolean = false;

    // arama yapılırken ayrıca parametre gönderilmek isteniyorsa
    // dışarıdan doldurularak gönderilecek. Örn: Takım listelenirken Bölüm Id değerinin alınması
    // normal Json obje olarak gönderilir, içeride UrlParametreye çevrilerek servise gönderilir.
    // Örn: { 'depId': 'sffsf' }
    @Input() searchParams: any = {};

    selectedItem: RsAutoCompleteItem;
    suggestions: RsAutoCompleteItem[];

    // Create
    // ----------------
    constructor(
        private translate: TranslateService,
        private rsAutocompleteService: RsHttpAutoCompleteService
    ) {
    }

    ngOnInit() {
        // ilk değer atanmaması durumunda component yüklendikten sonra liste oluşturulur.
        if (this.enum && (this.dataList == null || this.dataList.length === 0)) {
            this.enumCheck();
        }
    }

    ngAfterViewInit(): void {

    }

    // ----------------


    async enumCheck() {
        if (!this.enum || !this.enum.enumObj) {
            return;
        }

        const enumObj = this.enum.enumObj;
        const langKey = this.enum.langKey;


        let keys = Object.keys(enumObj);
        keys = keys.slice(keys.length / 2);

        const lang = await this.translate.get('ENUM.' + langKey).toPromise();

        this.dataList = [];
        for (let i = 0; i < keys.length; i++) {
            if (enumObj.hasOwnProperty(keys[i])) {
                const element = enumObj[keys[i]];

                this.dataList.push(
                    new RsAutoCompleteItem(element, lang[keys[i]])
                );
            }
        }

    }

    // Listeden seçim yapıldığında dışarıdan gelen model değeri güncellenir.
    onSelect() {
        this.model = this.selectedItem.id;

        this.onSelected.emit(this.selectedItem);
    }

    // dropdown seçimi, önce query temizleniyor
    onDropdownClick() {
        this.filter({ query: "" });
    }

    // Temel arama fonksiyonu, her arama öncesi liste temizlenir.
    filter(event) {
        if (this.dataList && this.dataList.length > 0) {
            this.suggestions = this.searchLocal(event.query.toLowerCase());
        } else {
            this.searchAPIAsync(event.query.toLowerCase()).subscribe(
                res => {
                    this.suggestions = [...res];
                },
                err => console.log(err)
            );
        }
    }

    // Search eğer boş olursa seçili datanın temizlenmesi burada olacak
    clearField() {
        this.model = null;
        // this._modelVal = null;
        // this.selectedItem = <RsAutoCompleteItem>{};
    }

    // Id değeri ile sorgulanarak text değeri elde edilmek için kullanılır.
    // Kullanım yeri ngInit te dışarıdan Id değeri var ise text değerini elde etmektir.
    setDefaultObject(firstVal: string): string {
        // if (this.enum) {
        //     this.enumCheck();
        // }

        if (!firstVal) {
            return;
        }

        if (this.defaultText && this.defaultText !== "") {
            this.selectedItem = new RsAutoCompleteItem(firstVal, this.defaultText);
            return;
        }

        // Geçici parametre oluşturuluyor
        this.searchParams["id"] = firstVal;

        if (this.dataList && this.dataList.length > 0) {
            const res = this.searchLocal("");

            if (res && res[0]) {
                this.selectedItem = new RsAutoCompleteItem(firstVal, res[0].text);
            }

        } else {
            this.searchAPIAsync("").subscribe(
                res => {
                    if (res && res[0]) {
                        this.selectedItem = new RsAutoCompleteItem(firstVal, res[0].text);
                    }
                },
                err => console.log(err)
            );
        }

        // Sonraki sorgulamaları etkilememesi için parametre kaldırılıyor.
        delete this.searchParams["id"];

    }

    // Lokal arama
    // this.dataList dolu olmalıdır.
    private searchLocal(query: string): Array<IRsAutoCompleteItem> {
        if (!this.dataList) {
            return;
        }

        // console.log(query);
        this.prepareFilter(query);
        // tslint:disable-next-line:max-line-length
        const filteredResult = <Array<RsAutoCompleteItem>>this.rsAutocompleteService.mockdataSearchWithObj(this.searchParams, this.dataList);

        return filteredResult;
    }

    // API üzerinden arama
    // this.dataList objesinin boş olması ve this.apiPath objesinin dolu olması gerekir.
    private searchAPIAsync(query: string): Observable<Array<IRsAutoCompleteItem>> {
        if (!this.apiPath) {
            return;
        }

        this.prepareFilter(query);

        return this.rsAutocompleteService.getACList(this.apiPath, this.searchParams, this.apiMethod);
    }

    private prepareFilter(query: string) {

        // let params = this.getParams(query);
        this.searchParams = this.searchParams || {};
        if (query && query !== "") {
            this.searchParams.text = query;
        } else {
            if (this.searchParams.text) {
                delete this.searchParams.text;
            }
        }
    }



}