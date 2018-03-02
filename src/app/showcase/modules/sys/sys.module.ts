import { NgModule } from '@angular/core';
import { SYS_PROVIDERS } from './services/index';

@NgModule({
    imports: [],
    exports: [],
    declarations: [

    ],
    providers: [
        ...SYS_PROVIDERS,
    ]
})
export class SysModule { }
