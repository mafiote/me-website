/**
 * Kod alanı bulunan ekranlar için otomatik kod mekaniği barındıran
 * simple form componenti
 */
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';

import { RsHttpService } from '../../../../core/http';
import { AutocodeService } from '../../../sys/services';
import { BaseCodeDto } from '../../dto/baseDto';
import { RsSimpleCardComponent } from './simple-card.component';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'rs-simple-card-code',
    template: ``
})

export class RsSimpleCardCodeComponent<
    D extends BaseCodeDto,
    S extends RsHttpService> extends RsSimpleCardComponent<D, S>
    implements OnInit {

    /** Eğer autocode ilgili ekranda pasif edilmek istenirse bu değişken ezilecek. */
    useAutoCode: boolean = true;

    constructor(
        protected messageService: MessageService,
        protected confirmationService: ConfirmationService,
        public autocodeService: AutocodeService,
        protected translate: TranslateService,
        @Inject(RsHttpService) protected service: S,
        public fb: FormBuilder
    ) {
        super(messageService, confirmationService, translate, service, fb);
    }

    ngOnInit() {
        super.ngOnInit();
        this.checkAutoCode();
    }

    /** Otomatik Kod sistemi aktif ise sıradaki kodu getrir */
    checkAutoCode() {
        // AutoCode sadece yeni kayıtta çalışacak
        if (!this._isNew || !this.useAutoCode || !this.screenCode) {
            return;
        }

        this.autocodeService.autoCodeGenerate({ screenCode: this.screenCode })
            .subscribe((res: string) => {
                if (res) {
                    this.form.get('code').setValue(res);
                    // TODO: Valitaditon yaygınlaştırıldığında kaldırılcak.
                    this.rec.code = res;
                } else {
                    // Ekran için atanmış bir otomatik kod yoksa manuel girişe aç
                    this.useAutoCode = false;
                    this.rec.code = "";
                }
            });
    }
}