import { Component, OnInit } from '@angular/core';
import { LoginDto } from "../dto/index";
import { AuthService } from "../services/auth.service";
import { Router } from '@angular/router';
import { SCREEN, webPath } from '../../../core/routing/screen';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { StorageService, StorageKey } from '../../../core/storage';
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    // Tip: Test kullanıcı için bu kısım doldurulabilir.
    // loginDto = new LoginDto("anilyildirim12@gmail.com", "Test123*");
    loginDto = new LoginDto("", "");
    inProgress = false;

    constructor(private authService: AuthService,
        private router: Router,
        protected messageService: MessageService,
        private translate: TranslateService,
        private storageService: StorageService) { }

    ngOnInit() { }

    login() {
        this.inProgress = true;
        this.authService.login(this.loginDto).subscribe(
            (res) => {
                this.router.navigate([webPath(SCREEN.HOME.PATH)]);
            },
            (err) => {
                this.inProgress = false;
                this.translate.get(['COMMON.MSG', 'LOGIN.ERROR']).subscribe((lang: any) => {
                    const title = lang['COMMON.MSG'].SEVERITY.ERROR;
                    const msg = lang['LOGIN.ERROR'];
                    this.messageService.add({ severity: 'error', summary: title, detail: msg });
                });
            }
        );
    }

    signup() {
        console.log(JSON.stringify(this.loginDto));
    }

}