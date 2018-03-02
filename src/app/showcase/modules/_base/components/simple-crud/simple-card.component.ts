import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService, MenuItem } from 'primeng/primeng';

import { RsHttpService } from '../../../../core/http/rs-http.service';
import { BaseDto } from '../../dto/baseDto';
import { FormGroup, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { getFormValidationErrors, AllValidationErrors } from '../../../../core/lib/form';


@Component({
    selector: 'rs-simple-card',
    template: ``
})

export class RsSimpleCardComponent<
    D extends BaseDto,
    S extends RsHttpService> implements OnInit {

    form: FormGroup;
    /**
     * Kaydetme vb. bir işlem esnasında kullanılır.
     * İkinci kez işlem başlatılamaması için işlem başlangıcında kontrol edilir.
     */
    inProgress: boolean = false;

    /**
     * Kart ekranı saltokunur olarak açıldığında bu değişken true atılır.
     * Kaydet butonu iptal edilir. Cancel ile çıkışta uyarı verilmez.
     */
    isReadonly: boolean = false;

    @Input() rec: D;
    @Output() onSave = new EventEmitter<D>();
    @Output() onCancel = new EventEmitter<any>();
    @Output() onDel = new EventEmitter<any>();

    /** üzerinde olduğumuz ekran kodu */
    screenCode: string;

    _isNew: boolean;
    menuItems: MenuItem[];


    constructor(
        protected messageService: MessageService,
        protected confirmationService: ConfirmationService,
        protected translate: TranslateService,
        @Inject(RsHttpService) protected service: S,
        public fb: FormBuilder
    ) {
        this.setScreenCode();
    }

    ngOnInit() {

        if (this.rec) {
            this._isNew = false;
        } else {
            this._isNew = true;
            this.rec = this.newRecord();
        }

        this.buildForm(this.rec);
    }


    onSubmit() {
        if (this.form.valid) {
            this.prepareSaveDto();
            this.save();
        }
    }

    getValidationErrors(): AllValidationErrors[] {
        return getFormValidationErrors(this.form.controls);
    }

    buildForm(model: D) {
        // TODO: alan tiplerini algılayarak atama yapmayı dene
    }

    prepareSaveDto() {
        // TODO: alan tiplerini algılayarak atama yapmayı dene
    }

    async save() {
        try {
            if (this.inProgress) {
                return;
            }
            this.inProgress = true;

            let result: Response;
            if (this._isNew) {
                result = await this.service.post(this.rec).toPromise();
            } else {
                result = await this.service.put(this.rec).toPromise();
            }

            if (result.ok) {
                const resultObj = JSON.parse(result.text());
                this._isNew = false;
                // Form nesnesinin üzerindeki flagları temizliyoruz.
                this.form.markAsUntouched();
                this.form.markAsPristine();
                const res = await this.service.getById(resultObj.data).toPromise();
                this.rec = res;
                this.inProgress = false;
                this.buildForm(this.rec);
                this.onSave.emit(this.rec);
            } else {
                this.inProgress = false;
                this.translate.get('COMMON.MSG').subscribe((lang: any) => {
                    this.messageService.add({ severity: 'error', summary: lang.SEVERITY.ERROR, detail: lang.E_SAVE_001 });
                });
            }

        } catch (error) {
            console.log(error);
            this.inProgress = false;
        }
    }

    cancel() {
        if (this.form.pristine) {
            this.onCancel.emit(null);
        } else {
            this.translate.get('COMMON.DIALOG.CONFIRM_CANCEL').subscribe((lang: any) => {
                this.confirmationService.confirm({
                    key: "cdCancel",
                    message: lang.TEXT,
                    accept: () => {
                        this.onCancel.emit(null);
                    }
                });
            });
        }
    }

    async del() {

        if (this._isNew) {
            this.onCancel.emit(null);
            return;
        }

        const langDelete = await this.translate.get('COMMON.DIALOG.CONFIRM_DELETE').toPromise();

        this.confirmationService.confirm({
            key: "cdDelete",
            message: langDelete.TEXT,
            accept: () => {
                this.service.delete(this.rec.id).subscribe(
                    (res) => {
                        this.onDel.emit(this.rec.id);
                    },
                    (err) => {
                        this.translate.get('COMMON.MSG').subscribe((lang: any) => {
                            this.messageService.add({ severity: 'error', summary: lang.SEVERITY.ERROR, detail: lang.E_DEL_001 });
                        });
                    }
                );
            }
        });
    }

    /** rec objesine gerçek Dto create edilecek */
    newRecord(): any {
        return {};
    }

    /** üzerinde çalıştığımız ekran kodu atanacak */
    setScreenCode(): void {

    }

}