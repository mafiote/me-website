import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

import { StorageKey, StorageService } from '../../../../../core/storage';
import { RsSimpleListComponent } from '../../../../_base/components/index';
import { SysRoleDto } from '../../../dto/role';
import { MessageService } from 'primeng/components/common/messageservice';
import { SysRoleService, RoleGetFilterDto } from '../../../services/role.service';
import { FormBuilder } from '@angular/forms';
import { isDate, getFormFilledValues } from '../../../../../core/lib/form';

@Component({
    selector: 'sys-role-list',
    templateUrl: 'role-list.component.html',
    styles: [
        `

        `
    ]
})

export class SysRoleListComponent
    extends RsSimpleListComponent<SysRoleDto, SysRoleService>
    implements OnInit {

    filter: RoleGetFilterDto;

    constructor(
        protected translate: TranslateService,
        protected http: Http,
        protected service: SysRoleService,
        public storageService: StorageService,
        private messageService: MessageService,
        public fb: FormBuilder
    ) {
        super(translate, http, service, fb);
        this.filter = new RoleGetFilterDto();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    rowDblClick(event) {
        super.editRecord(event.data);
    }

    getList() {
        super.getList();
    }

    buildFilterForm() {
        const now = new Date();

        this.filterForm = this.fb.group({
            code: [null],
            personnelID: [{ id: null, text: null }],
            identityRoleID: [{ id: null, text: null }]
        });

        this.filterFormLabels = {
            code: "COMMON.FIELD.CODE",
            personnelID: "PD.PERSONNEL.TITLE",
            identityRoleID: "SYS.IDENTITY_ROLE.TITLE",
        };
    }

    prepareFilterDto() {
        const formValue = this.filterForm.value;

        this.filter.code = formValue.code;
        this.filter.personnelID = (formValue.personnelID || {})['id'];
        this.filter.identityRoleID = (formValue.identityRoleID || {})['id'];
    }

}