import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';

import { SCREEN } from '../../../../../core/routing/screen';
import { StorageKey, StorageService } from '../../../../../core/storage';
import { RsSimpleCardComponent } from '../../../../_base/components/index';
import { SysRoleDto, RoleGroupDetailDto, RoleGroupUserDto } from '../../../dto/role';
import { SysRoleService } from '../../../services/role.service';
import { FormBuilder } from '@angular/forms';
import { RsValidators } from '../../../../../core/lib/form';

@Component({
    selector: 'sys-role-card',
    templateUrl: 'role-card.component.html',
    styles: [
        `
        .tool-chips {
            color: #ecf0f1;
            margin-left: 1px;
            margin-top: 10px;
            display: inline-block;
            padding: 0 25px;
            line-height: 20px;
            border-radius: 10px;
            background-color: #95a5a6;
        }

        .remove-button {
            font-size: 9px;
            cursor: pointer;
            margin-left: 3px;
        }

        .kaizen-labels {
            margin-top: 15px;
            padding-left: 4px;
        }
        `
    ]
})

export class SysRoleCardComponent
    extends RsSimpleCardComponent<SysRoleDto, SysRoleService>
    implements OnInit {

    identityRoleLists: any[] = [];
    userLists: any[] = [];

    /**
     * Update işlemi için deçici diziler. Silinen kayıtlar
     * eğer db'de kayıtlı ise bu dizilere eklenir. Kaydetme işlemi
     * öncesinde giden dizinin altına isDeleted olarak eklenir.
     */
    deletedDetails: any[] = [];
    deletedUsers: any[] = [];
    selectedRoleGroup: any[] = [];
    selectedUserList: any[] = [];

    constructor(
        protected messageService: MessageService,
        protected confirmationService: ConfirmationService,
        protected translate: TranslateService,
        protected service: SysRoleService,
        public storageService: StorageService,
        public fb: FormBuilder
    ) {
        super(messageService, confirmationService, translate, service, fb);
    }

    ngOnInit() {
        this.fillList();
        super.ngOnInit();
    }

    async fillList() {
        console.log(this.rec);

        this.userLists = await this.service.get(null, 'AutoCompleteListForIdentity', 'pd/Personnel').toPromise();
        console.log(this.userLists);
        this.selectedUserList = [];
        if (this.rec && this.rec.users && this.rec.users.length > 0) {
            this.rec.users.forEach(el => {
                const userList = this.userLists.find(s => s.id === el.identityUserID);
                if (userList) {
                    this.selectedUserList.push(userList);
                }
            });
        }
        this.identityRoleLists = await this.service.get(null, 'Roles', 'Account').toPromise();
        console.log(this.identityRoleLists);
        this.selectedRoleGroup = [];
        if (this.rec && this.rec.roleGroupDetails && this.rec.roleGroupDetails.length > 0) {
            this.rec.roleGroupDetails.forEach(el => {
                const roleGroupList = this.identityRoleLists.find(s => s.id === el.identityRoleID);
                // console.log(roleGroupList);
                if (roleGroupList) {
                    this.selectedRoleGroup.push(roleGroupList);
                }
            });
        }

    }

    removeRoleList(id) {
        this.selectedRoleGroup.splice(id, 1);
        this.form.markAsDirty();
    }

    removeUserList(id) {
        this.selectedUserList.splice(id, 1);
        this.form.markAsDirty();
    }

    newRecord(): any {
        return new SysRoleDto();
    }

    setScreenCode(): void {
        this.screenCode = SCREEN.SYS.ROLE_GROUP.CODE;
    }

    buildForm(model: SysRoleDto) {
        this.form = this.fb.group({
            code: [model.code]
        });
    }

    prepareSaveDto() {
        const formValue = this.form.value;
        this.rec.code = formValue.code;
        this.updatRoleGroup();
        this.updatUserLists();
    }

    updatRoleGroup() {
        // tüm kayıtlar silinmiş olarak işaretleniyor
        this.rec.roleGroupDetails = this.rec.roleGroupDetails || [];
        for (let i = 0; i < this.rec.roleGroupDetails.length; i++) {
            const el = this.rec.roleGroupDetails[i];
            el.isDeleted = true;
        }
        console.log(this.selectedRoleGroup);
        this.selectedRoleGroup = this.selectedRoleGroup || [];
        for (let i = 0; i < this.selectedRoleGroup.length; i++) {
            const el = this.selectedRoleGroup[i];

            const roleGroup = this.rec.roleGroupDetails.find(s => s.identityRoleID === el.id);

            if (roleGroup) {
                roleGroup.isDeleted = false;
            } else {
                const newRoleGroup = new RoleGroupDetailDto();
                newRoleGroup.identityRoleID = el.id;
                newRoleGroup.identityRoleName = el.text;
                this.rec.roleGroupDetails.push(newRoleGroup);
            }
        }
    }

    updatUserLists() {
        // tüm kayıtlar silinmiş olarak işaretleniyor
        this.rec.users = this.rec.users || [];
        for (let i = 0; i < this.rec.users.length; i++) {
            const el = this.rec.users[i];
            el.isDeleted = true;
        }
        console.log(this.selectedUserList);
        this.selectedUserList = this.selectedUserList || [];
        for (let i = 0; i < this.selectedUserList.length; i++) {
            const el = this.selectedUserList[i];

            const user = this.rec.users.find(s => s.identityUserID === el.id);

            if (user) {
                user.isDeleted = false;
            } else {
                const newUser = new RoleGroupUserDto();
                newUser.identityUserID = el.id;
                this.rec.users.push(newUser);
            }
        }
    }


}