
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService, SelectItem } from 'primeng/primeng';

import { RsAutoCompleteItem } from '../../../../../core/http';
import { SCREEN } from '../../../../../core/routing/screen';
import { StorageService } from '../../../../../core/storage';
import { RsSimpleCardCodeComponent } from '../../../../_base/components/index';
import { AutocodeService } from '../../../../sys/services/index';
import { EdiActionDetailDto, EdiActionDto, EdiDataLinkDto } from '../../../dto/edi-action';
import { GetRefTypeApiPath, REFTYPE_ENUM_AC, RsRefType } from '../../../dto/enum';
import { EdiActionService } from '../../../services/edi-action.service';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'edi-action-card',
    templateUrl: 'edi-action-card.component.html',
    styles: [
        `
            .form-container {
                padding: 0px !important;
            }
            .form-container>* {
                padding: 1.2em 5px;
            }
        `
    ]
})

export class EdiActionCardComponent
    extends RsSimpleCardCodeComponent<EdiActionDto, EdiActionService>
    implements OnInit {

    isImportItems: SelectItem[];
    refTypeEnum = REFTYPE_ENUM_AC;

    constructor(
        protected messageService: MessageService,
        protected confirmationService: ConfirmationService,
        protected translate: TranslateService,
        protected service: EdiActionService,
        public storageService: StorageService,
        public autocodeService: AutocodeService,
        public fb: FormBuilder
    ) {
        super(messageService, confirmationService, autocodeService, translate, service, fb);

        this.isImportItems = [];
        this.isImportItems.push({ label: 'Import', value: true });
        this.isImportItems.push({ label: 'Export', value: false });
    }

    ngOnInit() {
        super.ngOnInit();
    }

    newRecord(): any {
        return new EdiActionDto();
    }

    setScreenCode(): void {
        this.screenCode = SCREEN.EDI.ACTION.CODE;
    }

    addDetail() {
        this.rec.ediActionDetails = this.rec.ediActionDetails || [];

        const newDetail = new EdiActionDetailDto();
        newDetail.apiPath = "";
        newDetail.code = `${this.rec.code}-${this.rec.ediActionDetails.length + 1}`;
        newDetail.desc = "";
        newDetail.isDeleted = false;
        newDetail.name = "";
        newDetail.orderNum = this.rec.ediActionDetails.length + 1;
        newDetail.params = null;

        this.rec.ediActionDetails = [...this.rec.ediActionDetails, newDetail];
    }

    addDataLink() {
        const newDataLink = new EdiDataLinkDto();
        newDataLink.ediData = "";
        newDataLink.isDeleted = false;
        newDataLink.refID = null;
        newDataLink.refName = "";
        newDataLink.refType = null;
        newDataLink.refTypeApiPath = null;
        newDataLink.refTypeName = "";

        this.rec.ediDataLinks = this.rec.ediDataLinks || [];
        this.rec.ediDataLinks = [...this.rec.ediDataLinks, newDataLink];
    }

    getDeletedRecsClass(rowData) {
        return rowData.isDeleted ? 'rs-deleted-row' : '';
    }

    onRefTypeSelected(model: EdiDataLinkDto, event) {
        model.refTypeName = RsRefType[event.id];
        model.refTypeApiPath = GetRefTypeApiPath(event.id);
    }

    onRefIdSelected(model: EdiDataLinkDto, event) {
        model.refName = event.text;
    }

}