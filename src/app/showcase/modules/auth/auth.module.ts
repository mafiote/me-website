import { NgModule } from '@angular/core';
import { AUTH_PROVIDERS } from './services/index';
import { LoginComponent } from "./components/login.component";

@NgModule({
    imports: [],
    exports: [],
    declarations: [

    ],
    providers: [
        ...AUTH_PROVIDERS
    ],
})
export class AuthModule { }
