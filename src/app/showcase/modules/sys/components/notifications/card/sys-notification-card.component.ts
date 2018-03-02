// import { Component, OnInit, Input } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
// import { TranslateService } from '@ngx-translate/core';
// import { MessageService } from 'primeng/components/common/messageservice';
// import { ConfirmationService } from 'primeng/primeng';

// import { SCREEN } from '../../../../../core/routing/screen';
// import { StorageService } from '../../../../../core/storage';
// import { RsSimpleCardComponent } from '../../../../_base/components';
// import { DepartmentService } from '../../../../pd/services';
// import { MachineLineService, MaterialService } from '../../../../prd/services';
// import { ManuelCostDto } from '../../../dto/manuel-cost';
// import { LosttimeDetailService } from '../../../services';
// import { CMatrixManuelCostService } from '../../../services/manuel-cost.service';
// import { RsValidators } from '../../../../../core/lib/form';

// @Component({
//     selector: 'cd-manuel-cost-card',
//     templateUrl: 'manuel-cost-card.component.html',
//     styles: [
//         `

//         `
//     ]
// })

// export class CdManuelCostCardComponent
//     extends RsSimpleCardComponent<ManuelCostDto, CMatrixManuelCostService>
//     implements OnInit {

//     @Input() previewMod: boolean = false;
//     constructor(
//         protected messageService: MessageService,
//         protected confirmationService: ConfirmationService,
//         protected translate: TranslateService,
//         protected service: CMatrixManuelCostService,
//         public fb: FormBuilder
//     ) {
//         super(messageService, confirmationService, translate, service, fb);
//     }

//     ngOnInit() {
//         super.ngOnInit();
//         if (this.previewMod) {
//             this.form.disable();
//         }
//     }

//     buildForm(model: ManuelCostDto) {
//         this.form = this.fb.group({
//             date: [model.date ? new Date(model.date) : new Date()],
//             cdLostTimeDetailID: [{ id: model.cdLostTimeDetailID, text: model.cdLostTimeDetailName },
//             [RsValidators.requiredAutoComplete("CD.LOSTTIME_DETAIL.TITLE")]],
//             pdDepartmentID: [{ id: model.pdDepartmentID, text: model.pdDepartmentName },
//             [RsValidators.requiredAutoComplete("PD.DEPARTMENT.TITLE")]],
//             prdMachineLineID: [{ id: model.prdMachineLineID, text: model.prdMachineLineName }],
//             targetDepartmentID: [{ id: model.targetDepartmentID, text: model.targetDepartmentName }],
//             laborTime: [model.laborTime],
//             prdMaterialID: [{ id: model.prdMaterialID, text: model.prdMaterialName }],
//             desc: [model.desc]
//         });
//     }

//     prepareSaveDto() {
//         const formValue = this.form.value;

//         // Uupdate'de tarih alanı BE almadığı için if (this._isNew) kullanıldı.
//         if (this._isNew) {
//             this.rec.date = new Date(formValue.date).rsWithTimeZone();
//         }

//         this.rec.cdLostTimeDetailID = (formValue.cdLostTimeDetailID || {})['id'];
//         this.rec.pdDepartmentID = (formValue.pdDepartmentID || {})['id'];
//         this.rec.prdMachineLineID = (formValue.prdMachineLineID || {})['id'];
//         this.rec.targetDepartmentID = (formValue.targetDepartmentID || {})['id'];
//         this.rec.prdMaterialID = (formValue.prdMaterialID || {})['id'];
//         this.rec.laborTime = +formValue.laborTime;
//         this.rec.desc = formValue.desc;

//         // Listeyi doğru güncelleyebilmesi için Name alanları dolduruluyor.
//         this.rec.cdLostTimeDetailName = formValue.cdLostTimeDetailID['text'];
//         this.rec.pdDepartmentName = formValue.pdDepartmentID['text'];
//         this.rec.prdMachineLineName = formValue.prdMachineLineID['text'];
//         this.rec.targetDepartmentName = formValue.targetDepartmentID['text'];
//         this.rec.prdMaterialName = formValue.prdMaterialID['text'];
//     }

//     newRecord(): any {
//         return new ManuelCostDto();
//     }

//     setScreenCode(): void {
//         this.screenCode = SCREEN.CD.MANUEL_COST.CODE;
//     }
// }